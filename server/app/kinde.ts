import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from '@kinde-oss/kinde-typescript-sdk';
import { type Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { Hono } from 'hono';
import { createFactory, createMiddleware } from 'hono/factory';

type Env = {
  Variables: {
    user: UserType;
  };
};

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    return getCookie(c, key);
  },
  async setSessionItem(key: string, value: unknown): Promise<void> {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    } as const;

    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string): Promise<void> {
    deleteCookie(c, key);
  },
  async destroySession(): Promise<void> {
    ['id_token', 'access_token', 'refresh_token', 'user'].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

const getUserMiddleware = createMiddleware<Env>(async (c, next) => {
  try {
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(c),
    );

    if (!isAuthenticated) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await kindeClient.getUserProfile(sessionManager(c));
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

export { kindeClient, sessionManager, getUserMiddleware };
