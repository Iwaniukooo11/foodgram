export default (status, message, delay = 0) => {
  const alertElement = document.querySelector('.alert')
  alertElement.classList.remove(`alert--${status}`, 'active')
  alertElement.classList.remove(`alert--error`, 'alert--ok', 'active')
  alertElement.innerHTML = message
  alertElement.addEventListener('click', () =>
    alertElement.classList.remove('active')
  )
  setTimeout(() => {
    alertElement.classList.add(`alert--${status}`, 'active')
  }, delay)

  setTimeout(() => {
    alertElement.classList.remove('active')
  }, 1300 + message.length * 10 + delay)
}
