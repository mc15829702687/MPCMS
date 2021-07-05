import adminSchema from '../db/schema/admin';
import bcrypt from 'bcrypt';

export const getAdmins = async (query) => {
  let originResult = await adminSchema.lrange(0, -1);
  if(originResult && originResult.length) {
    
  }
}

export const findAdmin = async (query) => {
  let admins = await getAdmins();
}

export const loginAdmin = async (query) => {
  let admin = await findAdmin(query);
}

// 初始化管理员数据
export const initAdmin = async (query) => {
  let admins = await adminSchema.lrange(0, -1);

  if(!admins || !admins.length) {
    let hash = bcrypt.hashSync(query.pwd, 8);
    query.pwd = hash;
    await adminSchema.lpush(query);
  
  }
} 