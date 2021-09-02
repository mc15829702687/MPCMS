import RedisSchema from '../../lib/schema';

const adminSchema = new RedisSchema('admin', {
  id: '/admin',
  type: 'object',
  properties: {
    username: {type: 'string'},
    pwd: {type: 'string'},
    role: {type: 'number'}
  }
});

export default adminSchema;