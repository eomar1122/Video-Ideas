if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://root:123456@ds249299.mlab.com:49299/vidjot'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}