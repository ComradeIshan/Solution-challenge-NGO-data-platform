import React from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero/Hero";
import WhyDigitalSevaks from "../components/WhyDigitalSevaks";
import Roles from "../components/Roles";
import Features from "../components/sections/Features";
import AISection from "../components/sections/AISection";
import LiveImpactDashboard from "../components/LiveImpactDashboard";
import ForYou from "../components/ForYou";
import VoicesOfImpact from "../components/VoicesOfImpact";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

import "../styles/landing.css";
import HowItWorks from "../components/sections/HowItWorks";

/* ─── ANIMATION ───────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── SECTION WRAPPER (FIXED) ─────────────────── */
const Section = ({ children }) => (
  <motion.section
    className="section-wrapper"
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-100px" }}
  >
    <div className="container">
      {children}
    </div>
  </motion.section>
);

/* ─── MAIN PAGE ───────────────────────── */
export default function Landing() {
  return (
    <div className="page-bg">
      
      {/* <Navbar /> */}

      <Hero /> {/* FULL WIDTH (no wrapper) */}

      <Section>
        <WhyDigitalSevaks />
      </Section>

      <Section>
        <Roles />
      </Section>

      <Section>
        <HowItWorks />
      </Section>

      <Section>
        <Features />
      </Section>

      <Section>
        <AISection />
      </Section>

      <Section>
        <LiveImpactDashboard />
      </Section>

      <Section>
        <ForYou />
      </Section>

      <Section>
        <VoicesOfImpact />
      </Section>

      <Section>
        {/* <CTA /> */}
      </Section>

      <Footer />

    </div>
  );
}