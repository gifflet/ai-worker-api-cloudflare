import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(c: Context, next: Next) {
    // Tenta autenticar com Bearer token
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token);
        
        if (payload) {
            c.set('user', { id: payload.userId });
            await next();
            return;
        }
    }

    // Se não tem Bearer token, tenta com API key
    const apiKey = c.req.header("X-API-Key");
    if (apiKey) {
        const key = await c.env.DB.prepare(
            "SELECT ak.*, u.id as user_id FROM api_keys ak JOIN users u ON ak.user_id = u.id WHERE ak.key = ? AND ak.active = true"
        ).bind(apiKey).first();

        if (key) {
            c.set('user', { id: key.user_id });
            await next();
            return;
        }
    }

    return c.json({ error: "Authentication required" }, 401);
} 