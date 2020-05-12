module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  console.log('ERROR CONTROLLER')
  res.status(err.statusCode).json({
    test: 'mati',
    error: err,
    status: 'ERROR',
    message: err.message || err.data.message,
  })
}
