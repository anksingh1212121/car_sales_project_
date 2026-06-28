const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/states',    require('./routes/states'));
app.use('/api/dealers',   require('./routes/dealers'));
app.use('/api/cars',      require('./routes/cars'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/sales',     require('./routes/sales'));
app.use('/api/feedback',  require('./routes/feedback'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ message: 'Car Sales Management API is running.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
