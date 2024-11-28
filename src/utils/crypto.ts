async function hash(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function compare(password: string, hashedPassword: string): Promise<boolean> {
    const newHash = await hash(password);
    return newHash === hashedPassword;
}

export { hash, compare }; 