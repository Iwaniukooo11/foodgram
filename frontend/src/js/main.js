console.log('hello client side!')
import * as loginActions from './login'
import * as postActions from './postActions'
import * as followActions from './follow'
import * as updateActions from './update'
import * as searchActions from './search'
import io from 'socket.io-client'
import axios from 'axios'

const loginForm = document.getElementById('form-login')
const signUpForm = document.getElementById('form-signup')
const logoutBtn = document.getElementById('logout-btn')
const addReactionBtns = [...document.querySelectorAll('.add-reaction')]
const reactionContentBtns = [...document.querySelectorAll('.likes-quantity')]
const sendCommentForms = [...document.querySelectorAll('.send-comment-form')]
const commentsContentBtns = [...document.querySelectorAll('.comments-quantity')]

const followBtn = document.getElementById('follow-btn')
const updateForms = [...document.querySelectorAll('.update-form')]
const searchUserBtn = document.getElementById('search-user-btn')
const addPostForm = document.getElementById('add-post-form')
const commentsList = [...document.querySelectorAll('.comment-list')]
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
  addReactionBtns.forEach((el, index) =>
    // console.log(index, reactionContentBtns[index])

    el.addEventListener('click', async (e) => {
      let method = 'POST'
      if (el.dataset.is_liked === 'true') method = 'DELETE'

      // if (await postActions.manageReaction(el.dataset.post, 'tasty', method)) {
      postActions.manageReaction(el.dataset.post, 'tasty', method)
      let text = reactionContentBtns[index].innerText * 1

      if (method === 'POST') {
        // el.innerText = '|<3|'
        reactionContentBtns[index].innerText = text + 1
      } else {
        // el.innerText = '<3'
        reactionContentBtns[index].innerText = text - 1
      }

      el.dataset.is_liked = (el.dataset.is_liked !== 'true').toString()
      el.classList.toggle('liked')
      el.classList.toggle('not-liked')
      // }
    })
  )
}

if (sendCommentForms) {
  commentsList.forEach((el) => {
    el.scrollTop = el.scrollHeight
  })

  sendCommentForms.forEach((el, index) =>
    el.addEventListener('submit', async (e) => {
      //api
      e.preventDefault()
      const res = await postActions.addComment(
        el.dataset.post,
        e.target[0].value,
        socket
      )
      console.log(res)
      commentsContentBtns[index].innerText =
        commentsContentBtns[index].innerText * 1 + 1

      e.target[0].value = ''
      //front
      const li = document.createElement('li')
      li.classList.add('post__comment', 'comment')
      li.innerHTML = `
        <a href="/users/${el.dataset.post}" class="comment__link">
          <img src="${el.dataset.image}" alt="" class="comment__user-photo">
        </a>
        <p class="comment__content">
          <span class="comment__user">${el.dataset.nick}</span>
          ${res.data.data.data.content}
        </p>
        `
      const commentsList = document.querySelector(
        `[data-comments_list_id='${el.dataset.post}']`
      )

      commentsList.append(li)
      commentsList.scrollTop = commentsList.scrollHeight
    })
  )
}

if (followBtn) {
  followBtn.addEventListener('click', async (e) => {
    const followersButton = document.getElementById('followers-btn')
    let text = followersButton.innerText * 1
    console.log(text)

    if (followBtn.dataset.follow_action === 'unfollow') {
      // await followActions.followUser(followBtn.dataset.user, 'DELETE')
      followActions.followUser(followBtn.dataset.user, 'DELETE')
      followBtn.innerText = 'follow'
      followBtn.dataset.follow_action = 'follow'
      text -= 1
    } else if (followBtn.dataset.follow_action === 'follow') {
      // await followActions.followUser(followBtn.dataset.user)
      followActions.followUser(followBtn.dataset.user)
      followBtn.innerText = 'unfollow'
      followBtn.dataset.follow_action = 'unfollow'
      text += 1
    }
    followersButton.innerText = text

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
  const imgForm = document.querySelector('.update-img-form')
  if (imgForm)
    imgForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const imgInput = document.getElementById('image')
      const form = new FormData()
      form.append('image', imgInput.files[0] || '')
      updateActions.updateUserImage(form)
    })
}
if (searchUserBtn) {
  searchUserBtn.addEventListener('click', async (e) => {
    const input = document.getElementById('search-user-input')

    await searchActions.searchUser(input.value)
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
    console.log(form)

    postActions.createPost(form)
  })
}
