/*
*   @constructor MenuButton
*
*   @desc
*       Object that encapsulates data and behavior (via event handlers)
*       of an HTML button or custom button-like component that, in turn
*       controls a menu component.
*
*   @param buttonNode
*       The DOM element that serves as the menubutton control.
*/
var MenuButton = function (buttonNode) {

  // Check whether buttonNode is a DOM element
  if (!buttonNode instanceof Element) {
    throw new TypeError("MenuButton constructor argument 'buttonNode' is not a DOM Element.");
  }

  this.buttonNode = buttonNode;
  this.menuNode = null;

  this.keyCode = Object.freeze({
    'RETURN' : 13,
    'ESC'    : 27,
    'SPACE'  : 32,
    'UP'     : 38,
    'DOWN'   : 40
  });
};

/*
*   @method MenuButton.prototype.init
*
*   @desc
*       Find and store the menuNode associated with button via its
*       aria-controls attribute; instantiate and initialize the Menu
*       object associated with the menuNode; add event listeners.
*/
MenuButton.prototype.init = function () {
  var id, that = this;

  id = this.buttonNode.getAttribute('aria-controls');
  if (id) {
    this.menuNode = document.getElementById(id);
    if (this.menuNode) {
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
    that.handleMouseover(event);
  });

  this.buttonNode.addEventListener('mouseout', function (event) {
    that.handleMouseout(event);
  });

  this.buttonNode.addEventListener('keydown', function (event) {
    that.handleKeydown(event);
  });

  this.buttonNode.addEventListener('click', function (event) {
    that.handleClick(event);
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
  var that = this;
  this.hasHover = false;
  setTimeout(function () { that.menu.close(false) }, 300);
};
