import { Hono } from "hono";
import { nanoid } from 'nanoid';
import { hash, compare } from '../utils/crypto';
import { generateToken } from '../utils/jwt';

type Bindings = {
    DB: D1Database
}

const users = new Hono<{ Bindings: Bindings }>();

users.post("/register", async (c) => {
    const { email, password } = await c.req.json();
    const hashedPassword = await hash(password);
    const id = nanoid();
    
    try {
        await c.env.DB.prepare(
            "INSERT INTO users (id, email, password) VALUES (?, ?, ?)"
        ).bind(id, email, hashedPassword).run();

        const token = await generateToken({ userId: id });
        return c.json({ message: "User created", token });
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
    
    const token = await generateToken({ userId: user.id });
    return c.json({ token });
});

export default users; 