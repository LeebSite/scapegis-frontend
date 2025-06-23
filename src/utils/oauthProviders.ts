import { OAuthProvider } from '../types';
import { GoogleIcon, GitHubIcon } from '../components/atoms/Icons';

export const oauthProviders: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: GoogleIcon,
    color: '#4285F4',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: GitHubIcon,
    color: '#333333',
  },
];
