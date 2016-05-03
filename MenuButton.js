/*
*   @constructor MenuButton: Encapsulate state and behavior of menu button
*
*   @param buttonNode : The element node that serves as the menubutton control.
*/
var MenuButton = function (buttonNode) {
  // Check whether buttonNode is a DOM element
  if (!buttonNode instanceof Element)
    throw new TypeError("MenuButton constructor argument 'buttonNode' is not a DOM Element.");

  this.buttonNode = buttonNode;
  this.menuNode = null;
  this.isLink = false;

  if (buttonNode.tagName.toLowerCase() === 'a') {
    var url = buttonNode.getAttribute('href');
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
    if (this.menuNode) {
      // Instantiate and initialize Menu object
      this.menu = new Menu(this.menuNode, this);
      this.menu.init();
    }
    else {
      throw new Error("MenuButton init error: menuNode not found.");
    }
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

/* EVENT HANDLERS */

MenuButton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.SPACE:
      this.moveFocusToFirstMenuitem();
      flag = true;
      break;

    case this.keyCode.RETURN:
      this.moveFocusToFirstMenuitem();
        flag = true;
      break;

    case this.keyCode.UP:
      this.moveFocusToLastMenuitem();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.moveFocusToFirstMenuitem();
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
 this.moveFocusToFirstMenuitem();
};

MenuButton.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

MenuButton.prototype.handleBlur = function (event) {
  var mb = this;
  this.hasFocus = false;
  // setTimeout(function () { mb.closeMenu() }, 500);
};

MenuButton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.openMenu();
};

MenuButton.prototype.handleMouseout = function (event) {
  var mb = this;
  this.hasHover = false;
  setTimeout(function () { mb.closeMenu() }, 500);
};

/* ADDITIONAL METHODS */

MenuButton.prototype.moveFocusToFirstMenuitem = function () {
  if (this.menu.firstItem) {
    this.openMenu();
    this.menu.firstItem.focus();
  }
};

MenuButton.prototype.moveFocusToLastMenuitem = function () {
  if (this.menu.lastItem) {
    this.openMenu();
    this.menu.lastItem.focus();
  }
};

MenuButton.prototype.openMenu = function () {
  this.menu.open();
};

MenuButton.prototype.closeMenu = function () {
  if (!this.hasHover && !this.menu.hasHover) {
    this.menu.close();
    this.buttonNode.focus();
  }
};

// not currently used
MenuButton.prototype.toggleMenu = function () {
  if (this.menuNode.style.display === 'block') this.menuNode.style.display = 'none';
  else this.menuNode.style.display = 'block';
};
