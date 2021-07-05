import { controller, get, post } from '../lib/decorator';

import {loginAdmin} from '../service/admin';

@controller('/api/v0/admin')
class AdminController {

  /**
   * 获取所有管理员数据
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/all')
  getAdmins(ctx, next) {
    ctx.body = `所有管理员数据~`;
  }

  /**
   * 管理员登录
   * @param {*} ctx 
   * @param {*} next 
   */
  @post('/loginAdmin')
  async loginAdmin(ctx, next) {
    const data = ctx.request.body;
    let res = await loginAdmin(data);
    ctx.body = `登录成功~`;
  }
}

export default AdminController;