import React, { useEffect, useState } from "react";
// 💡 REINTRODUCED: Import the secure API client for fetching the article
import apiClient from "../utils/apiClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 💡 REMOVED: Static Data remains the same

// 💡 NEW: API endpoint for fetching chart data
const CHART_API_URL = "/api/summary-data";
// API endpoint for the featured article (ID 2)
const ARTICLES_API_URL = "/api/articles?id=2";

function Summary() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articleError, setArticleError] = useState(null);

  useEffect(() => {
    let chartError = null;
    let articleErr = null;

    // --- 1. Fetch Chart Data (Dynamic) ---
    const fetchChartData = async () => {
      try {
        const response = await apiClient.get(CHART_API_URL);
        const investmentData = response.data.data;

        const labels = investmentData.map((item) => item.year);
        const cleanData = investmentData.map((item) => item.clean);
        const fossilData = investmentData.map((item) => item.fossil);

        const newChartData = {
          labels,
          datasets: [
            {
              label: "Clean Energy Investment",
              data: cleanData,
              backgroundColor: "rgba(0, 119, 255, 0.7)",
              borderColor: "rgba(0, 119, 255, 1)",
              borderWidth: 1,
              stack: "investment",
            },
            {
              label: "Fossil Fuel Investment",
              data: fossilData,
              backgroundColor: "rgba(102, 51, 153, 0.7)",
              borderColor: "rgba(102, 51, 153, 1)",
              borderWidth: 1,
              stack: "investment",
            },
          ],
        };
        setChartData(newChartData);
        chartError = null;
      } catch (err) {
        console.error("Fetch failed for chart data:", err);
        chartError = "Failed to load chart data. Check API connection.";
      }
    };

    // --- 2. Fetch Featured Article (Dynamic) ---
    const fetchFeaturedArticle = async () => {
      try {
        const response = await apiClient.get(ARTICLES_API_URL);
        if (response.data.data) {
          setFeaturedArticle(response.data.data);
        } else {
          setArticleError("Featured article (ID 2) not found.");
        }
      } catch (err) {
        console.error("Fetch failed for featured article:", err);
        articleErr = "Could not load featured article.";
      }
    };

    // --- Execute both fetches and handle final state ---
    Promise.all([fetchChartData(), fetchFeaturedArticle()])
      .then(() => {
        // Update error state if either fetch failed
        if (chartError || articleErr) {
          setError(chartError);
          setArticleError(articleErr);
        }
      })
      .catch((e) => {
        // Catch any uncaught errors, though the specific try/catch blocks should handle most
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // --- Chart Options (Remains the same) ---
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Global Investment in Energy (Billion USD)",
        font: { size: 18 },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Year" },
        stacked: true,
      },
      y: {
        title: { display: true, text: "Investment (Billion USD)" },
        stacked: true,
      },
    },
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div style={{ padding: "20px", fontSize: "1.2em", textAlign: "center" }}>
        Loading summary and featured article...
      </div>
    );
  }

  if (error || articleError) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        Error loading summary: **{error || articleError}**
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ width: "60%", margin: "40px auto" }}>
        {/* --- Chart Display Section --- */}
        <h2 className="text-center mb-4">Global Energy Investment Trends</h2>
        {chartData ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p>No chart data to display.</p>
        )}
        <p className="mt-3 text-center text-muted small">
          Data derived from IEA estimates for 2015-2024.
        </p>
        <p>
          The chart shows the amount of money invested in clean energy compared
          to that invested in fossil fuels from 2015 to 2024. The diagram shows
          steady investment in clean energy from 2015 to 2019, followed by a
          rapid increase from 2020 to 2024.
        </p>

        {/* --- Featured Article Display Section (Article ID 2) --- */}
        <div style={{ width: "100%", margin: "60px auto 40px" }}>
          <h3 className="mb-4 text-center">Featured Context</h3>
          {featuredArticle ? (
            <div
              style={{
                border: "1px solid #17a2b8",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(23, 162, 184, 0.1)",
              }}>
              <h4 style={{ color: "#17a2b8", marginBottom: "10px" }}>
                {featuredArticle.title}
              </h4>
              <p style={{ color: "#555" }}>{featuredArticle.body}</p>
              {featuredArticle.article_url && (
                <a
                  href={featuredArticle.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#17a2b8", fontWeight: "bold" }}>
                  Read More &raquo;
                </a>
              )}
            </div>
          ) : (
            <p className="text-center text-muted">
              Featured article not available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summary;
