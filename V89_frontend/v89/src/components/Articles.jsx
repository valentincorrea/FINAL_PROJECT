import React, { useEffect, useState } from "react";
import axios from "axios";

// The new API endpoint
const API_URL = "/api/articles";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(API_URL);

        // Data is expected to be nested under the 'data' key from the API response
        setArticles(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Axios fetch failed for articles:", err);
        // Display a user-friendly error message
        setError(
          "Failed to load articles. Please check the backend connection and endpoint."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // --- RENDERING LOGIC ---

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading articles...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "60%",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}>
      {/* <h2>Latest Energy Articles ({articles.length})</h2> */}

      {articles.length === 0 ? (
        <p>No articles found in the database.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {articles.map((article, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.05)",
              }}>
              {/* Display the Title */}
              <h3 style={{ marginBottom: "5px" }}>{article.title}</h3>

              {/* Display the Body/Excerpt (using slice for brevity) */}
              <p style={{ fontSize: "0.9em", color: "#555" }}>
                {article.body
                  ? article.body.substring(0, 600) + "..."
                  : "No content available."}
              </p>

              {/* Display the URL/Link */}
              {article.article_url && (
                <a
                  href={article.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}>
                  Read Full Article →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;
