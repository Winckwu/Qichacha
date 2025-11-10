import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PatternDemoPage from './pages/PatternDemoPage';
import ConfidenceDemoPage from './pages/ConfidenceDemoPage';
import SkillMonitoringPage from './pages/SkillMonitoringPage';
import CalibrationPage from './pages/CalibrationPage';
import PrivacyDemoPage from './pages/PrivacyDemoPage';
import TestScenariosPage from './pages/TestScenariosPage';
import ChatDemoPage from './pages/ChatDemoPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatDemoPage />} />
        <Route path="/patterns" element={<PatternDemoPage />} />
        <Route path="/confidence" element={<ConfidenceDemoPage />} />
        <Route path="/skills" element={<SkillMonitoringPage />} />
        <Route path="/calibration" element={<CalibrationPage />} />
        <Route path="/privacy" element={<PrivacyDemoPage />} />
        <Route path="/scenarios" element={<TestScenariosPage />} />
      </Routes>
    </Layout>
  );
}
