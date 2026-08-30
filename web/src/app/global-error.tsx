'use client';

// Replaces the root layout when a layout-level error is thrown, so it must
// render its own <html> / <body>.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          background: '#0d0f16',
          color: '#f1f5f9',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '28rem' }}>
          A critical error occurred while loading the app.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            border: 0,
            borderRadius: '0.5rem',
            background: '#ff6b57',
            color: '#1a1a1a',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.625rem 1rem',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
