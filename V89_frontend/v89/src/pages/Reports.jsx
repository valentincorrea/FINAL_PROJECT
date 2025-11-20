import React, { useEffect, useState } from "react";
import axios from "axios";
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

function Reports() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Use Axios to fetch the data
        const response = await axios.get(API_URL);

        // Data is expected to be nested under the 'data' key from the API response
        const forecastArray = response.data.data;

        // --- Data Transformation for Chart.js ---
        const labels = forecastArray.map((item) => item.technology);
        const rankings = forecastArray.map((item) => item.forecast_rank_2030);

        // Structure the data object for the Bar chart
        const newChartData = {
          labels,
          datasets: [
            {
              label: "Forecast Rank (1 = Highest)",
              data: rankings,
              // Use colors to differentiate bars
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)", // Red (Rank 1)
                "rgba(54, 162, 235, 0.6)", // Blue
                "rgba(75, 192, 192, 0.6)", // Green
                "rgba(255, 159, 64, 0.6)", // Orange (Rank 4)
              ],
              borderColor: "rgba(0, 0, 0, 0.8)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(newChartData);
        setError(null);
      } catch (err) {
        console.error("Axios fetch failed for Reports:", err);
        setError(
          "Failed to load forecast data. Check API connection and route."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  // --- Chart Options ---
  const options = {
    responsive: true,
    indexAxis: "y", // Make it a horizontal bar chart for better readability
    plugins: {
      legend: { display: false }, // Hide the legend since there's only one dataset
      title: {
        display: true,
        text: "Clean Energy Technology Ranking (2030 Forecast)",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Forecast Rank (Lower is Better)",
        },
        // Ensure the ranking scale starts at 1 and goes up to 4 or 5
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        reverse: true, // Rank 1 should be on the right
      },
      y: {
        // Use y-axis for technology labels
      },
    },
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading forecast report...
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
    <div className="main-content">
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
          Data source:{" "}
          <span>
            <a href="https://www.iea.org/reports/renewables-2024/global-overview">
              Global electricity generation by renewable energy technology main
              case, 2023 and 2030.
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Reports;
