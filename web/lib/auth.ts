import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
}

export function getToken(request: NextRequest): DecodedToken | null {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function createToken(payload: Omit<DecodedToken, 'userId'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}