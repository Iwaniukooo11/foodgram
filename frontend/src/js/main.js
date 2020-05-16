console.log('hello client side!')
import * as loginActions from './login'
import * as postActions from './postActions'
import * as followActions from './follow'
import * as updateActions from './update'
import io from 'socket.io-client'

const loginForm = document.getElementById('form-login')
const signUpForm = document.getElementById('form-signup')
const logoutBtn = document.getElementById('logout-btn')
const addReactionBtns = [...document.querySelectorAll('.add-reaction')]
const sendCommentForms = [...document.querySelectorAll('.send-comment-form')]
const followBtn = document.getElementById('follow-btn')
const updateForms = [...document.querySelectorAll('.update-form')]
const searchUserBtn = document.getElementById('search-user-btn')
const addPostForm = document.getElementById('add-post-form')
// console.log(updateForms)\
// const socket = io.connect('http://localhost:3000')
// socket.on('connect', (data) => socket.emit('join'))
const socket = io()
console.log('front-end socket: ', socket)

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const nick = document.getElementById('nick').value
    const password = document.getElementById('password').value
    console.log('before login action')
    loginActions.auth({ nick, password }, 'login')
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
    loginActions.auth(
      { nick, password, email, passwordConfirm, name },
      'signup'
    )
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    loginActions.logout()
  })
}

if (addReactionBtns) {
  addReactionBtns.forEach((el) =>
    el.addEventListener('click', async (e) => {
      console.log('clicked!!!')
      let method = 'POST'

      if (el.dataset.is_liked === 'true') method = 'DELETE'

      if (await postActions.manageReaction(el.dataset.post, 'tasty', method))
        el.dataset.is_liked = (el.dataset.is_liked !== 'true').toString()
    })
  )
}
if (sendCommentForms) {
  sendCommentForms.forEach(
    (el) =>
      el.addEventListener('submit', async (e) => {
        console.log(e.target[0].value)
        e.preventDefault()
        await postActions.addComment(el.dataset.post, e.target[0].value, socket)
        // alert('posted?')
        e.target[0].value = ''
      })
    // console.log(el)
  )
}

if (followBtn) {
  followBtn.addEventListener('click', async (e) => {
    if (followBtn.dataset.follow_action === 'unfollow')
      await followActions.followUser(followBtn.dataset.user, 'DELETE')
    else if (followBtn.dataset.follow_action === 'follow')
      await followActions.followUser(followBtn.dataset.user)

    // location.reload() //TD
  })
}

if (updateForms) {
  updateForms.forEach((form) =>
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      await updateActions.update({
        [e.target[0].name]: e.target[0].value,
      })
    })
  )
}
if (searchUserBtn) {
  searchUserBtn.addEventListener('click', (e) => {
    const input = document.getElementById('search-user-input')
    try {
      location.assign(`/users/${input.value}?type=nick`)
    } catch {
      alert('not')
    }
  })
}

if (addPostForm) {
  addPostForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const descInput = document.getElementById('description')
    const imgInput = document.getElementById('image')
    const form = new FormData()
    form.append('description', descInput.value)
    form.append('image', imgInput.files[0] || '')

    postActions.createPost(form)
  })
}
