import koaBody from 'koa-body';
import session from 'koa-session';
import logger from 'koa-logger';
import cors from 'koa2-cors';

import redis from '../db/redis';
import sessionStore from "../lib/sessionStore";

// 处理请求体
export const KoaBody = app => app.use(koaBody()); 

// 设置日志
export const Logger = app => app.use(logger());

// 设置跨域
export const Cors = app => app.use(cors({
  origin(ctx) {
    if(ctx.url.indexOf('/api') > -1) {
      return false;
    } 
    return '*';     // 接受任意源（协议，域名，端口）请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,        // 5s
  credentials: true,      // 允许携带cookie
  allowMethods: ['GET', 'POST', 'DELETE'],      
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],      // 允许自定义头部信息
}))

// 设置session
export const Session = app => {
  app.keys = ['mc'];
  const SESSION_CONFIG = {
    key: 'mc123',
    maxAge: 12 * 60 * 60 * 1000,
    signed: true,
    store: new sessionStore(redis)
  }

  app.use(session(SESSION_CONFIG, app));
}