import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminChart = ({ stats }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Platform Statistics Overview',
        font: {
          size: 18,
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

  const data = {
    labels: ['Users', 'Rides', 'Messages', 'Ratings'],
    datasets: [
      {
        label: 'Total Count',
        data: [
          stats.totalUsers || 0,
          stats.totalRides || 0,
          stats.totalMessages || 0,
          stats.totalRatings || 0
        ],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(79, 172, 254, 0.8)',
          'rgba(250, 112, 154, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(79, 172, 254, 1)',
          'rgba(250, 112, 154, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="admin-chart">
      <Bar options={options} data={data} />
    </div>
  );
};

export default AdminChart;
