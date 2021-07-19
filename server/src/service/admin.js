import adminSchema from '../db/schema/admin';
import bcrypt from 'bcrypt';

export const getAdmins = async () => {
  let originResult = await adminSchema.lrange(0, -1);
  if (originResult && originResult.length) {
    let result = originResult.map(item => JSON.parse(item));
    return result;
  } else {
    return [];
  }
}

export const findAdmin = async (name) => {
  let admins = await getAdmins();
  if (admins.length) {
    let result = admins.filter(item => item.username === name);
    return result;
  } else {
    return [];
  }
}

export const addAdmin = async (query) => {
  let admin = await findAdmin(query.username);
  if(admin.length) {
    return null;
  }else {
    let hash = bcrypt.hashSync(query.pwd, 8);
    query.pwd = hash;
    query.role = +query.role;
    let result = await adminSchema.lpush(query);
    return result;
  }
}

export const editAdmin = async (query) => {
  let admins = await getAdmins();
  let index = -1;

  // 遍历找到下标
  index = admins.findIndex(item => item.username === query.prevName);
 
  // 判断传入密码与查找的密码是否相等
  const isEidtPwd = bcrypt.compareSync(query.pwd, admins[index].pwd);
  if(!isEidtPwd) {
    let hash = bcrypt.hashSync(query.pwd, 8);
    query.pwd = hash;
  }

  // 将字符串转换为数字
  query.role = +query.role;

  let result = await adminSchema.lset(index, query);
  return result === 'OK' ? true : false;
}

// async 返回值是一个promise
export const loginAdmin = async (query) => {
  let admin = await findAdmin(query.username);

  if (admin.length) {
    let { username, pwd, role } = admin[0];
    let match = bcrypt.compareSync(query.pwd, pwd);
    return match ? { username, role } : null;
  } else {
    return null;
  }
}

export const delAdmin = async (name) => {
  let admins = await getAdmins();
  let delIndex = -1;

  delIndex = admins.findIndex(item => item.username === name);
  return await adminSchema.lrem(0, JSON.stringify(admins[delIndex]));
}

// 初始化管理员数据
export const initAdmin = async (query) => {
  let admins = await adminSchema.lrange(0, -1);

  if (!admins || !admins.length) {
    let hash = bcrypt.hashSync(query.pwd, 8);
    query.pwd = hash;
    await adminSchema.lpush(query);
  }
} 