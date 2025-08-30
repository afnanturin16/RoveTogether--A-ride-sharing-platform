import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import "./LoginForm.css";

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = { email, password };

            const response = await fetch('/users/login', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || "Login failed");
            }

            // Store token and user info
            localStorage.setItem('token', json.token);
            localStorage.setItem('user', JSON.stringify(json.user));

            console.log('Login successful:', json);
            console.log('User role:', json.user.role);
            console.log('Redirecting to:', json.user.role === 'admin' ? '/admin' : '/home');

            // Clear form
            setEmail('');
            setPassword('');
            setError(null);

            // Redirect based on user role
            if (json.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError(err.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    if (localStorage.getItem('token')) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <div className="mode-toggle">
                    <button 
                        className={`toggle-btn ${!isAdminMode ? 'active' : ''}`}
                        onClick={() => setIsAdminMode(false)}
                    >
                        <span className="icon">👤</span>
                        User Login
                    </button>
                    <button 
                        className={`toggle-btn ${isAdminMode ? 'active' : ''}`}
                        onClick={() => setIsAdminMode(true)}
                    >
                        <span className="icon">👨‍💼</span>
                        Admin Login
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            disabled={isLoading}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            disabled={isLoading}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        className="login-button" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <span className="btn-icon">🔐</span>
                                {isAdminMode ? 'Admin Login' : 'User Login'}
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? 
                        <button 
                            className="link-button"
                            onClick={() => navigate('/register')}
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
