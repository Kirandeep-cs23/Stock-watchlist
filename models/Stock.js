const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  }
});

module.exports = mongoose.model('Stock', StockSchema);