console.log('hello client side!')
const { auth } = require('./login')

const loginForm = document.getElementById('form-login')
const signUpForm = document.getElementById('form-signup')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const nick = document.getElementById('nick').value
    const password = document.getElementById('password').value
    console.log('before login action')
    auth({ nick, password }, 'login')
  })
}
if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const nick = document.getElementById('nick').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('passwordConfirm').value
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    console.log('before login action')
    auth({ nick, password, email, passwordConfirm, name }, 'signup')
  })
}
