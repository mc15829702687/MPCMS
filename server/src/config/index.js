import os from 'os';

export const isDev = process.env.NODE_ENV === 'development';

// 获取本地ip地址
const getIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.address !== '127.0.0.1' && alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

const IP = getIpAddress();
export const staticPath = isDev ? `http://${IP}:3000` : '';