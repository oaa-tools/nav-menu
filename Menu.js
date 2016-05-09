/*
*   @constructor Menu
*
*   @desc
*       Object that encapsulates data and behavior (via event handlers)
*       of a custom HTML menu component.
*
*   @param menuNode
*       The DOM element node that serves as the menu container.
*       Each child element of menuNode that represents a menuitem
*       must have its role attribute set to 'menuitem'.
*
*   @param menuButton
*       The MenuButton object associated with this menu. See MenuButton.js
*       for its description.
*/
var Menu = function (menuNode, menuButton) {
  // Check whether menuNode is a DOM element
  if (!menuNode instanceof Element)
    throw new TypeError("Menu constructor argument 'menuNode' is not a DOM Element.");

  // Check whether menu has child elements
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
*   @desc
*       Add menuNode event listeners for mouseover and mouseout.
*       Set firstItem and lastItem to corresponding menuitems.
*       For each menuitem: set tabindex and add event listeners
*       for keydown, click, focus and blur events.
*/
Menu.prototype.init = function () {
  var menuitem, that = this;

  this.menuNode.addEventListener('mouseover', function (event) {
    that.handleMouseover(event);
  });

  this.menuNode.addEventListener('mouseout', function (event) {
    that.handleMouseout(event);
  });

  menuitem = this.menuNode.firstElementChild;

  while (menuitem) {
    if (menuitem.getAttribute('role')  === 'menuitem') {
      menuitem.tabIndex = -1;
      if (!this.firstItem) this.firstItem = menuitem;
      this.lastItem = menuitem;

      menuitem.addEventListener('keydown', function (event) {
        that.handleKeydown(event);
      });

      menuitem.addEventListener('click', function (event) {
        that.handleClick(event);
      });

      menuitem.addEventListener('focus', function (event) {
        that.handleFocus(event);
      });

      menuitem.addEventListener('blur', function (event) {
        that.handleBlur(event);
      });
    }
    menuitem = menuitem.nextElementSibling;
  }
};

/* EVENT HANDLERS FOR MENU ITEMS */

Menu.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      // Create simulated mouse event to mimic the behavior of ATs
      // and let the event handler handleClick do the housekeeping.
      try {
        clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
      }
      catch(err) {
        if (document.createEvent) {
          // DOM Level 3 for IE 9+
          clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent('click', true, true);
        }
      }
      tgt.dispatchEvent(clickEvent);
      flag = true;
      break;

    case this.keyCode.ESC:
      this.setFocusToButton();
      this.close(true);
      flag = true;
      break;

    case this.keyCode.UP:
      this.setFocusToPreviousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.setFocusToNextItem(tgt);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.setFocusToButton();
      this.close(true);
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
  this.setFocusToButton();
  this.close(true);
};

Menu.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

Menu.prototype.handleBlur = function (event) {
  var that = this;
  this.hasFocus = false;
  setTimeout(function () { that.close(false) }, 300);
};

/* EVENT HANDLERS FOR MENU CONTAINER */

Menu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

Menu.prototype.handleMouseout = function (event) {
  var that = this;
  this.hasHover = false;
  setTimeout(function () { that.close(false) }, 300);
};

/* ADDITIONAL METHODS */

Menu.prototype.setFocusToButton = function () {
  this.menuButton.buttonNode.focus();
};

Menu.prototype.setFocusToPreviousItem = function (currentItem) {
  var menuitem = currentItem.previousElementSibling;

  while (menuitem) {
    if (menuitem.getAttribute('role')  === 'menuitem') {
      menuitem.focus();
      break;
    }
    menuitem = menuitem.previousElementSibling;
  }

  if (!menuitem && this.lastItem) {
    this.lastItem.focus();
  }
};

Menu.prototype.setFocusToNextItem = function (currentItem) {
  var menuitem = currentItem.nextElementSibling;

  while (menuitem) {
    if (menuitem.getAttribute('role')  === 'menuitem') {
      menuitem.focus();
      break;
    }
    menuitem = menuitem.nextElementSibling;
  }

  if (!menuitem && this.firstItem) {
    this.firstItem.focus();
  }
};

Menu.prototype.setFocusToFirstItem = function () {
  if (this.firstItem) this.firstItem.focus();
};

Menu.prototype.setFocusToLastItem = function () {
  if (this.lastItem) this.lastItem.focus();
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
  if (force || (!this.hasFocus && !this.hasHover && !this.menuButton.hasHover)) {
    this.menuNode.style.display = 'none';
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
