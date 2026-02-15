import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days






export const signToken = (payload : object) => jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

export const signRefreshToken = (payload : object) => jwt.sign(payload, JWT_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN});


export const verifyToken = (token : string) => jwt.verify(token, JWT_SECRET);
