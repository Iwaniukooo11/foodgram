import axios from 'axios'

export const update = async (obj) => {
  try {
    await axios.patch(`${document.location.origin}/api/v1/users/me`, obj)
    console.log('updated', obj)
  } catch (err) {
    console.log('err: ', err)
  }
}
