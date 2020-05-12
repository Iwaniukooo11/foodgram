console.log('hello client side!')
import { auth } from './login'
import * as postActions from './postActions'
import * as followActions from './follow'

const loginForm = document.getElementById('form-login')
const signUpForm = document.getElementById('form-signup')
const addReactionBtns = [...document.querySelectorAll('.add-reaction')]
const sendCommentForms = [...document.querySelectorAll('.send-comment-form')]
const followBtn = document.getElementById('follow-btn')

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

if (addReactionBtns) {
  addReactionBtns.forEach((el) =>
    el.addEventListener('click', async (e) => {
      // e.preventDefault()
      console.log('click!!')
      await postActions.addReaction(el.dataset.post, 'tasty')
      // alert('posted?')
    })
  )
}
if (sendCommentForms) {
  sendCommentForms.forEach(
    (el) =>
      el.addEventListener('submit', async (e) => {
        console.log(e.target[0].value)
        e.preventDefault()
        await postActions.addComment(el.dataset.post, e.target[0].value)
        // alert('posted?')
        e.target[0].value = ''
      })
    // console.log(el)
  )
}

if (followBtn) {
  followBtn.addEventListener('click', async (e) => {
    await followActions.followUser(followBtn.dataset.user)
    location.reload() //TD
  })
}
