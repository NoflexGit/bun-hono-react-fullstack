import { Hono } from 'hono';
import { kindeClient, sessionManager } from '../kinde.ts';
import { getUserMiddleware } from '../kinde.ts';

const authRoutes = new Hono()
  .get('/login', async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get('/register', async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get('/logout', async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get('/callback', async (c) => {
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), <URL>url);
    return c.redirect('/');
  })
  .get('/me', getUserMiddleware, async (c) => {
    const user = c.var.user;
    return c.json({ user });
  });

export default authRoutes;
