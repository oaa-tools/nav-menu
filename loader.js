javascript:(function (baseUrl, src) {
  var el=document.createElement('script');
  el.setAttribute('src', baseUrl + src);
  document.body.appendChild(el);
})('http://localhost/nav-menu/', 'nav-menu.js');
