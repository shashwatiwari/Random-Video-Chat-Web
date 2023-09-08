const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// .then(() => console.log('Connected to MongoDB'))
// .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});

