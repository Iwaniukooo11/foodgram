const dotenv = require('dotenv')
const mongoose = require('mongoose')
// const livereload = require('livereload')
// const connectLivereload = require('connect-livereload')
// const path = require('path')

dotenv.config({ path: './config.env' })
const app = require('./app')
// app.use(connectLivereload())

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD)
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connection succesful'))
  .catch((err) => console.log('error'))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
// const liveReloadServer = livereload.createServer()
// liveReloadServer.watch(path.join(__dirname, 'public'))
