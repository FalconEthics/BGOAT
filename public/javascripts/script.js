document.addEventListener('DOMContentLoaded', function () {
  var forgotLink = document.querySelector('.link[href="#0"]');
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      $('#forgotPasswordModal').modal('show');
    });
  }
});