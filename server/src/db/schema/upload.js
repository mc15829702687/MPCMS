import RedisSchema from '../../lib/schema';

const uploadSchema = new RedisSchema('uploadSchema', {
  id: '/upload',
  type: 'object',
  properties: {
    source: { type: 'string' },
    url: { type: 'string' }
  }
});

export default uploadSchema;
