/*
*   @constructor Menu: Encapsulate state and behavior of menu
*
*   @param node : The element node that serves as the menu container.
*          Each child element that serves as a menuitem must have its
*          role attribute set to 'menuitem'.
*/
var Menu = function (node) {
  // Check whether node is a DOM element
  if (!node instanceof Element)
    throw new TypeError("Menu constructor argument 'node' is not a DOM Element.");

  // Check whether menu has child menuitems
  if (node.childElementCount === 0)
    throw new Error("Menu constructor argument 'node' has no Element children!")

  this.menuNode = node;
  node.tabIndex = -1;

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

      mi.addEventListener('mouseover', function (event) {
        menu.handleMouseover(event);
      });

      mi.addEventListener('mouseout', function (event) {
        menu.handleMouseout(event);
      });
    }

    mi = mi.nextElementSibling;
  }
};

/* Event handler methods */

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
      this.menuButton.closeMenu(true);
      flag = true;
      break;

    case this.keyCode.ESC:
      this.menuButton.closeMenu(true);
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
      this.menuButton.closeMenu(true, false);
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
  this.close();
};

Menu.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

Menu.prototype.handleBlur = function (event) {
  this.hasFocus = false;
  setTimeout(function () { this.close() }, 500);
};

Menu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.open();
};

Menu.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(function () { this.close() }, 500);
};

/* Additional methods */

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

Menu.prototype.open = function (relNode) {
  // get position and bounding rectangle of relNode (e.g. menubutton)
  var pos  = this.getPosition(relNode);
  var rect = relNode.getBoundingClientRect();

  this.menuNode.style.display = 'block';
  this.menuNode.style.position = 'absolute';
  this.menuNode.style.top  = (pos.y + rect.height) + "px";
  this.menuNode.style.left = pos.x + "px"; ;
};

Menu.prototype.close = function (force) {
  if (force || (!this.hasHover && !this.hasFocus))
    this.menuNode.style.display = 'none';
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
