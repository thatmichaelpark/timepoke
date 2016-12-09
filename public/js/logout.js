(function () {
  'use strict';

$.ajax({
  method: 'DELETE',
  url: '/api/token',
  contentType: 'application/json',
  headers: { accept: 'application/json' }
})
.then(() => {
  window.location.href = '/';
})
.catch(() => {
  alert('Unable to log out!');
});

})();
