'use client';

import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <FirebaseAuthProvider>
      {children}
    </FirebaseAuthProvider>
  );
}
