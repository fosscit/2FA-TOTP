import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import { useSession } from '../session/SessionContext.jsx';

const TotpDisplayPage = () => {
  const { sessionToken } = useSession();
  const [code, setCode] = useState('');
  const [expiresInMs, setExpiresInMs] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) {
      navigate('/login');
      return;
    }
    const fetchCode = async () => {
      try {
        const { data } = await client.get('/totp/generate');
        setCode(data.code);
        setExpiresInMs(data.expiresInMs);
      } catch (err) {
        setError(
          err.response?.data?.message ??
            'Unable to generate TOTP for this session.'
        );
      }
    };
    fetchCode();
  }, [sessionToken, navigate]);

  const expiresInSeconds = Math.round(expiresInMs / 1000);

  return (
    <PageShell
      title="One-Time TOTP"
      subtitle="Share this code out-of-band. It is generated only once per session."
      footer={
        <button onClick={() => navigate('/verify')}>
          Go to verification
        </button>
      }
    >
      <div className="totp-display">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <p className="totp-code">{code || '------'}</p>
            {expiresInMs ? (
              <p className="helper">
                Expires in ~{expiresInSeconds} seconds
              </p>
            ) : null}
          </>
        )}
      </div>
    </PageShell>
  );
};

export default TotpDisplayPage;

