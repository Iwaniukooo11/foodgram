console.log('hello client side!')
const { login } = require('./login')

const loginForm = document.getElementById('form-login')
console.log(loginForm)
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const nick = document.getElementById('nick').value
    const password = document.getElementById('password').value
    console.log('before login action')
    login({ nick, password })
  })
}
