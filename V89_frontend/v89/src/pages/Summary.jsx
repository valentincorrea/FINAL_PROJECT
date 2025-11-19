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

// Assuming the API is running on http://localhost:3000
const API_URL = "/api/summary";

function Summary() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // 💡 Use Axios to make the GET request
        const response = await axios.get(API_URL);

        // The API returns data inside 'data' property
        const plantData = response.data.data;

        // --- Data Transformation for Chart.js ---
        const labels = plantData.map((plant) => plant.source);
        const capacityData = plantData.map((plant) => plant.capacity_mw);
        const generationData = plantData.map(
          (plant) => plant.generation_gwh_yr / 1000
        ); // Convert GWh/yr to TWh/yr

        // Structure the data object for the Bar chart
        const newChartData = {
          labels,
          datasets: [
            {
              label: "Capacity (MW)",
              data: capacityData,
              backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue for capacity
              borderColor: "rgba(54, 162, 235, 1)",
              yAxisID: "y1", // Assign to the primary y-axis
            },
            {
              label: "Annual Generation (TWh)",
              data: generationData,
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Green for generation
              borderColor: "rgba(75, 192, 192, 1)",
              yAxisID: "y2", // Assign to the secondary y-axis
            },
          ],
        };

        setChartData(newChartData);
        setError(null);
      } catch (err) {
        console.error("Axios fetch failed:", err);
        setError("Failed to load chart data. Check API connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // --- Chart Options ---
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Clean Energy Plant Metrics" },
    },
    scales: {
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Capacity (MW)" },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Generation (TWh)" },
        grid: { drawOnChartArea: false }, // Only draw grid lines for the left axis
      },
    },
  };

  // --- Rendering ---

  if (loading) {
    return (
      <div style={{ padding: "20px", fontSize: "1.2em" }}>
        Loading chart data...
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  // Display the chart if data is available
  return (
    <div className="main-content">
      <div style={{ width: "80%", margin: "40px auto" }}>
        {chartData ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p>No data to display.</p>
        )}
      </div>
    </div>
  );
}

export default Summary;
