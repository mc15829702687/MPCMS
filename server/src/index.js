import {resolve} from 'path';

import Koa from 'koa';
import * as R from 'ramda';

import {initAdmin} from './service/admin';

const MIDDLEWARES = ['common', 'router'];

import koaBody from 'koa-body';

// 处理请求体
export const KoaBody = app => app.use(koaBody());

// R.compose()方法从右到左执行传入的函数，上一次返回的值将作为前一个函数的参数
// R.foreachObjIndexed()方法传入的参数是 value, key, obj
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

// 启动逻辑代码
async function start() {
  const app = new Koa();
  await useMiddlewares(app);

  initAdmin({
    username: 'mc',
    pwd: '123',
    role: 0
  });
  
  app.listen(3000);
}

start();