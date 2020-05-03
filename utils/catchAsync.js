module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
    // .finally(() => console.log('END', req.body))
  }
}
