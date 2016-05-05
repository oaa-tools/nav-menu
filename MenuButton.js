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
  this.debug = false;

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

  this.buttonNode.addEventListener('mouseover', function (event) {
    menuButton.handleMouseover(event);
  });

  this.buttonNode.addEventListener('mouseout', function (event) {
    menuButton.handleMouseout(event);
  });

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

    // Removed case this.keyCode.TAB: If menubutton has focus,
    // which it must have if it is the target of a keydown tab
    // event, the menu could not be open.

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
  this.hasFocus = false;
};

MenuButton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.openMenu();
};

MenuButton.prototype.handleMouseout = function (event) {
  var mb = this;
  this.hasHover = false;
  if (this.debug) console.log('MB: mouseout');
  setTimeout(function () { mb.closeMenu(false) }, 300);
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

MenuButton.prototype.closeMenu = function (force) {
  if (this.debug) console.log('MB: closeMenu');
  this.menu.close(force);
};
