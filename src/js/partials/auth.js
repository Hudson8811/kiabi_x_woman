window.addEventListener('DOMContentLoaded', function () {
  const origin = 'https://authentication.woman.ru'
  let openedWindow = null

  document.body.addEventListener('click', function (e) {
    let target = e.target
    while (target !== this) {
      if (target.hasAttribute('data-auth')) {
        e.preventDefault()
        const url = origin + '/' + target.getAttribute('data-auth') + '.php'
        openedWindow = window.open(url, 'Авторизация', 'width=700,height=500,resizable=yes,scrollbars=no,status=yes')
        return
      }
      target = target.parentNode
    }
  })

  window.addEventListener('message', function (e) {
    const data = e.data
    if (e.origin === origin && data.social) {
      openedWindow.close()
      window.auth && window.auth(data)
    }
  })
})
