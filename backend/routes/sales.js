const router = require('express').Router();
const pool   = require('../db');

// GET all sales (full join)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.sale_id, s.sale_date, s.price,
        cu.customer_id, cu.customer_name,
        ca.car_id, ca.brand, ca.model_number,
        d.dealer_id, d.dealer_name,
        st.state_name
      FROM sales s
      JOIN customer cu ON s.customer_id = cu.customer_id
      JOIN car ca      ON s.car_id      = ca.car_id
      JOIN dealer d    ON s.dealer_id   = d.dealer_id
      JOIN state st    ON d.state_id    = st.state_id
      ORDER BY s.sale_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single sale
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.sale_id, s.sale_date, s.price,
        cu.customer_name, cu.phone_no, cu.address,
        ca.brand, ca.model_number,
        d.dealer_name, d.contact_no,
        st.state_name
      FROM sales s
      JOIN customer cu ON s.customer_id = cu.customer_id
      JOIN car ca      ON s.car_id      = ca.car_id
      JOIN dealer d    ON s.dealer_id   = d.dealer_id
      JOIN state st    ON d.state_id    = st.state_id
      WHERE s.sale_id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sale not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create sale
router.post('/', async (req, res) => {
  const { sale_date, price, dealer_id, car_id, customer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sales (sale_date, price, dealer_id, car_id, customer_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [sale_date, price, dealer_id, car_id, customer_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE sale
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sales WHERE sale_id = $1', [req.params.id]);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
