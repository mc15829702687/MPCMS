import { validate } from 'jsonschema';
import redis from '../db/redis';

class RedisSchema {
  constructor(schemaName, schema) {
    this.schemaName = schemaName;
    this.schema = schema;
    this.redis = redis;
  }

  validate(value, schema, cb) {
    const { valid, errors } = validate(value, schema);
    if (valid) {
      return cb();
    }
    return errors.map(item => item.stack);
  }

  // 获取列表中指定范围的元素
  lrange(start, end) {
    return this.redis.lrange(this.schemaName, start, end);
  }

  lpush(value) {
    this.validate(value, this.schema, () => {
      return this.redis.lpush(this.schemaName, JSON.stringify(value));
    });
  }
}

export default RedisSchema;