import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export const authenticateKey = (req: Request, res: Response, next: NextFunction): void => {
  console.log('\n--- Auth Middleware ---');
  console.log('Headers:', JSON.stringify(req.headers));

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token provided in request');
    res.status(401).json({ message: 'No token provided. Unauthorized access.' });
    return;
  }

  try {
    console.log('Token received:', token);

    const decoded: any = jwt.decode(token);
    console.log('Token decoded (without verification):', decoded);

    const verified = jwt.verify(token, SECRET_KEY);
    console.log('Token verified:', verified);

    if (!(verified as any)._id) {
      console.log('ERROR: No id property in verified token!');
      console.log('Token contains:', Object.keys(verified as object).join(', '));
    }

    (req as any).user = verified;
    console.log('User object attached to request:', (req as any).user);
    console.log('--- End Auth Middleware ---\n');

    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(403).json({ message: 'Invalid token. Unauthorized access.' });
  }
};
