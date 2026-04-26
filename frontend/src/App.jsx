import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/dashboard_files/Dashboard";
import AIInsights from "./pages/AIInsights/AIInsightsSection";
import Leaderboard from "./pages/Leaderboard_volunteer/Leaderboard";
import VolunteerProfile from "./pages/VolunteerProfileSection/VolunteerProfileSection";
import NGOProfile from "./pages/NGOProfile";
import Matching from "./pages/MatchingSection";
import AICommandCenter from "./pages/AICommandCenter";
import ImpactIntelligence from "./pages/ImpactIntelligence";
import Reports from "./pages/Reports";

export default function App() {
  const isLoggedIn = localStorage.getItem("user");

  return (
    <Routes>
      {/* 🌐 PUBLIC */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* 🔐 AUTH */}
      <Route element={<AuthLayout />}>
        <Route
          path="/auth"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Auth />
          }
        />
      </Route>

      {/* 📊 PROTECTED DASHBOARD */}
      <Route
        element={
          isLoggedIn ? <DashboardLayout /> : <Navigate to="/auth" />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/volunteer-profile" element={<VolunteerProfile />} />
        <Route path="/ngo-profile" element={<NGOProfile />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/ai-command-center" element={<AICommandCenter />} />
        <Route path="/impact-intelligence" element={<ImpactIntelligence />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* ❌ FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}