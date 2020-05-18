import axios from 'axios'

export const update = async (obj) => {
  try {
    await axios.patch(`${document.location.origin}/api/v1/users/me`, obj)
    console.log('updated', obj)
  } catch (err) {
    console.log('err: ', err)
  }
}
export const updateUserImage = async (form) => {
  try {
    await axios.patch(
      `${document.location.origin}/api/v1/users/update-user-img`,
      // { image: form }
      form
    )
    console.log('updated', form)
  } catch (err) {
    console.log('err: ', err)
  }
}
