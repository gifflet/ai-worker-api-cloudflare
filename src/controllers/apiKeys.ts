import { Hono } from "hono";
import { nanoid } from 'nanoid';

type Bindings = {
    DB: D1Database
}

const apiKeys = new Hono<{ Bindings: Bindings }>();

// Criar nova API Key
apiKeys.post("/create", async (c) => {
    try {
        const userId = c.get('user').id;
        const { name } = await c.req.json();
        const key = `sk-${nanoid(32)}`;
        
        await c.env.DB.prepare(
            "INSERT INTO api_keys (id, user_id, key, name) VALUES (?, ?, ?, ?)"
        ).bind(nanoid(), userId, key, name).run();

        return c.json({ key, message: "API key created successfully. Save this key as it won't be shown again." });
    } catch (error) {
        return c.json({ error: "Failed to create API key" }, 400);
    }
});

// Listar API Keys (sem mostrar as chaves)
apiKeys.get("/list", async (c) => {
    try {
        const userId = c.get('user').id;
        const keys = await c.env.DB.prepare(
            "SELECT id, name, active, created_at FROM api_keys WHERE user_id = ?"
        ).bind(userId).all();
        
        return c.json(keys.results);
    } catch (error) {
        return c.json({ error: "Failed to list API keys" }, 400);
    }
});

// Revogar API Key
apiKeys.post("/revoke/:keyId", async (c) => {
    try {
        const userId = c.get('user').id;
        const keyId = c.req.param('keyId');
        await c.env.DB.prepare(
            "UPDATE api_keys SET active = false WHERE id = ? AND user_id = ?"
        ).bind(keyId, userId).run();
        
        return c.json({ message: "API key revoked successfully" });
    } catch (error) {
        return c.json({ error: "Failed to revoke API key" }, 400);
    }
});

export default apiKeys; 