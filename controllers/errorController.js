module.exports = (err, req, res, next) => {
  const error = { ...err }
  error.statusCode = err.statusCode || 500
  error.status = err.status || 'error'

  console.log('ERROR CONTROLLER', err.message, req.originalUrl)
  console.log('frist case')
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      test: 'mati',
      error,
      status: 'ERROR',
      message: err.message || err.data.message,
    })
  } else res.redirect('/login')
}
