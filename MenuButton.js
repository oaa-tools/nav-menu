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
};

/* EVENT HANDLERS */

MenuButton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.SPACE:
      this.menu.open();
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.RETURN:
      this.menu.open();
      this.menu.setFocusToFirstItem();
        flag = true;
      break;

    case this.keyCode.UP:
      this.menu.open();
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.open();
      this.menu.setFocusToFirstItem();
      flag = true;
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
  this.menu.open();
  this.menu.setFocusToFirstItem();
};

MenuButton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.menu.open();
};

MenuButton.prototype.handleMouseout = function (event) {
  var mb = this;
  this.hasHover = false;
  setTimeout(function () { mb.menu.close(false) }, 300);
};
