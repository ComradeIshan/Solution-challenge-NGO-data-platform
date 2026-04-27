import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import MainLayout      from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout      from "./layouts/AuthLayout";

// Pages — ALL UNCHANGED
import Landing            from "./pages/Landing";
import Auth               from "./pages/Auth";
import Analytics          from "./pages/Analytics";
import Dashboard          from "./pages/dashboard_files/Dashboard";
import AIInsights         from "./pages/AIInsights/AIInsightsSection";
import Leaderboard        from "./pages/Leaderboard_volunteer/Leaderboard";
import VolunteerProfile   from "./pages/VolunteerProfileSection/VolunteerProfileSection";
import NGOProfile         from "./pages/NGOProfile";
import Matching           from "./pages/MatchingSection";
import AICommandCenter    from "./pages/AICommandCenter";
import ImpactIntelligence from "./pages/ImpactIntelligence";
import Reports            from "./pages/Reports";

export default function App() {
  const { currentUser, userProfile } = useAuth();

  // ── Where to send after login based on role ──────────────────────────────
  const dashboardPath = userProfile?.role === "ngo"
    ? "/ngo-profile"        // NGO lands on NGO profile
    : "/volunteer-profile"; // Volunteer lands on volunteer profile

  return (
    <Routes>
      {/* 🌐 PUBLIC */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* 🔐 AUTH — if already logged in, redirect to their dashboard */}
      <Route element={<AuthLayout />}>
        <Route
          path="/auth"
          element={
            currentUser
              ? <Navigate to={dashboardPath} replace />
              : <Auth />
          }
        />
      </Route>

      {/* 📊 PROTECTED DASHBOARD — if not logged in, redirect to auth */}
      <Route
        element={
          currentUser
            ? <DashboardLayout />
            : <Navigate to="/auth" replace />
        }
      >
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/analytics"           element={<Analytics />} />
        <Route path="/ai-insights"         element={<AIInsights />} />
        <Route path="/leaderboard"         element={<Leaderboard />} />
        <Route path="/volunteer-profile"   element={<VolunteerProfile />} />
        <Route path="/ngo-profile"         element={<NGOProfile />} />
        <Route path="/matching"            element={<Matching />} />
        <Route path="/ai-command-center"   element={<AICommandCenter />} />
        <Route path="/impact-intelligence" element={<ImpactIntelligence />} />
        <Route path="/reports"             element={<Reports />} />
      </Route>

      {/* ❌ FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}