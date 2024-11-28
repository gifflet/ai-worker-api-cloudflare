import { Hono } from "hono";
import { sign } from "hono/jwt";
import { nanoid } from 'nanoid';
import { hash, compare } from '../utils/crypto';

type Bindings = {
    DB: D1Database
}

const users = new Hono<{ Bindings: Bindings }>();

users.post("/register", async (c) => {
    const { email, password } = await c.req.json();
    const api_key = nanoid(32);
    const hashedPassword = await hash(password, 10);
    
    try {
        await c.env.DB.prepare(
            "INSERT INTO users (id, email, password, api_key) VALUES (?, ?, ?, ?)"
        ).bind(nanoid(), email, hashedPassword, api_key).run();

        return c.json({ message: "User created", api_key });
    } catch (error) {
        return c.json({ error: "User creation failed" }, 400);
    }
});

users.post("/login", async (c) => {
    const { email, password } = await c.req.json();
    
    const user = await c.env.DB.prepare(
        "SELECT * FROM users WHERE email = ?"
    ).bind(email).first();
    
    if (!user || !(await compare(password, user.password))) {
        return c.json({ error: "Invalid credentials" }, 401);
    }
    
    return c.json({ api_key: user.api_key });
});

export default users; 