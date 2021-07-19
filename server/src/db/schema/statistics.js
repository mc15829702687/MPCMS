import RedisSchema from '../../lib/schema';

const statisticsSchema = new RedisSchema('statistics', {
  id: '/statistics',
  type: 'object',
  properties: {
    views: {type: 'string'}
  }
});

export default statisticsSchema;