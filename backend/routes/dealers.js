const router = require('express').Router();
const pool   = require('../db');

// GET all dealers (with state name)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, s.state_name
      FROM dealer d
      JOIN state s ON d.state_id = s.state_id
      ORDER BY d.dealer_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single dealer
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, s.state_name
      FROM dealer d
      JOIN state s ON d.state_id = s.state_id
      WHERE d.dealer_id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dealer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create dealer
router.post('/', async (req, res) => {
  const { dealer_name, contact_no, state_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dealer (dealer_name, contact_no, state_id) VALUES ($1, $2, $3) RETURNING *',
      [dealer_name, contact_no, state_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update dealer
router.put('/:id', async (req, res) => {
  const { dealer_name, contact_no, state_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE dealer SET dealer_name=$1, contact_no=$2, state_id=$3 WHERE dealer_id=$4 RETURNING *',
      [dealer_name, contact_no, state_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE dealer
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM dealer WHERE dealer_id = $1', [req.params.id]);
    res.json({ message: 'Dealer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
