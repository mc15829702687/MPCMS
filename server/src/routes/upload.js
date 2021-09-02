import { sep } from 'path';
import {
  controller,
  post,
  get
} from '../lib/decorator';
import { staticPath } from '../config/index';

import { uploadImg, getGallery } from '../service/upload';

@controller('/api/v0/files')
class UploadFile {
  /**
   * 上传单个文件
   * @param {*} ctx 
   * @param {*} next 
   */
  @post('/uploadSingle')
  async uploadLogo(ctx, next) {
    let { filename, path, size } = ctx.file;
    let { source } = ctx.request.body || 'unknow';

    let url = `${staticPath}/upload/${filename}`;
    // 同步到图片数据库
    let res = await uploadImg({ source, url });
    if (res) {
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: `上传成功~`,
        filename,
        path,
        size
      }
    } else {
      ctx.status = 500;
      ctx.body = {
        state: 500,
        data: `服务器错误~`
      }
    }
  }

  /**
   * 获取所有图片数据
   * @param {*} ctx 
   * @param {*} next 
   */
  @get('/gallery')
  async getGallery(ctx, next) {
    const res = await getGallery();
    if(res && Array.isArray(res)) {
      res.forEach((item, i) => {
        res[i] = JSON.parse(item);
      })
      ctx.status = 200;
      ctx.body = {
        state: 200,
        data: res
      }
    }else {
      ctx.status = 403;
      ctx.body = {
        state: 403,
        data: `数据库错误~`
      }
    }
  }
}

export default UploadFile;