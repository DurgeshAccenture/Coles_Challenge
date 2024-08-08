import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "./Debounce";
import './SearchFeild.css'
function SearchFeild() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (searchQuery) => {
    if (searchQuery.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/data.json");
      const data = response.data;
      const filteredResults = data.filter((item) =>
        item.name.includes(searchQuery)
      );
      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(
    debounce((searchQuery) => fetchData(searchQuery), 300),
    []
  );

  useEffect(() => {
    debouncedFetchData(query);
  }, [query, debouncedFetchData]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

    const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "g");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="heading">
            <h1 className="mb-3">Search any fruits</h1>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              
            />
            {query && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          {loading && <div className="mt-2">Loading...</div>}
          {results.length > 0 && (
            <ul className="list-group mt-2">
              {results.map((result) => (
                <li
                  key={result.id}
                  className="list-group-item"
                  dangerouslySetInnerHTML={{ __html: highlightText(result.name, query) }}
                />
              ))}
            </ul>
          )}
          {results.length === 0 && !loading && query && (
            <div className="mt-2">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFeild;