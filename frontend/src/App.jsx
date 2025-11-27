import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import TotpDisplayPage from './pages/TotpDisplayPage.jsx';
import TotpVerifyPage from './pages/TotpVerifyPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/totp" element={<TotpDisplayPage />} />
      <Route path="/verify" element={<TotpVerifyPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

