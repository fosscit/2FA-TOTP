import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import { useSession } from '../session/SessionContext.jsx';

const TotpVerifyPage = () => {
  const { sessionToken } = useSession();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!sessionToken) {
    navigate('/login');
  }

  const handleVerify = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    try {
      setLoading(true);
      const { data } = await client.post('/totp/verify', { code });
      setStatus(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Verification failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Verify TOTP"
      subtitle="Confirm the shared code to complete the handshake."
      footer={
        <button onClick={() => navigate('/login')}>
          Back to login
        </button>
      }
    >
      <form onSubmit={handleVerify} className="form">
        <label>
          Enter TOTP
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
        </label>
        {status ? <p className="success">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Verify code'}
        </button>
      </form>
    </PageShell>
  );
};

export default TotpVerifyPage;

