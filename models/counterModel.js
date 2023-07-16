const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    seq: {
        type: Number,
        default: 0
    },
});

const Counter = mongoose.model('counter', CounterSchema);

module.exports = {
    Counter
}
