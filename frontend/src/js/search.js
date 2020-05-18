import axios from 'axios'

export const searchUser = async (nick) => {
  try {
    const user = await axios.get(
      `${document.location.origin}/api/v1/users/${nick}?type=nick`
    )
    if (!user) throw new Error('no user like this')
    location.assign(`/users/${nick}?type=nick`)
  } catch {
    alert('not')
  }
}
