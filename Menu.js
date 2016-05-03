/*
*   @constructor Menu: Encapsulate state and behavior of menu
*
*   @param menuNode : The element node that serves as the menu container.
*          Each child element that serves as a menuitem must have its
*          role attribute set to 'menuitem'.
*   @param menuButton: The MenuButton object associated with this menu.
*/
var Menu = function (menuNode, menuButton) {
  // Check whether menuNode is a DOM element
  if (!menuNode instanceof Element)
    throw new TypeError("Menu constructor argument 'menuNode' is not a DOM Element.");

  // Check whether menu has child menuitems
  if (menuNode.childElementCount === 0)
    throw new Error("Menu constructor argument 'menuNode' has no Element children!")

  this.menuNode = menuNode;
  this.menuButton = menuButton;
  menuNode.tabIndex = -1;

  this.firstItem = null;
  this.lastItem  = null;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

/*
*   @method Menu.prototype.init
*
*   Initialize firstItem, lastItem
*   Set tabindex for each menuitem
*   Add event listeners for 'keydown', 'click', 'blur' and 'focus' events
*/
Menu.prototype.init = function () {
  var menu = this, // for reference from within event handler
      mi = this.menuNode.firstElementChild; // first menuitem

  this.menuNode.addEventListener('mouseover', function (event) {
    menu.handleMouseover(event);
  });

  this.menuNode.addEventListener('mouseout', function (event) {
    menu.handleMouseout(event);
  });

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.tabIndex = -1;
      if (!this.firstItem) this.firstItem = mi;
      this.lastItem = mi;

      mi.addEventListener('keydown', function (event) {
        menu.handleKeydown(event);
      });

      mi.addEventListener('click', function (event) {
        menu.handleClick(event);
      });

      mi.addEventListener('focus', function (event) {
        menu.handleFocus(event);
      });

      mi.addEventListener('blur', function (event) {
        menu.handleBlur(event);
      });
    }
    mi = mi.nextElementSibling;
  }
};

/* EVENT HANDLERS */

Menu.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      var clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      tgt.dispatchEvent(clickEvent);
      this.close(true);
      flag = true;
      break;

    case this.keyCode.ESC:
      this.close(true);
      this.menuButton.buttonNode.focus();
      flag = true;
      break;

    case this.keyCode.UP:
    case this.keyCode.LEFT:
      this.previousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
    case this.keyCode.RIGHT:
      this.nextItem(tgt);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.close(true, false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

Menu.prototype.handleClick = function (event) {
  this.close(true);
};

Menu.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

Menu.prototype.handleBlur = function (event) {
  var menu = this;
  this.hasFocus = false;
  // setTimeout(function () { menu.close() }, 500);
};

Menu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

Menu.prototype.handleMouseout = function (event) {
  var menu = this;
  this.hasHover = false;
  // do not force close
  setTimeout(function () { menu.close() }, 500);
};

/* ADDITIONAL METHODS */

Menu.prototype.previousItem = function (currentItem) {
  var mi = currentItem.previousElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.previousElementSibling;
  }

  if (!mi && this.lastItem) {
    this.lastItem.focus();
  }
};

Menu.prototype.nextItem = function (currentItem) {
  var mi = currentItem.nextElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.nextElementSibling;
  }

  if (!mi && this.firstItem) {
    this.firstItem.focus();
  }
};

Menu.prototype.open = function () {
  // get position and bounding rectangle of relNode (e.g. menubutton)
  var pos  = this.getPosition(this.menuButton.buttonNode);
  var rect = this.menuButton.buttonNode.getBoundingClientRect();

  this.menuNode.style.display = 'block';
  this.menuNode.style.position = 'absolute';
  this.menuNode.style.top  = (pos.y + rect.height) + "px";
  this.menuNode.style.left = pos.x + "px"; ;
};

Menu.prototype.close = function (force) {
  if (force || (!this.hasHover && !this.hasFocus && !this.menuButton.hasHover)) {
    this.menuNode.style.display = 'none';
    this.menuButton.buttonNode.focus();
  }
};

Menu.prototype.getPosition = function (element) {
  var x = 0, y = 0;

  while (element) {
    x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    y += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: x, y: y };
};
