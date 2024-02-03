const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://0.0.0.0:27017/M1P11MEAN-ARO-KENNY';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });