'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
