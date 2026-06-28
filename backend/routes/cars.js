const router = require('express').Router();
const pool   = require('../db');

// GET all cars
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM car ORDER BY brand, model_number');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM car WHERE car_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Car not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create car
router.post('/', async (req, res) => {
  const { brand, model_number } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO car (brand, model_number) VALUES ($1, $2) RETURNING *',
      [brand, model_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update car
router.put('/:id', async (req, res) => {
  const { brand, model_number } = req.body;
  try {
    const result = await pool.query(
      'UPDATE car SET brand=$1, model_number=$2 WHERE car_id=$3 RETURNING *',
      [brand, model_number, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE car
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM car WHERE car_id = $1', [req.params.id]);
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
