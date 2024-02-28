const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://admin:aZ12345678@m1p11mean-aro-kenny.zfdt81p.mongodb.net/?retryWrites=true&w=majority&appName=m1p11mean-Aro-Kenny';

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