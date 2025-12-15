'use client';

import { flexCenter, spinnerStyle, SPINNER_KEYFRAMES } from '@/lib/styles';

interface LoadingSpinnerProps {
  minHeight?: string;
}

export function LoadingSpinner({ minHeight = '400px' }: LoadingSpinnerProps) {
  return (
    <div style={{ ...flexCenter, minHeight }}>
      <div style={spinnerStyle} />
      <style>{SPINNER_KEYFRAMES}</style>
    </div>
  );
}
