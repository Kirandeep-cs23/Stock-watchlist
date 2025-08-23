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
// @route   POST api/stocks
// @desc    Add a stock to the watchlist
router.post('/', async (req, res) => {
  try {
    const ticker = req.body.ticker.toUpperCase();

    const existingStock = await Stock.findOne({ ticker });
    if (existingStock) {
      return res.status(400).json({ msg: 'Stock already in watchlist' });
    }

    const finnhubRes = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_API_KEY}`);

    // --- ADD THESE TWO LINES FOR DEBUGGING ---
    console.log('Finnhub API Response:', finnhubRes.data);
    console.log('Extracted Current Price:', finnhubRes.data.c);
    // -----------------------------------------

    const currentPrice = finnhubRes.data.c;

    if (currentPrice === 0) {
      return res.status(404).json({ msg: 'Invalid stock ticker' });
    }

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
// @route   DELETE api/stocks/:id
// @desc    Delete a stock from the watchlist
// @route   DELETE api/stocks/:id
// @desc    Delete a stock from the watchlist
router.delete('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ msg: 'Stock not found' });
    }

    await stock.deleteOne();

    res.json({ msg: 'Stock removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;