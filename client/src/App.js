import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  const { sendMessage, lastJsonMessage } = useWebSocket('wss://ws.finnhub.io?token=d2km4d9r01qs23a2sa2gd2km4d9r01qs23a2sa30', {
    onOpen: () => console.log('WebSocket Connected'),
    shouldReconnect: (closeEvent) => true,
  });

  // Effect to fetch the initial watchlist
  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Effect to subscribe/unsubscribe when the list of stocks changes
  useEffect(() => {
    if (stocks.length > 0) {
      stocks.forEach(stock => {
        sendMessage(JSON.stringify({ type: 'subscribe', symbol: stock.ticker }));
      });
      return () => {
        stocks.forEach(stock => {
          sendMessage(JSON.stringify({ type: 'unsubscribe', symbol: stock.ticker }));
        });
      };
    }
  }, [stocks, sendMessage]);

  // Effect to handle incoming trade data from the WebSocket
  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage.type === 'trade') {
      const trades = lastJsonMessage.data;
      // Use a functional update to correctly update the state
      setStocks(prevStocks => {
        const newStocks = prevStocks.map(stock => ({ ...stock })); // Create a new array
        trades.forEach(trade => {
          const stockToUpdate = newStocks.find(s => s.ticker === trade.s);
          if (stockToUpdate) {
            stockToUpdate.price = trade.p; // Update the price
          }
        });
        return newStocks;
      });
    }
  }, [lastJsonMessage]);

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
    setError('');
    if (!ticker) return;
    try {
      await axios.post('http://localhost:5000/api/stocks', { ticker });
      setTicker('');
      fetchWatchlist();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding stock');
    }
  };

  const deleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${id}`);
      fetchWatchlist();
    } catch (err) {
      console.error('Error deleting stock:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Stock Watchlist</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker (e.g., AAPL)"
          />
          <button type="submit">Add Stock</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="watchlist">
          {stocks.map((stock) => (
            <StockItem key={stock._id} stock={stock} onDelete={deleteStock} />
          ))}
        </div>
      </header>
    </div>
  );
}

// Separate component for each stock item to handle its own color flash
function StockItem({ stock, onDelete }) {
  const [price, setPrice] = useState(stock.price);
  const [colorClass, setColorClass] = useState('');
  const prevPriceRef = useRef(stock.price);

  useEffect(() => {
    // This effect runs only when the price prop from the parent changes
    if (stock.price > prevPriceRef.current) {
      setColorClass('price-up');
    } else if (stock.price < prevPriceRef.current) {
      setColorClass('price-down');
    }
    
    setPrice(stock.price); // Update the local price state

    const timer = setTimeout(() => {
      setColorClass('');
    }, 500); // Flash for half a second

    // Update the ref for the next comparison
    prevPriceRef.current = stock.price;

    return () => clearTimeout(timer); // Cleanup timer
  }, [stock.price]);

  return (
    <div className="stock-item">
      <span className="stock-ticker">{stock.ticker}</span>
      <span className={`stock-price ${colorClass}`}>
        {price ? `$${price.toFixed(2)}` : 'Loading...'}
      </span>
      <button onClick={() => onDelete(stock._id)} className="delete-btn">X</button>
    </div>
  );
}

export default App;