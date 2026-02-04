import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = getToken(request);
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicRoute = ['/'].includes(request.nextUrl.pathname) || 
                       request.nextUrl.pathname.startsWith('/_next') ||
                       request.nextUrl.pathname.startsWith('/favicon');

  // Allow access to public routes
  if (isPublicRoute || isAuthPage) {
    return NextResponse.next();
  }

  // Protect API routes and dashboard
  if ((isApiRoute && !request.nextUrl.pathname.startsWith('/api/auth')) || 
      request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon|public).*)',
  ],
};