import { resolve } from 'path';

import glob from 'glob';
import Router from 'koa-router';
import * as R from 'ramda';

import { upload } from './upload';

const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

// 映射前缀路由
export const controller = path => (target, key, descriptor) => target.prototype[symbolPrefix] = path;

const isArray = arr => Array.isArray(arr) ? arr : [arr];

// 捕获文件上传异常
const uploadSingleCatchError = async (ctx, next) => {
  let err = await upload.single('file')(ctx, next).then(res => res).catch(err => err);
  if (err) {
    ctx.status = 500;
    ctx.body = {
      state: 500,
      data: err.message
    }
  }
}

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }

  init() {
    // 加载routes底下所有js文件
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require);
    for (let [conf, controller] of routerMap) {
      let controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) normalizePath(prefixPath);
      let routerPath = prefixPath + conf.path;
      if (conf.path.indexOf('/upload') > -1) {
        this.router[conf.method](routerPath, uploadSingleCatchError, ...controllers);
      } else {
        this.router[conf.method](routerPath, ...controllers);
      }
    }

    this.app.use(this.router.routes()).use(this.router.allowedMethods());
  }
}

// 格式化路径
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

// 路由映射
const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path);
  // 为了用到target[symbolPrefix]值，将target作为键的属性
  routerMap.set(
    {
      ...conf,
      target
    },
    target[key]
  );
}

export const get = path => router(
  {
    method: 'get',
    path
  }
)

export const post = path => router(
  {
    method: 'post',
    path
  }
)

export const put = path => router(
  {
    method: 'put',
    path
  }
)

export const del = path => router(
  {
    method: 'delete',
    path
  }
)

// 合并中间件
const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      isArray(middleware)
    ),
    isArray
  )(target[key])
  return descriptor;
}

// 用户登录校验
export const authAdmin = convert(async (ctx, next) => {
  if (!ctx.session.admin) {
    ctx.status = 401;     // unauthorized
    ctx.body = {
      success: false,
      state: 401,
      err: '登录信息失效，重新登录~'
    }
    return;
  }
  await next();
})

// 权限校验
export const adminRole = roleExp => convert(async (ctx, next) => {
  const { role } = ctx.session.admin;
  if(+role !== roleExp) {
    ctx.status = 401;
    ctx.body = {
      state: 401,
      success: false,
      data: `你没有操作权限~`
    }
    return;
  }
  await next();
})

// 参数合法性校验
export const required = rules => convert(async (ctx, next) => {
  let errors = [];

  const checkRules = R.forEachObjIndexed((value, key) => {
    errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
  });
  checkRules(rules);

  if(errors.length > 0) {
    return ctx.throw(412, `${errors.join(',')} is Required`);
  }
  await next();
})

