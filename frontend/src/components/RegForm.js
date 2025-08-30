import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./RegForm.css";

const RegForm = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        const user = { 
            firstname, 
            lastname, 
            email, 
            password,
            role: isAdminMode ? 'admin' : 'user'
        };
        
        console.log("Sending registration data:", { ...user, password: '[HIDDEN]' });
        console.log("isAdminMode:", isAdminMode);
        console.log("Role being sent:", user.role);
    
        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            let json;
            try {
                json = await response.json();
            } catch (err) {
                throw new Error('Invalid JSON response');
            }
    
            if (!response.ok) {
                setError(json.errors?.[0]?.msg || json.message || "Registration failed");
                return;
            }
    
            localStorage.setItem('token', json.token);
            localStorage.setItem('user', JSON.stringify(json.user));
            
            setFirstname('');
            setLastname('');
            setEmail('');
            setPassword('');
            setError(null);
            console.log('New User added', json);
            console.log('User role:', json.user.role);
            console.log('Navigating to:', json.user.role === 'admin' ? '/admin' : '/MyProfile');
    
            // Navigate based on user role
            if (json.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/MyProfile');
            }
        } catch (err) {
            console.error('Error:', err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (localStorage.getItem('token')) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Join Rove Together today</p>
                </div>

                <div className="mode-toggle">
                    <button 
                        className={`toggle-btn ${!isAdminMode ? 'active' : ''}`}
                        onClick={() => setIsAdminMode(false)}
                    >
                        <span className="icon">👤</span>
                        User Signup
                    </button>
                    <button 
                        className={`toggle-btn ${isAdminMode ? 'active' : ''}`}
                        onClick={() => setIsAdminMode(true)}
                    >
                        <span className="icon">👨‍💼</span>
                        Admin Signup
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstname}
                                required
                                disabled={isLoading}
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastname}
                                required
                                disabled={isLoading}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

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
                            placeholder="Create a password"
                        />
                    </div>

                    <button 
                        className="register-button" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <span className="btn-icon">🚀</span>
                                {isAdminMode ? 'Create Admin Account' : 'Create Account'}
                            </>
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Already have an account? 
                        <button 
                            className="link-button"
                            onClick={() => navigate('/login')}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegForm;
