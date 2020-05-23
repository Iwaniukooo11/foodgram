export default (status, message) => {
  const alertElement = document.querySelector('.alert')
  alertElement.classList.remove(`alert--${status}`, 'active')
  alertElement.classList.add(`alert--${status}`, 'active')
  alertElement.innerHTML = message
  alertElement.addEventListener('click', () =>
    alertElement.classList.remove('active')
  )

  setTimeout(() => {
    alertElement.classList.remove('active')
  }, 1300 + message.length * 10)
}
