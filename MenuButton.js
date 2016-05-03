/*
*   @constructor MenuButton: Encapsulate state and behavior of menu button
*
*   @param node : The element node that serves as the menubutton control.
*/
var MenuButton = function (node) {
  // Check whether node is a DOM element
  if (!node instanceof Element)
    throw new TypeError("MenuButton constructor argument 'node' is not a DOM Element.");

  this.buttonNode = node;
  this.menuNode = null;
  this.isLink = false;

  if (node.tagName.toLowerCase() === 'a') {
    var url = node.getAttribute('href');
    if (url && url.length) {
      this.isLink = true;
    }
  }

  this.keyCode = Object.freeze({
     'TAB'    :  9,
     'RETURN' : 13,
     'ESC'    : 27,
     'SPACE'  : 32,
     'UP'     : 38,
     'DOWN'   : 40
  });
};

MenuButton.prototype.init = function () {
  var id = this.buttonNode.getAttribute('aria-controls'),
      menuButton = this;

  if (id) {
    this.menuNode = document.getElementById(id);
    if (this.menuNode)
      // Instantiate and initialize Menu object
      this.menu = new Menu(this.menuNode).init();
    else
      throw new Error("MenuButton init error: menuNode not found.");
  }
  else {
    throw new Error("MenuButton init error: 'aria-controls' id not found.")
  }

  this.buttonNode.addEventListener('keydown', function (event) {
    menuButton.handleKeydown(event);
  });

  this.buttonNode.addEventListener('click', function (event) {
    menuButton.handleClick(event);
  });

  this.buttonNode.addEventListener('focus', function (event) {
    menuButton.handleFocus(event);
  });

  this.buttonNode.addEventListener('blur', function (event) {
    menuButton.handleBlur(event);
  });

  this.buttonNode.addEventListener('mouseover', function (event) {
    menuButton.handleMouseover(event);
  });

  this.buttonNode.addEventListener('mouseout', function (event) {
    menuButton.handleMouseout(event);
  });

  this.closeMenu();
};

MenuButton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.SPACE:
      this.moveFocusToFirstMenuItem();
      flag = true;
      break;

    case this.keyCode.RETURN:
      this.moveFocusToFirstMenuItem();
        flag = true;
      break;

    case this.keyCode.UP:
      this.moveFocusToLastMenuItem();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.moveFocusToFirstMenuItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.closeMenu(true, false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButton.prototype.handleClick = function (event) {
 this.moveFocusToFirstMenuItem();
};

MenuButton.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

MenuButton.prototype.handleBlur = function (event) {
  this.hasFocus = false;
  setTimeout(function () { this.close() }, 500);
};

MenuButton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.openMenu();
};

MenuButton.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(function () { this.closeMenu() }, 500);
};

MenuButton.prototype.moveFocusToFirstMenuitem = function () {
  if (this.menu.firstItem) {
    this.openMenu();
    this.menu.firstItem.focus();
  }
};

MenuButton.prototype.moveFocusToLastMenuitem = function () {
  if (this.menu.lastMenuItem) {
    this.openMenu();
    this.menu.lastMenuItem.focus();
  }
};

MenuButton.prototype.openMenu = function () {
  this.menu.open(this.buttonNode);
};

MenuButton.prototype.closeMenu = function (force, focus_menu_button) {
  if (typeof force !== 'boolean') force = false;
  if (typeof focus_menu_button !== 'boolean') focus_menu_button = true;

  if (force || !this.hasHover) {
      this.menu.close(force);
      if (focus_menu_button) this.buttonNode.focus();
  }
};

// not currently used
MenuButton.prototype.toggleMenu = function () {
  if (this.menuNode.style.display === 'block') this.menuNode.style.display = 'none';
  else this.menuNode.style.display = 'block';
};
