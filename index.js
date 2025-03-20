const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const {authRoutes} = require('./routes/auth');
const { default: mongoose } = require('mongoose');
const jobRoutes = require('./routes/job');

dotenv.config();
const PORT =  3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extened: true }));
app.use(errorHandler);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);
app.get('/', async (req, res, next) => {
  try {
    res.send('Hello world');
  } catch (err) {
    next(err);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlPArser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.log(err);
    });
});
