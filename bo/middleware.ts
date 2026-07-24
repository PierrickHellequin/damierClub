import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/authCookies';

const PUBLIC_PATHS = ['/login', '/register'];

/**
 * Protection des routes côté serveur : sans cookie de session,
 * toute page de l'admin redirige vers /login avant même de rendre.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE));
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!hasToken && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Tout sauf les assets Next et les fichiers statiques
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'],
};
