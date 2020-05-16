module.exports = (err, req, res, next) => {
  const error = { ...err }
  error.statusCode = err.statusCode || 500
  error.status = err.status || 'error'

  console.log('ERROR CONTROLLER', err.message, req.originalUrl)
  //dev
  if (req.originalUrl.startsWith('/api')) {
    console.log('frist case')
    res.status(error.statusCode).json({
      test: 'mati',
      error,
      status: 'ERROR',
      message: err.message || err.data.message,
    })
  }
  //web
  res.status(error.statusCode).render('error', {
    // title: 'pls',
    // test: 'mati',
    error,
    // status: 'ERROR',
    message: err.message || err.data.message,
  })
}
