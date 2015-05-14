(function () {

  var headingsSelector = 'h1, h2, h3';
  var headingsInfo = [];

  var landmarksSelector = 'main, [role="main"], nav, [role="navigation"]';
  var landmarksInfo = [];

  var config = {
    counter         : 0,
    menuId          : 'wzdfrwu23402fm',
    top             : 20 + 'px',
    left            : 20 + 'px',
    backgroundColor : 'white',
    border          : '1px solid red',
    paddingLeft     : '1em',
    paddingRight    : '1em',
    zIndex          : '100000'
  };

  var getNextId = function () {
    var num = config.counter += 1;
    return 'oaa-nav-menu-' + num;
  };

  var truncate = function (s) {
    if (s && s.length > 27)
      return s.substring(0, 27) + '...';
    else
      return s;
  };

  var normalize = function (s) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return s.replace(rtrim, '').replace(/\s+/g, ' ');
  };

  var getAttributeValue = function (element, attribute) {
    var value = element.getAttribute(attribute);
    return (value === null) ? '' : normalize(value);
  };

  var getElementText = function (element) {
    var arrayOfStrings;

    function getTextRec (node, arr) {
      var tagName, altText, content;

      switch (node.nodeType) {
        case (Node.ELEMENT_NODE):
          tagName = node.tagName.toLowerCase();
          if (tagName === 'img' || tagName === 'area') {
            altText = getAttributeValue(node, "alt");
            if (altText.length) arr.push(altText);
          }
          else {
            if (node.hasChildNodes()) {
              Array.prototype.forEach.call(node.childNodes, function (n) {
                getTextRec(n, arr);
              });
            }
          }
          break;
        case (Node.TEXT_NODE):
          content = normalize(node.textContent);
          if (content.length) arr.push(content);
          break;
        default:
          break;
      }

      return arr;
    }

    arrayOfStrings = getTextRec(element, []);
    if (arrayOfStrings.length)
      return arrayOfStrings.join(' ');
    return '';
  };

  var processTarget = function (element) {
    var info = {};

    info.id = element.getAttribute('id') || getNextId();
    element.setAttribute('id', info.id);
    if (typeof element.tabIndex === 'undefined') element.tabIndex = '-1';

    info.text = element.tagName.toLowerCase() + ': ' + truncate(getElementText(element));
    return info;
  };

  var getHeadings = function () {
    var headings = document.querySelectorAll(headingsSelector);
    Array.prototype.forEach.call(headings, function (element) {
      var info = processTarget(element);
      headingsInfo.push(info);
    });
  };

  var init = function () {
    getHeadings();
  };

  var createMenu = function () {
    var div, ul;
    init();

    // create the menu container
    div = document.createElement('div');
    div.id = config.menuId;
    div.style.position = 'absolute';
    div.style.top = config.top;
    div.style.left = config.left;
    div.style.backgroundColor = config.backgroundColor;
    div.style.border = config.border;
    div.style.paddingLeft = config.paddingLeft;
    div.style.paddingRight = config.paddingRight;
    div.style.zIndex = config.zIndex;

    // build the menu list
    ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.paddingLeft = 0;
    headingsInfo.forEach(function (info) {
      var a = document.createElement('a'),
        li = document.createElement('li');
      a.href = '#' + info.id;
      a.innerHTML = info.text;
      li.appendChild(a);
      ul.appendChild(li);
    });

    // finalize
    div.appendChild(ul);
    return div;
  };

  var showMenu = function () {
    var menu = createMenu();
    document.body.insertBefore(menu, document.body.firstChild);
  };

  var hideMenu = function () {
    var menu = document.getElementById(config.menuId);
    document.body.removeChild(menu);
  };

  window.oaaKeyboardNavMenuApp = function (flag) {
    window.oaaKeyboardNavMenuState = (typeof flag === "undefined") ? true : !flag;
    if (!flag) showMenu();
    else hideMenu();
  };

  window.oaaKeyboardNavMenuApp(window.oaaKeyboardNavMenuState);

})();
