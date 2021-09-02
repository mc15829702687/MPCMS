import {controller, get} from '../lib/decorator';

import {getSiteStatistics} from '../service/statistics';

@controller('/api/v0/siteStatistics')
class StatisticsController {

  /**
   * 获取所有统计信息
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/all')
  async getSiteStatistics(ctx, next) {
    const res = await getSiteStatistics();
    if(res && !Array.isArray(res)) {
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
}

export default StatisticsController;