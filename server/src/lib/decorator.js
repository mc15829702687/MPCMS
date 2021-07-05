import { resolve } from 'path';

import glob from 'glob';
import Router from 'koa-router';

const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

// 映射前缀路由
export const controller = path => (target, key, descriptor) => target.prototype[symbolPrefix] = path;

const isArray = arr => Array.isArray(arr) ? arr : [arr];

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }

  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require);
    for (let [conf, controller] of routerMap) {
      let controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) normalizePath(prefixPath);
      let routerPath = prefixPath + conf.path;
      this.router[conf.method](routerPath, ...controllers);
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
  R.compose(
    R.concat(target[key]),
    isArray
  )(middleware)
}

// 用户登录校验
export const authAdmin = convert(async (ctx, next) => {
  await next();
})