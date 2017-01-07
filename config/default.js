module.exports = {
  port: 4000,
  session: {
    secret: 'website',
    key: 'website',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/test'
};