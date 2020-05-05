const axios = require('axios')

export const auth = async (obj, type) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${document.location.origin}/api/v1/users/${type}`,
      data: obj,
    })
    if (res.data.status === 'OK') {
      //   showAlert('success', 'logged in!')
      alert('git majonez')
      window.setTimeout(() => {
        location.assign('/me')
      }, 1000)
    }
  } catch (err) {
    console.log('err: ', err)
    // showAlert('error', 'NOT logged in!')
  }
}
