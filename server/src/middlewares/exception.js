import { HttpException } from '../lib/httpException';
import { isDev } from '../config/index';

/**
 * 创建捕获异常中间件
 * @param {*} app 
 */
export const catchError = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const isHttpException = error instanceof HttpException;

    // 开发环境抛出异常
    if (isDev && !isHttpException) { 
      throw error;
    }

    if(isHttpException) {
      ctx.status = error.code;
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method}-${ctx.path}`
      }
    }else {
      ctx.status = 500;
      ctx.body = {
        msg: 'We made a mistake~',
        error_code: 999,
        request: `${ctx.method}-${ctx.path}`
      }
    }
  }
})