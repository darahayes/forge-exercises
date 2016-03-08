module.exports = {
  'mongo': {
    name: process.env.MONGO_NAME || 'progress',
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  },
  'service': {
    host: process.env.EXERCISES_HOST || '127.0.0.1',
    port : process.env.EXERCISES_PORT || 9002
  }
}