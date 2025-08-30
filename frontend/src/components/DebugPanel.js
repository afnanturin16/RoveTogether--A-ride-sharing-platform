import { useState, useEffect } from 'react';

const DebugPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/users/debug/users');
      const data = await response.json();
      console.log('Debug users response:', data);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTestAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/users/debug/create-admin', {
        method: 'POST'
      });
      const data = await response.json();
      console.log('Test admin creation response:', data);
      if (response.ok) {
        alert('Test admin created successfully! Email: admin@test.com, Password: password123');
        checkUsers(); // Refresh the users list
      } else {
        setError(data.message || 'Failed to create test admin');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating test admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('LocalStorage Token:', token ? 'Present' : 'Missing');
    console.log('LocalStorage User:', user ? JSON.parse(user) : 'Missing');
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Debug Panel</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Local Storage Check</h2>
        <button onClick={checkLocalStorage}>Check LocalStorage</button>
        <p>Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
        <p>User: {localStorage.getItem('user') ? '✅ Present' : '❌ Missing'}</p>
        {localStorage.getItem('user') && (
          <pre>{JSON.stringify(JSON.parse(localStorage.getItem('user')), null, 2)}</pre>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Database Users Check</h2>
        <button onClick={checkUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Check Users'}
        </button>
        <button onClick={createTestAdmin} disabled={loading} style={{ marginLeft: '1rem' }}>
          {loading ? 'Creating...' : 'Create Test Admin'}
        </button>
        
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {users.length > 0 && (
          <div>
            <h3>Users in Database ({users.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                    <td>{user.email}</td>
                    <td>{user.fullname?.firstname} {user.fullname?.lastname}</td>
                    <td style={{ 
                      color: user.role === 'admin' ? 'red' : 'green',
                      fontWeight: 'bold'
                    }}>
                      {user.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2>Test Admin Registration</h2>
        <p>Try registering as an admin:</p>
        <ol>
          <li>Go to <code>/registration</code></li>
          <li>Toggle to "Admin Signup" mode</li>
          <li>Fill in your details</li>
          <li>Check the console for debug logs</li>
          <li>Check if you're redirected to <code>/admin</code></li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPanel;
