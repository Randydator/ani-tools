import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/api/*", cors());

/*
    Db is set up and binded.
    Hono idk if its properly connected to main.tsx and needs routes obviously

    I can call db for example with npx wrangler d1 execute aniDB --remote --command "SELECT name FROM sqlite_schema WHERE type = 'table'"

    Decided to not use this (maybe for now)

    I thought I needed some proper session management system for safe logins. 
    But having done literally 6h of research and talking with out devs: 
    If I properly protect my app from XSS by sanitzing every possible user input and output. 
    And if I use HttpOnly, Secure and SameSite cookies, then this is safe enough to hold some access token. 

    Funny that I abandoned this project idea a while ago bcs I thought cookies aren't safe enough. 
    But having react on cloudlfare pages is way nicer anywasy :3 

    If I ever need a database, I have this half finished thing for reference :)
    wrangler.toml not pushed to github bcs not sure if db_id is safe to leak. Chatgpt says no. 
    
*/