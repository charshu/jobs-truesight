
const endpoint = process.env.ENDPOINT || 'http://localhost:3000';
module.exports = function(route) {
  return `${endpoint}/${route}`;
}
