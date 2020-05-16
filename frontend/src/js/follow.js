import axios from 'axios'

export const followUser = async (userId, method = 'POST') => {
  try {
    await axios({
      method,
      url: `${document.location.origin}/api/v1/users/${userId}/follows`,
    })
    alert('did action', method)
  } catch (err) {
    console.log('ERR: ', err)
  }
}
