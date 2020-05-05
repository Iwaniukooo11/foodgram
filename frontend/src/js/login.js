const axios = require('axios')

export const login = async (obj) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${document.location.origin}/api/v1/users/login`,
      data: obj,
    })
    if (res.data.status === 'OK') {
      //   showAlert('success', 'logged in!')
      alert('git')
      window.setTimeout(() => {
        location.assign('/me')
      }, 1000)
    }
  } catch (err) {
    console.log('err: ', err)
    // showAlert('error', 'NOT logged in!')
  }
}
