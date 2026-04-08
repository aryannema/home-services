import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import ProviderPage from './pages/ProviderPage';
import { ensureDefaults } from './utils/storage';

ensureDefaults();

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/provider" element={<ProviderPage />} />
        </Routes>
        <footer className="footer container">
          Built for a Web Programming class demo &bull; Uses localStorage (no backend)
        </footer>
      </BrowserRouter>
    </ThemeProvider>
  );
}
