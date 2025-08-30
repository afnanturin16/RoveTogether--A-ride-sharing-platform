import { useEffect, useState } from "react";
import "./MyProfile.css";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const json = await response.json();

        if (response.ok) {
          setUser(json);
        } else {
          setError(json.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">Your journey with Rove Together</p>
      </div>

      {user && (
        <div className="profile-content">
          {/* Main Profile Card */}
          <div className="profile-card main-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.fullname?.firstname?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            
            <div className="profile-info">
              <h2 className="user-name">
                {user.fullname?.firstname} {user.fullname?.lastname}
              </h2>
              <p className="user-email">
                <span className="icon">📧</span>
                {user.email}
              </p>
              
              <div className="rating-section">
                <div className="rating-display">
                  <div className="stars">
                    {renderStars(parseFloat(user.averageRating || 0))}
                  </div>
                  <span className="rating-text">
                    {user.averageRating || 0} ({user.totalRatings || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>{user.totalRides || 0}</h3>
                <p>Rides Created</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{user.completedRides || 0}</h3>
                <p>Completed Rides</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{user.averageRating || 0}</h3>
                <p>Average Rating</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{user.totalRatings || 0}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="profile-details">
            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Type:</span>
                  <span className="detail-value">
                    {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
