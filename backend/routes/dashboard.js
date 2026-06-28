const router = require('express').Router();
const pool   = require('../db');

// GET dashboard summary stats
router.get('/stats', async (req, res) => {
  try {
    const [totalSales, totalRevenue, totalCars, totalCustomers, totalDealers, revenueByState, topBrands, monthlySales] = await Promise.all([

      pool.query('SELECT COUNT(*) AS total FROM sales'),

      pool.query('SELECT COALESCE(SUM(price), 0) AS total FROM sales'),

      pool.query('SELECT COUNT(*) AS total FROM car'),

      pool.query('SELECT COUNT(*) AS total FROM customer'),

      pool.query('SELECT COUNT(*) AS total FROM dealer'),

      pool.query(`
        SELECT st.state_name, COUNT(s.sale_id) AS sales_count, COALESCE(SUM(s.price), 0) AS revenue
        FROM state st
        LEFT JOIN dealer d ON d.state_id = st.state_id
        LEFT JOIN sales s  ON s.dealer_id = d.dealer_id
        GROUP BY st.state_name
        ORDER BY revenue DESC
        LIMIT 6
      `),

      pool.query(`
        SELECT ca.brand, COUNT(s.sale_id) AS units_sold
        FROM car ca
        LEFT JOIN sales s ON s.car_id = ca.car_id
        GROUP BY ca.brand
        ORDER BY units_sold DESC
        LIMIT 5
      `),

      pool.query(`
        SELECT TO_CHAR(sale_date, 'Mon') AS month,
               EXTRACT(MONTH FROM sale_date) AS month_num,
               COUNT(*) AS count,
               SUM(price) AS revenue
        FROM sales
        WHERE EXTRACT(YEAR FROM sale_date) = 2024
        GROUP BY TO_CHAR(sale_date, 'Mon'), EXTRACT(MONTH FROM sale_date)
        ORDER BY month_num
      `),
    ]);

    res.json({
      totalSales:     parseInt(totalSales.rows[0].total),
      totalRevenue:   parseFloat(totalRevenue.rows[0].total),
      totalCars:      parseInt(totalCars.rows[0].total),
      totalCustomers: parseInt(totalCustomers.rows[0].total),
      totalDealers:   parseInt(totalDealers.rows[0].total),
      revenueByState: revenueByState.rows,
      topBrands:      topBrands.rows,
      monthlySales:   monthlySales.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
