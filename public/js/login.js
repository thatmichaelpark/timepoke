(function () {
  'use strict';

  $('form').on('submit', function (event) {
    event.preventDefault();
    const loginName = ($('#login-name').val());
    const password = ($('#password').val());
    $.ajax({
      method: 'POST',
      url: '/api/token',
      contentType: 'application/json',
      headers: { accept: 'application/json' },
      data: JSON.stringify({ loginName, password })
    })
    .then(() => {
      window.location.href = '/';
    })
    .catch(() => {
      alert('Unable to log in!');
    });

  })
})();
