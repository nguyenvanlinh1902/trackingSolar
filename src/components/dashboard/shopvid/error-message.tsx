'use client';

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message = 'Failed to load analytics data' }: ErrorMessageProps) {
  return (
    <div style={{ textAlign: 'center', padding: '48px' }}>
      <p style={{ color: '#6b7280' }}>{message}</p>
    </div>
  );
}

