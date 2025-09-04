# Real-Time MERN Stock Watchlist

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to create and manage a personalized stock watchlist with live, real-time price updates.



## Features

* **Live Price Updates:** Integrates with the Finnhub WebSocket API to provide real-time, streaming price data for watched stocks.
* **Dynamic UI:** The interface automatically updates prices and flashes green or red to indicate positive or negative price movement.
* **Full CRUD Functionality:** Users can Create (add), Read (view), and Delete stocks from their persistent watchlist.
* **Efficient Backend:** The Node.js and Express backend fetches initial price data, prevents duplicate entries, and manages all database interactions with MongoDB.
* **Responsive Frontend:** A clean, single-page application built with React to provide a seamless user experience.

## Tech Stack

* **Frontend:** React, Axios, `react-use-websocket`
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB Atlas
* **External APIs:** Finnhub API (REST & WebSocket)

## Local Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/simple-stock-watchlist.git](https://github.com/your-username/simple-stock-watchlist.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd simple-stock-watchlist
    ```

3.  **Setup the Backend:**
    * Navigate to the backend directory: `cd backend` (or stay in the root if your server files are there).
    * Install dependencies: `npm install`.
    * Create a `.env` file and add the following variables:
        ```
        MONGO_URI=your_mongodb_connection_string
        FINNHUB_API_KEY=your_finnhub_api_key
        ```
    * Start the backend server: `node server.js`.

4.  **Setup the Frontend:**
    * Open a new terminal and navigate to the `client` directory: `cd client`.
    * Install dependencies: `npm install`.
    * Open the `src/App.js` file and replace the placeholder with your Finnhub API key.
    * Start the frontend application: `npm start`.

The application will be running at `http://localhost:3000`.
