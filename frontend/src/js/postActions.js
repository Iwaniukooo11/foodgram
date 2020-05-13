import axios from 'axios'

export const addReaction = async (postId, reaction) => {
  try {
    await axios.post(
      `${document.location.origin}/api/v1/posts/${postId}/reactions`,
      {
        reaction,
      }
    )
  } catch (err) {
    console.log('ERR!: ', err)

    alert(err.message)
  }
}
export const addComment = async (postId, content) => {
  try {
    await axios.post(
      `${document.location.origin}/api/v1/posts/${postId}/comments`,
      {
        content,
      }
    )
  } catch (err) {
    console.log('ERR!: ', err)
    alert(err.message)
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
  }
}
