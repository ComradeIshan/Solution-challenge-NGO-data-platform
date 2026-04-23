import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Roles from "../components/Roles";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import AISection from "../components/AISection";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

import "../styles/landing.css";
import LiveImpactDashboard from "../components/LiveImpactDashboard";
import ForYou from "../components/ForYou";
import Testimonials from "../components/landing/Testimonials";
import WhyDigitalSevaks from "../components/WhyDigitalSevaks";
import VoicesOfImpact from "../components/VoicesOfImpact";
import HeroSection from "../components/Hero/HeroSection";



export default function Landing() {
  return (
    <div className="page-bg">
      
  <Navbar />
  <HeroSection/>
  <Navbar />
  <Hero />
  <Stats />
  <WhyDigitalSevaks />
  <Roles />
  <HowItWorks />
  <ForYou />
  <LiveImpactDashboard />
  <Features />
  <AISection />
  {/* <Testimonials /> */}
  <VoicesOfImpact />
  <CTA />
  <Footer />
</div>
  );
}