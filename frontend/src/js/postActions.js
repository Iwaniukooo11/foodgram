import axios from 'axios'
import showAlert from './alert'

export const manageReaction = async (postId, reaction, method = 'POST') => {
  console.log('received method: ', method)
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

    console.log('resp: ', resp, resp.message)
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const createPost = async (obj) => {
  try {
    const res = await axios.post(
      `${document.location.origin}/api/v1/posts`,
      obj
    )
    console.log(res)

    location.assign('/me')
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message)
  }
}
