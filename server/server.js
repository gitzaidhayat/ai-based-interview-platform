const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const clientUrl = process.env.CLIENT_URL || process.env.Client_URL;

app.use(
  cors({
    origin: clientUrl || true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Platform API' });
});

const PORT = process.env.PORT || 5000;

// Connect to database then start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});