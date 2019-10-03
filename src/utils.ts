import jwt from 'jsonwebtoken';

export function verifyToken(authorization: string): boolean {
  try {
    const token = authorization.slice(authorization.indexOf(' ') + 1);
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

export const badRequest = () => ({
  statusCode: 400,
  body: `Invalid request`,
});

export const unAuthorized = () => ({
  statusCode: 401,
  body: `Unauthorized`,
});
