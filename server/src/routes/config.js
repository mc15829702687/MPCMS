import { controller, post, get } from '../lib/decorator';

import {
  setHeader,
  setBanner,
  setBannerSide,
  setSupportPay,
  getConfig
} from '../service/config';

require('../service/config');

@controller('/api/v0/config')
class ConfigController {

  /**
   * 获取所有配置
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/all')
  async getConfig(ctx, next) {
    const res = await getConfig();
    if(res && !Array.isArray(res)) {
      // 将数据转换为json数据
      for(let key in res) {
        res[key] = JSON.parse(res[key]);
      }
      
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: res
      }
    }else {
      ctx.status = 403;
      ctx.body = {
        state: 403,
        data: res ? res.join(',') : `服务器错误~`
      }
    }
  }

  /**
   * 设置header
   * @param {*} ctx 
   * @param {*} next 
   */
  @post('/setHeader')
  async setHeader(ctx, next) {
    const data = ctx.request.body;
    const res = await setHeader(data);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `header设置成功~`
      }
    } else {
      ctx.status = 403;
      ctx.body = {
        state: 200,
        data: res ? res.join(',') : `服务器错误~`
      }
    }
  }

  /**
  * 设置banner
  * @param {*} ctx 
  * @param {*} next 
  */
  @post('/setBanner')
  async setBanner(ctx, next) {
    const data = ctx.request.body;
    const res = await setBanner(data);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `banner设置成功~`
      }
    } else {
      ctx.status = 403;
      ctx.body = {
        state: 200,
        data: res ? res.join(',') : `服务器错误~`
      }
    }
  }

  /**
    * 设置bannerSide
    * @param {*} ctx 
    * @param {*} next 
  */
  @post('/setBannerSide')
  async setBannerSide(ctx, next) {
    const data = ctx.request.body;
    const res = await setBannerSide(data);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `bannerSide设置成功~`
      }
    } else {
      ctx.status = 403;
      ctx.body = {
        state: 200,
        data: res ? res.join(',') : `服务器错误~`
      }
    }
  }

  /**
  * 设置bannerSide
  * @param {*} ctx 
  * @param {*} next 
*/
  @post('/setSupportPay')
  async setSupportPay(ctx, next) {
    const data = ctx.request.body;
    const res = await setSupportPay(data);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `SupportPay设置成功~`
      }
    } else {
      ctx.status = 403;
      ctx.body = {
        state: 200,
        data: res ? res.join(',') : `服务器错误~`
      }
    }
  }
}

export default ConfigController;