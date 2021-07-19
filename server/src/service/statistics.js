import statisticsSchema from '../db/schema/statistics';

export const getSiteStatistics = async () => {
  let result = await statisticsSchema.hgetall();
  return result;
}