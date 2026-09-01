import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SheraTutor — HSC & SSC AI Learning Workspace',
    short_name: 'SheraTutor',
    description: 'Authentic NCTB Board-aligned diagnostic grading and tutoring for Bangladeshi students.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
