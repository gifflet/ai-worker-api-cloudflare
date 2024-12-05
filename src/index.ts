import { Hono } from "hono";
import { cors } from 'hono/cors'
import { authMiddleware } from "./middleware/auth";
import users from "./controllers/users";
import apiKeys from "./controllers/apiKeys";

type Bindings = {
    AI: AI,
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-API-Key'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: false,
}));

// Rotas públicas
app.route("/users", users);

// Rotas que precisam de autenticação
app.use("/api-keys/*", authMiddleware);
app.route("/api-keys", apiKeys);

app.use("/chat/*", authMiddleware);
app.post("/chat/completions", async (c) => {
    try {
        const body = await c.req.json();
        
        if (!body.messages || !Array.isArray(body.messages)) {
            return c.json({ error: "Invalid request format. Messages array is required." }, 400);
        }

        const chat = {
            messages: body.messages
        };

        const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
        
        return c.text(response.response);
    } catch (error) {
        return c.json({ error: "Internal server error", details: error.message }, 500);
    }
});

export default app