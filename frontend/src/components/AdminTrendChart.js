import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminTrendChart = ({ stats }) => {
  // Generate sample trend data (in a real app, this would come from backend)
  const generateTrendData = () => {
    const baseUsers = Math.max(stats.totalUsers - 5, 1);
    const baseRides = Math.max(stats.totalRides - 3, 1);
    const baseMessages = Math.max(stats.totalMessages - 2, 1);
    const baseRatings = Math.max(stats.totalRatings - 1, 1);

    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Users',
          data: [
            baseUsers,
            baseUsers + Math.floor(Math.random() * 3) + 1,
            baseUsers + Math.floor(Math.random() * 5) + 2,
            stats.totalUsers
          ],
          borderColor: 'rgba(102, 126, 234, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Rides',
          data: [
            baseRides,
            baseRides + Math.floor(Math.random() * 2) + 1,
            baseRides + Math.floor(Math.random() * 4) + 1,
            stats.totalRides
          ],
          borderColor: 'rgba(240, 147, 251, 1)',
          backgroundColor: 'rgba(240, 147, 251, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Messages',
          data: [
            baseMessages,
            baseMessages + Math.floor(Math.random() * 2) + 1,
            baseMessages + Math.floor(Math.random() * 3) + 1,
            stats.totalMessages
          ],
          borderColor: 'rgba(79, 172, 254, 1)',
          backgroundColor: 'rgba(79, 172, 254, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Ratings',
          data: [
            baseRatings,
            baseRatings + Math.floor(Math.random() * 1) + 1,
            baseRatings + Math.floor(Math.random() * 2) + 1,
            stats.totalRatings
          ],
          borderColor: 'rgba(250, 112, 154, 1)',
          backgroundColor: 'rgba(250, 112, 154, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Platform Growth Trends (Last 4 Weeks)',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#2d3748'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#4a5568',
          font: {
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#4a5568',
          font: {
            weight: '500'
          }
        }
      }
    }
  };

  const data = generateTrendData();

  return (
    <div className="admin-trend-chart">
      <Line options={options} data={data} />
    </div>
  );
};

export default AdminTrendChart;
