import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import TrackingPage from "@/react-app/pages/Tracking";
import AnalyticsPage from "@/react-app/pages/Analytics";
import EmotionAnalyticsPage from "@/react-app/pages/EmotionAnalytics";
import MedicationsPage from "@/react-app/pages/Medications";
import DataManagementPage from "@/react-app/pages/DataManagement";
import Navbar from "@/react-app/components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/emotions" element={<EmotionAnalyticsPage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/data" element={<DataManagementPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
