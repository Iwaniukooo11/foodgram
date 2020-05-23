import axios from 'axios'
import showAlert from './alert'

export const followUser = async (userId, method = 'POST') => {
  try {
    await axios({
      method,
      url: `${document.location.origin}/api/v1/users/${userId}/follows`,
    })
    // showAlert('ok', method==='POST'? 'followed succesfully':'unfollowed ')
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
