const router = require('express').Router();
const pool   = require('../db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer ORDER BY customer_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single customer with their purchase history
router.get('/:id', async (req, res) => {
  try {
    const customer = await pool.query('SELECT * FROM customer WHERE customer_id = $1', [req.params.id]);
    if (customer.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });

    const purchases = await pool.query(`
      SELECT s.sale_id, s.sale_date, s.price,
             c.brand, c.model_number,
             d.dealer_name, st.state_name
      FROM sales s
      JOIN car c    ON s.car_id    = c.car_id
      JOIN dealer d ON s.dealer_id = d.dealer_id
      JOIN state st ON d.state_id  = st.state_id
      WHERE s.customer_id = $1
      ORDER BY s.sale_date DESC
    `, [req.params.id]);

    res.json({ ...customer.rows[0], purchases: purchases.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  const { customer_name, address, phone_no } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customer (customer_name, address, phone_no) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, address, phone_no]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  const { customer_name, address, phone_no } = req.body;
  try {
    const result = await pool.query(
      'UPDATE customer SET customer_name=$1, address=$2, phone_no=$3 WHERE customer_id=$4 RETURNING *',
      [customer_name, address, phone_no, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM customer WHERE customer_id = $1', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
