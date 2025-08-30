import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MessageSystem from './components/MessageSystem';

// Pages & Components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import RideForm from './components/RideForm';
import MyRides from './pages/MyRides';
import LoginForm from './components/LoginForm';
import RegForm from './components/RegForm';
import LandingPage from './pages/LandingPage';
import MyProfile from './pages/MyProfile';
import UserProfile from './pages/UserProfile';
import UserSearch from './components/UserSearch';
import AdminDashboard from './pages/AdminDashboard';
import Logout from './components/Logout';
import RideConfirmation from './pages/RideConfirmation';
import DebugPanel from './components/DebugPanel';
import './index.css';
import './components/AestheticEnhancements.css';

function AppLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/welcome", "/login", "/registration"];
  
  // Check if current user is admin
  const userStr = localStorage.getItem('user');
  const isAdmin = userStr ? JSON.parse(userStr).role === 'admin' : false;
  
  // Hide sidebar for admin users or for specific routes
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname) || isAdmin;

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="main-container">
      {!shouldHideSidebar && <Sidebar />}
      <div className={`content-area ${!shouldHideSidebar ? 'with-sidebar' : ''}`}>
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn 
                  ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
                  : <Navigate to="/welcome" />
              } 
            />
            <Route path="/welcome" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                isLoggedIn 
                  ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
                  : <LoginForm />
              }
            />
            <Route
              path="/registration"
              element={
                isLoggedIn 
                  ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
                  : <RegForm />
              }
            />
            <Route 
              path="/home" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <Home />
              } 
            />
            <Route 
              path="/create" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <RideForm />
              } 
            />
            <Route 
              path="/myrides" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <MyRides />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <MyProfile />
              } 
            />
            <Route 
              path="/search-users" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <UserSearch />
              } 
            />
            <Route 
              path="/user/:userId" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <UserProfile />
              } 
            />
            <Route 
              path="/admin" 
              element={
                (() => {
                  const userStr = localStorage.getItem('user');
                  if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.role === 'admin') {
                      return <AdminDashboard />;
                    }
                  }
                  return <Navigate to="/home" />;
                })()
              } 
            />
            <Route 
              path="/logout" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <Logout />
              } 
            />
            <Route 
              path="/ride-confirmation" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <RideConfirmation />
              } 
            />
            <Route 
              path="/messages" 
              element={
                isAdmin ? <Navigate to="/admin" /> : <MessageSystem />
              } 
            />
            <Route path="/debug" element={<DebugPanel />} />
            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
