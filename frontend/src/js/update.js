import axios from 'axios'
import showAlert from './alert'

export const update = async (obj) => {
  try {
    await axios.patch(`${document.location.origin}/api/v1/users/me`, obj)
    showAlert('ok', 'updated sucesfully')
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
export const updateUserImage = async (form) => {
  try {
    if (!form) throw new Error('No image selected!')
    await axios.patch(
      `${document.location.origin}/api/v1/users/update-user-img`,
      form
    )
    showAlert('ok', 'updated succesfully')
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
