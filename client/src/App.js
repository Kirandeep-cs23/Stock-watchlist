import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // We will use this for styling

function App() {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState('');

  // This function runs once when the component loads
  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Fetches all stocks from our backend API
  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stocks');
      setStocks(res.data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  // Handles adding a new stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker) return; // Prevent adding empty tickers
    try {
      await axios.post('http://localhost:5000/api/stocks', { ticker });
      setTicker(''); // Clear the input box
      fetchWatchlist(); // Refresh the list
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
              {stock.ticker}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;