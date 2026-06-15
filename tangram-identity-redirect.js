(function () {
  var adminPath = '/admin/';
  var tokenPattern = /(invite_token|confirmation_token|recovery_token|email_change_token)=/;

  if (!tokenPattern.test(window.location.hash || '')) return;
  if (window.location.pathname.replace(/\/+$/, '/') === adminPath) return;

  window.location.replace(adminPath + window.location.hash);
})();
