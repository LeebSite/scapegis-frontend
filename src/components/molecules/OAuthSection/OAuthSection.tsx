import React from 'react';
import { OAuthButton, Divider } from '../../atoms';
import { oauthProviders } from '../../../utils/oauthProviders';
import { cn } from '../../../utils/cn';

interface OAuthSectionProps {
  onOAuthLogin: (providerId: string) => void;
  loading?: boolean;
  loadingProvider?: string;
  className?: string;
}

const OAuthSection: React.FC<OAuthSectionProps> = ({
  onOAuthLogin,
  loading = false,
  loadingProvider,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <Divider text="Or continue with" className="mb-6" />
      
      <div className="space-y-3">
        {oauthProviders.map((provider) => (
          <OAuthButton
            key={provider.id}
            provider={provider}
            onClick={() => onOAuthLogin(provider.id)}
            disabled={loading}
            loading={loadingProvider === provider.id}
          />
        ))}
      </div>
    </div>
  );
};

export default OAuthSection;
