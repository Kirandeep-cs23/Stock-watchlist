const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// @route   GET api/stocks
// @desc    Get all stocks from the watchlist
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/stocks
// @desc    Add a stock to the watchlist
router.post('/', async (req, res) => {
  try {
    const newStock = new Stock({
      ticker: req.body.ticker
    });
    const stock = await newStock.save();
    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;