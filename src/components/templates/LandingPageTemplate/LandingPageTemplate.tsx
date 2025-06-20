import React from 'react';
import { Header, Hero, FeaturesSection } from '../../organisms';
import { NavigationItem, FeatureCardProps } from '../../../types';

interface LandingPageTemplateProps {
  navigationItems: NavigationItem[];
  heroData: {
    title: string;
    subtitle: string;
    description: string;
    primaryAction?: {
      label: string;
      onClick: () => void;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
  };
  featuresData: {
    title: string;
    subtitle?: string;
    features: FeatureCardProps[];
  };
}

const LandingPageTemplate: React.FC<LandingPageTemplateProps> = ({
  navigationItems,
  heroData,
  featuresData,
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Header navigationItems={navigationItems} />
      <main>
        <Hero
          title={heroData.title}
          subtitle={heroData.subtitle}
          description={heroData.description}
          primaryAction={heroData.primaryAction}
          secondaryAction={heroData.secondaryAction}
        />
        <FeaturesSection
          title={featuresData.title}
          subtitle={featuresData.subtitle}
          features={featuresData.features}
        />
      </main>
    </div>
  );
};

export default LandingPageTemplate;
