import React from "react";
import AboutHero from "../sections/about/AboutHero";
import TeamSpotlight from "../sections/about/TeamSpotlight";
import ImpactMetrics from "../sections/about/ImpactMetrics";
import BuiltForBharat from "../sections/about/BuiltForBharat";
import FooterSection from "../sections/FooterSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      <AboutHero />
      <TeamSpotlight />
      <ImpactMetrics />
      <BuiltForBharat />
      <FooterSection />
    </div>
  );
};

export default AboutPage;
