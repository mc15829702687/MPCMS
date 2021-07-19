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

  // 如果key存在返回key的值，key不存在返回的是null
  get() {
    return this.redis.get(this.schemaName);
  }

  // 通过索引获取列表中的元素
  lindex(index) {
    return this.redis.lindex(this.schemaName, index);
  }

  // 获取列表中指定范围的元素
  lrange(start, end) {
    return this.redis.lrange(this.schemaName, start, end);
  }

  lpush(value) {
    return this.validate(value, this.schema, () => {
      return this.redis.lpush(this.schemaName, JSON.stringify(value));
    });
  }

  // 获取列表长度，若列表不存在，则是空列表返回0
  llen() {
    return this.redis.llen(this.schemaName);
  }

  // 给某个schemaName设置过期时间
  expire(time) {
    return this.redis.expire(this.schemaName, time);
  }

  // 移除某个schemaName过期时间，移除成功返回1，否则返回0
  persist() {
    return this.redis.persist(this.schemaName);
  }

  // 重命名，成功返回OK，失败则返回错误信息
  rename(new_schemaName) {
    return this.redis.rename(this.schemaName, new_schemaName);
  }

  // 成功返回OK
  set(value, time) {
    return this.validate(value, this.schema, () => {
      if(time) {
        return this.redis.set(this.schemaName, value, 'EX', time);
      }else {
        return this.redis.set(this.schemaName, value);
      }
    })
  } 

  // 将某个schema的值自增指定数量的值
  incrby(num) {
    return this.redis.incrby(this.schemaName, num);
  }

  // 将某个schema的值自减指定数量的值
  decrby(num) {
    return this.redis.decrby(this.schemaName, num);
  }

  // 为哈希表中的key设置增值
  hincrby(key, num) {
    return this.redis.hincrby(this.schemaName, key, num);
  }

  lset(index, value) {
    return this.redis.lset(this.schemaName, index, JSON.stringify(value));
  }

  // 删除表中数据
  lrem(count, value) {
    return this.redis.lrem(this.schemaName, count, value);
  }

  // 以列表形式返回哈希表的字段及字段值
  hgetall() {
    return this.redis.hgetall(this.schemaName);
  }

  // 用于返回哈希表中指定字段的值
  hget(key) {
    return this.redis.hget(this.schemaName, key);
  }

  // hash表设置key, value
  hmset(key, value) {
    if (key) {
      if (this.schema.properties) {
        return this.validate(value, this.schema.properties[key], () => {
          return this.redis.hmset(this.schemaName, key, JSON.stringify(value));
        });
      } else {
        return this.validate(value, this.schema.patternProperties["^[a-z0-9]+$"], () => {
          return this.redis.hmset(this.schemaName, key, JSON.stringify(value));
        });
      }
    } else {
      return this.validate(value, this.schema, () => {
        for (let key in value) {
          let v = value[key];
          value[key] = JSON.stringify(v);
        }
        return this.hmset(this.schemaName, value);
      });
    }
  }

  // 删除哈希表 key 中的一个或多个指定字段，不存在的字段将被忽略
  hdel(key) {
    return this.redis.hdel(this.schemaName, key);
  }

  // 检测某个schemaName是否存在
  exists() {
    return this.redis.exists(this.schemaName);
  }

  // 若key存在返回删除的数量
  del() {
    return this.redis.del(this.schemaName);
  }
}

export default RedisSchema;