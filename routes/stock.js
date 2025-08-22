const express = require('express');
const router = express.Router();
const axios = require('axios');
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
    const ticker = req.body.ticker;

    // 1. Fetch current price from Finnhub
    const finnhubRes = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_API_KEY}`);
    const currentPrice = finnhubRes.data.c; // 'c' is the key for current price in Finnhub's response

    if (currentPrice === 0) {
      return res.status(404).json({ msg: 'Invalid stock ticker' });
    }

    // 2. Create and save the new stock with the price
    const newStock = new Stock({
      ticker: ticker,
      price: currentPrice
    });

    const stock = await newStock.save();
    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;