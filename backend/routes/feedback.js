const router = require('express').Router();
const pool   = require('../db');

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        f.feedback_id, f.rating, f.comments, f.feedback_date,
        c.customer_name,
        d.dealer_name,
        st.state_name
      FROM feedback f
      JOIN customer c ON f.customer_id = c.customer_id
      JOIN dealer d   ON f.dealer_id   = d.dealer_id
      JOIN state st   ON d.state_id    = st.state_id
      ORDER BY f.feedback_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create feedback
router.post('/', async (req, res) => {
  const { rating, comments, feedback_date, dealer_id, customer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO feedback (rating, comments, feedback_date, dealer_id, customer_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [rating, comments, feedback_date, dealer_id, customer_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE feedback
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM feedback WHERE feedback_id = $1', [req.params.id]);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
