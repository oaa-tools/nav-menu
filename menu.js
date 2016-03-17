function Menu (node, menuButton) {

  this.keyCode = Object.freeze({
    "TAB"      : 9,
    "RETURN"   : 13,
    "ESC"      : 27,
    "SPACE"    : 32,
    "PAGEUP"   : 33,
    "PAGEDOWN" : 34,
    "END"      : 35,
    "HOME"     : 36,
    "LEFT"     : 37,
    "UP"       : 38,
    "RIGHT"    : 39,
    "DOWN"     : 40
  });

  // Check for DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.menuNode = node;
  node.tabIndex = -1;

  this.menuButton = menuButton;

  this.firstMenuItem = false;
  this.lastMenuItem = false;
};

Menu.prototype.initMenu = function () {
  var menu = this,
      ce = this.menuNode.firstElementChild;

  while (ce) {
    if (ce.getAttribute('role')  === 'menuitem') {
      ce.tabIndex = -1;
      if (!this.firstMenuItem) this.firstMenuItem = ce;
      this.lastMenuItem = ce;

      ce.addEventListener('keydown', function (event) {
        menu.handleKeyDown(event, menu);
      });

      ce.addEventListener('click', function (event) {
        menu.handleMouseClick(event, menu);
      });

      ce.addEventListener('blur', function (event) {
        menu.handleBlur(event, menu);
      });

      ce.addEventListener('focus', function (event) {
        menu.handleFocus(event, menu);
      });
    }

    ce = ce.nextElementSibling;
  }
};

Menu.prototype.nextMenuItem = function (currentMenuItem) {
  var mi = currentMenuItem.nextElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.nextElementSibling;
  }

  if (!mi && this.firstMenuItem) {
    this.firstMenuItem.focus();
  }
};

Menu.prototype.previousMenuItem = function (currentMenuItem) {
  var mi = currentMenuItem.previousElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.previousElementSibling;
  }

  if (!mi && this.lastMenuItem) {
    this.lastMenuItem.focus();
  }
};

Menu.prototype.eventKeyDown = function (event, menu) {
  var tgt = event.currentTarget,
      flag = false;

  switch (event.keyCode) {
    case menu.keyCode.SPACE:
    case menu.keyCode.RETURN:
      var clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      tgt.dispatchEvent(clickEvent);
      menu.menuButton.closeMenu(true);
      flag = true;
      break;

    case menu.keyCode.ESC:
      menu.menuButton.closeMenu(true);
      menu.menuButton.buttonNode.focus();
      flag = true;
      break;

    case menu.keyCode.UP:
    case menu.keyCode.LEFT:
      menu.previousMenuItem(tgt);
      flag = true;
      break;

    case menu.keyCode.DOWN:
    case menu.keyCode.RIGHT:
      menu.nextMenuItem(tgt);
      flag = true;
      break;

    case menu.keyCode.TAB:
      menu.menuButton.closeMenu(true, false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};
