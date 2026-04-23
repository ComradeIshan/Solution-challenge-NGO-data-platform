import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/dashboard_files/Dashboard";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights/AIInsightsSection";
import Leaderboard from "./pages/Leaderboard_volunteer/Leaderboard";
import VolunteerProfileSection from "./pages/VolunteerProfileSection/VolunteerProfileSection";
import NGOProfileSection from "./pages/NGOProfile";
import MatchingSection from "./pages/MatchingSection";
import AICommandCenter from "./pages/AICommandCenter";
import ImpactIntelligence from "./pages/ImpactIntelligence";
import Reports from "./pages/Reports";
import "./styles/theme.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-insights" element={<AIInsights />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/volunteer-profile" element={<VolunteerProfileSection />} />
      <Route path="/ngo-profile" element={<NGOProfileSection />} />
      <Route path="/matching" element={<MatchingSection />} />
      <Route path="/ai-command-center" element={<AICommandCenter />} />
      <Route path="/impact-intelligence" element={<ImpactIntelligence />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

