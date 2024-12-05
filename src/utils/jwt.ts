import { sign, verify } from "hono/jwt";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";

export async function generateToken(payload: any): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = parseDuration(JWT_EXPIRES_IN);

    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + expiresIn
    };

    return await sign(tokenPayload, JWT_SECRET);
}

function parseDuration(duration: string): number {
    const value = parseInt(duration);
    const unit = duration.slice(-1);
    
    switch (unit) {
        case 'h': return value * 60 * 60;
        case 'd': return value * 24 * 60 * 60;
        case 'm': return value * 60;
        case 's': return value;
        default: return 24 * 60 * 60; // default 24h
    }
}

export async function verifyToken(token: string): Promise<any> {
    try {
        return await verify(token, JWT_SECRET);
    } catch {
        return null;
    }
} 