import axios from 'axios'
import showAlert from './alert'

export const manageReaction = async (postId, reaction, method = 'POST') => {
  try {
    const resp = await axios({
      method,
      url: `${document.location.origin}/api/v1/posts/${postId}/reactions`,
      data: {
        reaction,
      },
    })
    return resp
  } catch (err) {
    showAlert('error', err.response.data.message)
    return ''
  }
}
export const addComment = async (postId, content, socket) => {
  try {
    const resp = await axios.post(
      `${document.location.origin}/api/v1/posts/${postId}/comments`,
      {
        content,
      }
    )
    socket.emit('socket| add comment')
    return resp
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const createPost = async (obj) => {
  try {
    if (!obj) throw new Error('No file found!')
    const res = await axios.post(
      `${document.location.origin}/api/v1/posts`,
      obj
    )
    location.assign('/me')
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
