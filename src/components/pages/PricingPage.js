import React from "react";
import PricingHero from "../sections/pricing/PricingHero";
import TabbedPricingSection from "../sections/pricing/TabbedPricingSection";
import ComparisonTable from "../sections/pricing/ComparisonTable";
import PricingCTA from "../sections/pricing/PricingCTA";
import FooterSection from "../sections/FooterSection";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      <PricingHero />
      <TabbedPricingSection />
      <ComparisonTable />
      <PricingCTA />
      <FooterSection />
    </div>
  );
};

export default PricingPage;
