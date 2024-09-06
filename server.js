const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const novelRoutes = require('./routes/novelRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const cartRoutes = require('./routes/cartRoutes');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/novels', novelRoutes);
app.use('/api/novels/:novelId/chapters', chapterRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/novels/:novelId/comments', commentRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});