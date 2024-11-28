import { Context, Next } from "hono";

export async function authMiddleware(c: Context, next: Next) {
    const apiKey = c.req.header("X-API-Key");
    
    if (!apiKey) {
        return c.json({ error: "API key required" }, 401);
    }

    const user = await c.env.DB.prepare(
        "SELECT * FROM users WHERE api_key = ?"
    ).bind(apiKey).first();

    if (!user) {
        return c.json({ error: "Invalid API key" }, 401);
    }

    await next();
} 