'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthContextProps {
  children: ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider basePath="/api/v1/auth">
      {children}
    </SessionProvider>
  );
}
