/**
 * 维护用户ID自增长表
 */
const mongoose = require('mongoose');
const CounterSchema = mongoose.Schema({
    c_id: String,
    sequence_value: Number
});

module.exports = mongoose.model('counters', CounterSchema, 'counters');
