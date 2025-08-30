import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminChart from '../components/AdminChart';
import AdminTrendChart from '../components/AdminTrendChart';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRides: 0,
    totalMessages: 0,
    totalRatings: 0
  });
  
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Check user role from localStorage first
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('Current user role:', user.role);
          if (user.role !== 'admin') {
            setIsAdmin(false);
            return;
          }
        }
        
        // Fetch admin profile first
        const profileResponse = await fetch('/admin/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.status === 403) {
          console.log('Admin access denied - user is not admin');
          setIsAdmin(false);
          return;
        }

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch admin profile');
        }

        const profileData = await profileResponse.json();
        console.log('Admin profile data:', profileData);
        setAdminProfile(profileData);

        // Fetch all data in parallel
        const [usersResponse, ridesResponse, messagesResponse, ratingsResponse] = await Promise.all([
          fetch('/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/admin/rides', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/admin/messages', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/admin/ratings', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!usersResponse.ok || !ridesResponse.ok || !messagesResponse.ok || !ratingsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [usersData, ridesData, messagesData, ratingsData] = await Promise.all([
          usersResponse.json(),
          ridesResponse.json(),
          messagesResponse.json(),
          ratingsResponse.json()
        ]);

        setUsers(usersData);
        setRides(ridesData);
        setMessages(messagesData);
        setRatings(ratingsData);

        setStats({
          totalUsers: usersData.length,
          totalRides: ridesData.length,
          totalMessages: messagesData.length,
          totalRatings: ratingsData.length
        });

      } catch (err) {
        setError(err.message || 'An error occurred while loading admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete user');
        }

        setUsers(users.filter(user => user._id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/admin/rides/${rideId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete ride');
        }

        setRides(rides.filter(ride => ride._id !== rideId));
        setStats(prev => ({ ...prev, totalRides: prev.totalRides - 1 }));
        
      } catch (err) {
        setError(err.message || 'Failed to delete ride');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/admin/messages/${messageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete message');
        }

        setMessages(messages.filter(message => message._id !== messageId));
        setStats(prev => ({ ...prev, totalMessages: prev.totalMessages - 1 }));
        
      } catch (err) {
        setError(err.message || 'Failed to delete message');
      }
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'admin' 
        ? `/admin/users/${user._id}/remove-admin` 
        : `/admin/users/${user._id}/make-admin`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user role');
      }

      const { user: updatedUser } = await response.json();
      setUsers(users.map(u => u._id === user._id ? { ...u, role: updatedUser.role } : u));
      
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!isAdmin) {
    return <Navigate to="/home" />;
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {adminProfile?.fullname?.firstname}!</p>
        </div>
        <div className="admin-actions">
          <div className="admin-avatar">
            <div className="avatar-circle">
              {adminProfile?.fullname?.firstname?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rides">🚗</div>
          <div className="stat-content">
            <h3>{stats.totalRides}</h3>
            <p>Total Rides</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon messages">💬</div>
          <div className="stat-content">
            <h3>{stats.totalMessages}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ratings">⭐</div>
          <div className="stat-content">
            <h3>{stats.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'rides' ? 'active' : ''}`}
          onClick={() => setActiveTab('rides')}
        >
          🚗 Rides
        </button>
        <button 
          className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👨‍💼 Profile
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-panel">
            <h2>Dashboard Overview</h2>
            <div className="overview-content">
              <div className="chart-container">
                <AdminChart stats={stats} />
              </div>
              <div className="overview-stats">
                <div className="overview-stat-card">
                  <h3>Quick Insights</h3>
                  <div className="insight-item">
                    <span className="insight-label">Most Active Category:</span>
                    <span className="insight-value">
                      {stats.totalUsers > stats.totalRides && stats.totalUsers > stats.totalMessages && stats.totalUsers > stats.totalRatings ? 'Users' :
                       stats.totalRides > stats.totalMessages && stats.totalRides > stats.totalRatings ? 'Rides' :
                       stats.totalMessages > stats.totalRatings ? 'Messages' : 'Ratings'}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Total Platform Activity:</span>
                    <span className="insight-value">
                      {stats.totalUsers + stats.totalRides + stats.totalMessages + stats.totalRatings}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Average per Category:</span>
                    <span className="insight-value">
                      {Math.round((stats.totalUsers + stats.totalRides + stats.totalMessages + stats.totalRatings) / 4)}
                    </span>
                  </div>
                </div>
                <div className="trend-chart-container">
                  <AdminTrendChart stats={stats} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-panel">
            <h2>Manage Users</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.fullname.firstname} {user.fullname.lastname}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className={`role-button ${user.role === 'admin' ? 'admin' : 'user'}`}
                          onClick={() => handleToggleAdmin(user)}
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="rides-panel">
            <h2>Manage Rides</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Creator</th>
                    <th>Route</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map(ride => (
                    <tr key={ride._id}>
                      <td>{ride.user_id?.fullname?.firstname} {ride.user_id?.fullname?.lastname}</td>
                      <td>{ride.startingPoint} → {ride.destination}</td>
                      <td>{ride.date} at {ride.time}</td>
                      <td>
                        <span className={`status-badge ${ride.status}`}>
                          {ride.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteRide(ride._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-panel">
            <h2>Manage Messages</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(message => (
                    <tr key={message._id}>
                      <td>{message.sender?.fullname?.firstname} {message.sender?.fullname?.lastname}</td>
                      <td>{message.receiver?.fullname?.firstname} {message.receiver?.fullname?.lastname}</td>
                      <td className="message-content">
                        {message.content.length > 50 
                          ? `${message.content.substring(0, 50)}...` 
                          : message.content
                        }
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteMessage(message._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && adminProfile && (
          <div className="profile-panel">
            <h2>Admin Profile</h2>
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-avatar">
                  <div className="avatar-circle large">
                    {adminProfile.fullname?.firstname?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                </div>
                
                <div className="profile-info">
                  <h3 className="admin-name">
                    {adminProfile.fullname?.firstname} {adminProfile.fullname?.lastname}
                  </h3>
                  <p className="admin-email">
                    <span className="icon">📧</span>
                    {adminProfile.email}
                  </p>
                  
                  <div className="admin-stats">
                    <div className="stat-item">
                      <span className="stat-label">Average Rating:</span>
                      <span className="stat-value">{adminProfile.averageRating || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Rides:</span>
                      <span className="stat-value">{adminProfile.totalRides || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Completed Rides:</span>
                      <span className="stat-value">{adminProfile.completedRides || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Reviews:</span>
                      <span className="stat-value">{adminProfile.totalRatings || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;