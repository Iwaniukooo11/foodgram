import axios from 'axios'

export const followUser = async (userId) => {
  try {
    await axios.post(
      `${document.location.origin}/api/v1/users/${userId}/follows`
    )
    alert('followed!')
  } catch (err) {
    console.log('ERR: ', err)
  }
}
