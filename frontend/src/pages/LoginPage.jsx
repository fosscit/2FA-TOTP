import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import { useSession } from '../session/SessionContext.jsx';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    try {
      setLoading(true);
      const { data } = await client.post('/auth/login', {
        username,
        password
      });
      saveToken(data.sessionToken);
      navigate('/totp');
    } catch (err) {
      setError(
        err.response?.data?.message ??
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Cyber Security Portal"
      subtitle="Authenticate with your operator credentials"
    >
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating…' : 'Login'}
        </button>
      </form>
    </PageShell>
  );
};

export default LoginPage;

