// Connection to database
const mongoose = require('mongoose');
mongoose.connect(
    'mongodb://localhost/mtg-drafter',
    { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set('useFindAndModify', false);

module.exports = mongoose
