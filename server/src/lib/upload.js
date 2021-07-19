import fs from 'fs';
import {resolve} from 'path';
import multer from '@koa/multer';

// 文件上传路径
const rootImages = resolve(__dirname, '../../public/upload');

// 上传文件路径，文件命名
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, rootImages);
  },
  filename(req, file, cb) {
    let [name, type] = file.originalname.split('.');
    cb(null, `${name}_${Date.now().toString(16)}.${type}`);
  }
})

// 文件上传限制
const limits = {
  fileSize: 1024 * 1024 * 2,     // 上传文件大小
  fields: 10,                    // 非文件字段数量
  files: 1,                      // 上传文件个数
}

export const upload = multer({
  storage,
  limits
});

// 写入文件
export const writeFile = (path, data, encoding) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, encoding, (err) => {
      if(err) {
        reject(err);
      }else {
        resolve(null);
      }
    })
  })
}

// 删除文件
export const delFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if(err) {
        reject(err);
      }else {
        resolve(null);
      }
    })
  });
}

// 删除文件夹
export const deleteFolder = (path) => {
  // 先判断文件夹是否存在
  if(fs.existsSync(path)) {
    let files = fs.readdirSync(path);     // 读取下一层文件(包含文件夹和文件)，返回值是一个数组
    files.forEach((file) => {
      let curPath = `${path}/${file}`;
      // 如果是文件夹，则递归继续处理
      if(fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      }else {
        fs.unlinkSync(curPath);
      }
    })
    fs.rmdirSync(path);
  }
}