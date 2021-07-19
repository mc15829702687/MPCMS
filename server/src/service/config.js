import configSchema from '../db/schema/config';

export const getConfig = async () => {
  const result = await configSchema.hgetall();
  return result;
}

export const setHeader = async (headerData) => {
  const result = await configSchema.hmset('header', headerData);
  return result === 'OK' ? true : false;
}

export const setBanner = async (bannerData) => {
  const result = await configSchema.hmset('banner', bannerData);
  return result === 'OK' ? true : false;
}

export const setBannerSide = async (bannerSideData) => {
  const result = await configSchema.hmset('bannerSide', bannerSideData);
  return result === 'OK' ? true : false;
}

export const setSupportPay = async (supportPayData) => {
  const result = await configSchema.hmset('supportPay', supportPayData);
  return result === 'OK' ? true : false;
}