const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const app = require('./app')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

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

// io.on('connection', (socket) => {
//   console.log('\x1b[36m%s\x1b[0m', 'socket user connected')

//   socket.on('socket| add comment', () =>
//     console.log('\x1b[36m%s\x1b[0m', 'socket-comment was added')
//   )
// })

http.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
