const router = require('express').Router();
const pool   = require('../db');

// GET all states
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM state ORDER BY state_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single state
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM state WHERE state_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'State not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create state
router.post('/', async (req, res) => {
  const { state_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO state (state_name) VALUES ($1) RETURNING *',
      [state_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE state
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM state WHERE state_id = $1', [req.params.id]);
    res.json({ message: 'State deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
