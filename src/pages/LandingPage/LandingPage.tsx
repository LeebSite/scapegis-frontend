import React from 'react';
import { LandingPageTemplate } from '../../components/templates';
import { NavigationItem, FeatureCardProps } from '../../types';

const LandingPage: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const heroData = {
    title: 'All-in-1 GIS platform',
    subtitle: 'AI-powered geo analytics platform',
    description: 'AI-powered geo analytics platform for software developer, logistic services, consultant, investor, and government',
    primaryAction: {
      label: 'Get Started Free',
      onClick: () => console.log('Get Started clicked'),
    },
    secondaryAction: {
      label: 'Watch Demo',
      onClick: () => console.log('Watch Demo clicked'),
    },
  };

  const featuresData = {
    title: 'Collaborative GIS platform',
    subtitle: 'Bring your team together no matter where they are',
    features: [
      {
        icon: (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: 'Bring location to life with every maps',
        description: 'Scapegis is how teams make maps and perform geospatial analysis together. Create, collaborate, share — all under one roof.',
      },
      {
        icon: (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        title: 'Real-time Collaboration',
        description: 'Collaborate on editing in real time. It\'s easy to upload data, use comments and annotations to keep the process moving.',
      },
      {
        icon: (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        title: 'AI-powered spatial insights',
        description: 'Enable your users to be more productive with built-in AI capabilities to talk with the data in your maps and help you design analysis workflows just from a prompt.',
      },
    ] as FeatureCardProps[],
  };

  return (
    <LandingPageTemplate
      navigationItems={navigationItems}
      heroData={heroData}
      featuresData={featuresData}
    />
  );
};

export default LandingPage;
