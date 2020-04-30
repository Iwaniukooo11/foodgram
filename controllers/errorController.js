module.exports = async (err, req, res) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  console.log('ERROR CONTROLLER')
  res.setHeader('Content-Type', 'application/json').status(statusCode).json({
    test: 'mati',
    err,
  })
}
