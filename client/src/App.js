import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stocks');
      setStocks(res.data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker) return;
    try {
      await axios.post('http://localhost:5000/api/stocks', { ticker });
      setTicker('');
      fetchWatchlist();
    } catch (err) {
      console.error('Error adding stock:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Watchlist</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker (e.g., AAPL)"
          />
          <button type="submit">Add Stock</button>
        </form>
        <div className="watchlist">
          {stocks.map((stock) => (
            <div key={stock._id} className="stock-item">
              <span className="stock-ticker">{stock.ticker}</span>
              <span className="stock-price">
  {stock.price ? `$${stock.price.toFixed(2)}` : 'Loading...'}
</span>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;