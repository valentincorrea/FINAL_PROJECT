import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
// 💡 REMOVED: import Articles from "../components/Articles";
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

// The specific API endpoint for the forecast data
const API_URL = "/api/reports";
// 💡 NEW: API endpoint for the featured article (ID 1)
const ARTICLES_API_URL = "/api/articles?id=1";

function Reports() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 💡 NEW STATE: To hold the featured article content
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articleError, setArticleError] = useState(null);

  useEffect(() => {
    // --- 1. Fetch Chart Data ---
    const fetchForecastData = async () => {
      try {
        const response = await apiClient.get(API_URL);

        const forecastArray = response.data.data;
        const labels = forecastArray.map((item) => item.technology);
        const rankings = forecastArray.map((item) => item.forecast_rank_2030);

        const newChartData = {
          labels,
          datasets: [
            {
              label: "Forecast Rank (1 = Highest)",
              data: rankings,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: "rgba(0, 0, 0, 0.8)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(newChartData);
        setError(null);
      } catch (err) {
        console.error("Fetch failed for Reports:", err);
        setError("Failed to load forecast data. Ensure you are logged in.");
      } finally {
        // We will keep setLoading false until both fetches are complete, but for now, we'll let it handle the chart loading.
      }
    };

    // --- 2. Fetch Featured Article ---
    const fetchFeaturedArticle = async () => {
      try {
        // Fetch article with ID 1
        const response = await apiClient.get(ARTICLES_API_URL);

        if (response.data.data) {
          setFeaturedArticle(response.data.data);
        } else {
          setArticleError("Featured article (ID 1) not found.");
        }
      } catch (err) {
        console.error("Fetch failed for featured article:", err);
        setArticleError("Could not load featured article.");
      } finally {
        // Set loading to false only after all fetches are attempted
        setLoading(false);
      }
    };

    fetchForecastData();
    fetchFeaturedArticle();
  }, []);

  // --- Chart Options (Remains the same) ---
  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Clean Energy Technology Ranking (2030 Forecast)",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Forecast Rank (Lower is Better)" },
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        reverse: true,
      },
      y: {},
    },
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading forecast report and featured article...
      </div>
    );
  }

  if (error || articleError) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        Error loading report: {error || articleError}
      </div>
    );
  }

  return (
    <>
      <div className="main-content">
        {/* --- Chart Display Section --- */}
        <div
          style={{
            width: "60%",
            margin: "40px auto",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
          }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Technology Forecast
          </h2>
          {chartData ? (
            <Bar options={options} data={chartData} />
          ) : (
            <p>No forecast data available.</p>
          )}
          <p>
            <span>
              <a
                href="https://www.iea.org/reports/renewables-2024/global-overview"
                target="blanc">
                Global electricity generation by renewable energy technology
                main case, 2023 and 2030.
              </a>
            </span>
          </p>
          {/* 💡 USER'S ADDED DESCRIPTION */}
          <p>
            The chart shows a forecast of the global renewable electricity
            generation. Additionally, it breaks down the milestone year by year
            and the respective energy source. According to the estimates, "solar
            power generation will surpass wind and hydropower by 2030."
          </p>
        </div>

        {/* --- Featured Article Display Section --- */}
        <div style={{ width: "60%", margin: "40px auto" }}>
          <h3 className="mb-4 text-center">Featured Insight</h3>
          {featuredArticle ? (
            <div
              style={{
                border: "1px solid #007bff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 119, 255, 0.1)",
              }}>
              <h4 style={{ color: "#007bff", marginBottom: "10px" }}>
                {featuredArticle.title}
              </h4>
              <p style={{ color: "#555" }}>{featuredArticle.body}</p>
              {featuredArticle.article_url && (
                <a
                  href={featuredArticle.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", fontWeight: "bold" }}>
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
    </>
  );
}

export default Reports;
