import RedisSchema from '../../lib/schema';

// 存放配置信息数据
const configSchema = new RedisSchema('config', {
  id: '/config',
  type: 'object',
  properties: {
    header: {
      type: 'object',
      properties: {
        columns: {
          type: 'array',
          items: { type: 'string' }
        },
        height: { type: 'string' },
        backgroundColor: { type: 'string' },
        logo: { type: 'string' }
      }
    },
    banner: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        columns: {
          type: 'array',
          items: { type: 'string' }
        },
        bgUrl: { type: 'string' },
        bannerList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              tit: { type: 'string' },
              label: {
                type: 'array',
                items: { type: 'string' }
              },
              imgUrl: { type: 'string' }
            }
          }
        }
      }
    },
    bannerSide: {
      type: 'object',
      properties: {
        tit: { type: 'string' },
        imgUrl: { type: 'string' },
        desc: { type: 'string' }
      }
    },
    supportPay: {
      type: 'object',
      properties: {
        tit: { type: 'string' },
        imgUrl: { type: 'string' }
      }
    }
  }
});

// 初始化config数据
async function initConfig() {
  const isExist = await configSchema.exists();

  if (!isExist) {
    const result = await configSchema.hmset(null, {
      header: {
        columns: ['首页'],
        height: '50',
        backgroundColor: '#00',
        logo: ''
      },
      banner: {
        type: '1',      // 0为标签，1为轮播图
        columns: [],
        bgUrl: '',
        bannerList: []
      },
      bannerSide: {
        tit: '侧边栏信息',
        imgUrl: '',
        desc: '描述'
      },
      supportPay: {
        tit: '',
        imgUrl: ''
      }
    });
    if(!Array.isArray(result)) {
      console.log(`配置信息初始化成功~`);
    }else {
      throw result;
    }
  }
}

initConfig();

export default configSchema;