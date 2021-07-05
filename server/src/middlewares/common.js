import koaBody from 'koa-body';

// 处理请求体
export const KoaBody = app => app.use(koaBody()); 