// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import News from "./components/News";

import StockRow from "./components/StockRow";
import StockChart from "./components/StockChart";

function App() {
  const [input, setInput] = useState("");
  const [tickers, setTickers] = useState([]);
  const [invalidTickers, setInvalidTickers] = useState([]);

  const handleInputChange = (event) => {
    setInput(event.target.value.toUpperCase());
  };

  const validateTicker = async (ticker) => {
    const response = await fetch(
      `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_c07af1abb24c45e3ade362a5ce80a1ce`
    );
    return response.ok;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    if (input === "DONE") {
      setInput("");
      return;
    }

    const isValid = await validateTicker(input);
    if (isValid) {
      setTickers([...tickers, input]);
      setInvalidTickers(invalidTickers.filter((t) => t !== input));
    } else {
      setInvalidTickers([...invalidTickers, input]);
    }

    setInput("");
  };

  return (
    
    <Router>
      <div className="App">
     <header className="text-center h1">Shubh's Stock analyser</header> 
        <div className="container full-width">
          <Routes>
            <Route path="/news/:ticker" element={<News />} />
            <Route
              path="/"
              element={
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Wrap the input and button in a form element */}
                      <form onSubmit={handleSubmit}>
                        <input
                        className="form-control mr-sm-2"
                          type="text"
                          value={input}
                          onChange={handleInputChange}
                          placeholder="Enter ticker symbol"
                        />
                        <button className="btn btn-outline-success " type="submit">Submit</button>
                      </form>
                      {invalidTickers.length > 0 && (
                        <div className="invalid-tickers">
                          Invalid tickers: {invalidTickers.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <ul className="list-group list-group-flush">
                            {tickers.map((ticker) => (
                              <Link to={`/stock/${ticker}`} key={ticker}>
                                <StockRow ticker={ticker} />
                              </Link>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/stock/:ticker" element={<StockChart />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;