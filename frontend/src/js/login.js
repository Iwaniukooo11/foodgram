import axios from 'axios'
import showAlert from './alert'

export const auth = async (obj, type) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${document.location.origin}/api/v1/users/${type}`,
      data: obj,
    })
    if (res.data.status === 'OK') location.assign('/me')
    showAlert('ok', 'succesfully logged in!')
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const logout = async () => {
  try {
    await axios.get(`${document.location.origin}/api/v1/users/logout`)
    // location.reload(true)
    location.assign('/login')
  } catch (err) {
    console.log(err)
  }
}
