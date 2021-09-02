import { controller, get, post, authAdmin, del } from '../lib/decorator';

import { loginAdmin, getAdmins, findAdmin, addAdmin, editAdmin, delAdmin } from '../service/admin';

@controller('/api/v0/admin')
class AdminController {

  /**
   * 获取所有管理员数据
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/all')
  @authAdmin
  async getAdmins(ctx, next) {
    let res = await getAdmins();
    if (res) {
      ctx.status = 200;
      ctx.body = {
        data: res,
        state: 200
      }
    }
  }

  /**
   * 查询某个用户
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/findOne')
  @authAdmin
  async findOne(ctx, next) {
    let { username } = ctx.query;
    let res = await findAdmin(username);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: res
      }
    }
  }

  /**
   * 添加管理员
   * @param {*} ctx 
   * @param {*} next 
   */
  @post('/addAdmin')
  async addAdmin(ctx, next) {
    let data = ctx.request.body;
    let res = await addAdmin(data);
    if(res && !Array.isArray(res)) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: '添加成功~'
      }
    }else {
      ctx.status = 403;     // forbidden
      ctx.body = {
        state: 403,
        data: res ? res.join(',') : '用户名已存在~'
      }
    }
  }

  /**
   * 修改管理员信息
   * @param {*} ctx 
   * @param {*} next 
   */
  @post('/editAdmin')
  @authAdmin
  async editAdmin(ctx, next) {
    const data = ctx.request.body;
    let res = await editAdmin(data);
    if(res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `修改成功~`
      }
    }else {
      ctx.status = 500;
      ctx.body = {
        state: 500,
        data: `服务器错误~`
      }
    }
  }

  /**
   * 获取当前登录管理员信息
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/getCurAdminInfo')
  getCurAdminInfo(ctx, next) {
    let admin = ctx.session.admin;
    if(admin) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        ...admin
      }
    }else {
      ctx.status = 401;   // unauthorized
      ctx.body = {
        state: 401,
        data: `登录信息已失效，请重新登录~`
      }
    }
  }

  /**
   * 删除用户
   * @param {*} ctx 
   * @param {*} next 
   */
  @del('/delAdmin')
  @authAdmin
  async delAdmin(ctx, next) {
    let {username} = ctx.query;
    let res = await delAdmin(username);
    if(res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `删除成功~`
      }
    }else {
      ctx.status = 403;   // forbidden
      ctx.body = {
        state: 403,
        data: `删除失败~`
      }
    }
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
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: '登录成功~'
      }
      ctx.session.admin = res;
    } else {
      ctx.status = 403;
      ctx.body = {
        state: 403,
        data: '密码错误或用户名不存在~'
      }
    }
  }

  /**
   * 退出登录
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/logout')
  logoOut(ctx, next) {
    ctx.session = null;
    ctx.body = {
      state: 200,
      data: `退出登录成功~`
    }
  }
}

export default AdminController;