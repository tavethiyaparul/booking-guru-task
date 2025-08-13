const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60, checkperiod: 65 }); // 1 minit TTL
// cache.flushAll(); //manual clear cache
module.exports = cache;
