import fs from 'fs';
import { resolve } from 'path';

import { writeFile, delFile } from '../lib/upload';
import { staticPath } from '../config/index';
import articleSchema from '../db/schema/article';

const articlePath = resolve(__dirname, '../../public/blog');

/**
 * 保存文章
 * @param {*} data 
 */
export const saveArticle = async (data) => {
  let {
    id,
    tit,
    label,
    faceUrl,
    content,
    time,
    views,
    flover
  } = data;

  // 判断存放静态资源文章的文件夹是否存在
  if (fs.existsSync(articlePath)) {
    return handleService();
  } else {
    // 创建成功返回值是undefined
    if (!fs.mkdirSync(articlePath)) {
      return handleService();
    } else {
      return 500;
    }
  }

  async function handleService() {
    // ?: 前一个匹配出现零次或一次 .+?: 懒惰匹配
    // 若传入的是html标签字符串，会将标签字符串置为空
    let desc = content.slice(0, 60).replace(/<\/?.+?\/?>/g, '');

    // 将内容写入文件中
    let err = await writeFile(`${articlePath}/${id}.json`, JSON.stringify({ content }), 'utf8');

    if (!err) {
      // 本地静态资源路径
      let articleUrl = `${staticPath}/public/${id}.json`;
      // 将非内容文件数据缓存到redis中
      let res = await articleSchema.hmset(id, {
        id,
        tit,
        label,
        faceUrl,
        desc,
        time,
        views: +views,
        flover: +flover,
        articleUrl
      });
      if (res && !Array.isArray(res)) {
        return 200;
      } else {
        return res;
      }
    } else {
      return 500;
    }
  }
}

// 获取所有文章
export const getArticles = async () => {
  let result = await articleSchema.hgetall();
  if (result) {
    // Object.entries()返回一个给定自身对象可枚举属性的键值对数组
    result = Object.entries(result).reduce((prev, current) => {
      let value = current[1] && JSON.parse(current[1]);
      let key = value.label || '其他';

      // 标签归档
      if (prev[key]) {
        prev[key].push({
          id: current[0],
          ...value
        });
      } else {
        prev[key] = [{
          id: current[0],
          ...value
        }];
      }
      return prev;
    }, {});
    return result;
  } else {
    return null
  }
}

// 获取所有文章以数组形式展示，可展示分页，分类
export const getArticleList = async (query) => {
  let result = await articleSchema.hgetall();

  if (result) {
    // num表示当前页数，page表示当前页码，cate表示分类标签
    let num = query.num || 10;
    let page = query.page || 0;
    let cate = query.cate || '';

    // 检查是否传入分类数据
    if (cate && cate !== '首页') {
      result = (await getArticles())[cate] || [];
      result = result.slice(num * page, num);
    } else {
      result = Object.entries(result).slice(num * page, num).reduce((prev, current) => {
        let value = current[1] && JSON.parse(current[1]);
        prev.push({
          id: current[0],
          ...value
        })
        return prev;
      }, []);
    }
    return result;
  } else {
    return null;
  }
}

// 根据id获取文章
export const getArticle = async (id) => {
  let result = await articleSchema.hget(id);
  return result ? JSON.parse(result) : null;
}

// 编辑文章
export const editArticle = async (data) => {
  let {
    id,
    tit,
    label,
    faceUrl,
    content
  } = data;
  
  // 将传入的content内容写入文件里面
  let err = await writeFile(`${articlePath}/${id}.json`, JSON.stringify({content}), 'utf8');
  let desc = content.replace(/<\/?.+?\/?>/g, '');
  if(!err) {
    // 获取要修改的数据
    let articleData = await getArticle(id);
    if(articleData) {
      // 将修改的数据
      let res = await articleSchema.hmset(id, {
        ...articleData,
        tit,
        label,
        faceUrl,
        desc
      });
      return res === 'OK' ? 200 : res;
    }else {
      return `文章数据为空~`
    }
  }else {
    return 500;
  }
}

// 删除文章
export const delArticle = async (id) => {
  let result = await articleSchema.hdel(id);
  
  // 删除文件
  let err = await delFile(`${articlePath}/${id}.json`);
  if(!err) {
    return result;
  }else {
    return [err, result === 1 ? '数据删除成功' : '数据不存在']
  }
}

// 文章点赞功能
export const addArticleFlover = async (id, res) => {
  // 将点赞后的文章重新保存一次
  let result = await articleSchema.hmset(id, res);
  return result === 'OK' ? 200 : null;
}