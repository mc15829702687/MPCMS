import uploadSchema from '../db/schema/upload';

// 上传图片
export const uploadImg = async (data) => {
  const result = await uploadSchema.lpush(data);
  return result; 
}

// 获取所有图片数据
export const getGallery = async () => {
  const result = await uploadSchema.lrange(0, -1);
  return result;
}