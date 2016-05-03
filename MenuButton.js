var MenuButton = function (node) {
  // Check whether node is a DOM element
  if (!node instanceof Element)
    throw new TypeError("MenuButton constructor argument 'node' is not a DOM Element.");

  this.buttonNode = node;
  this.menuNode = null;
  this.menuHasFocus = false;
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
    if (this.menuNode) {
      this.menu = new Menu(this.menuNode).init();
    }
  }

  this.buttonNode.addEventListener('keydown', function (event) {
    menuButton.handleKeydown(event);
  });

  this.buttonNode.addEventListener('click', function (event) {
    menuButton.handleClick(event);
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
  if (this.menuNode) {
    var pos = aria.Utils.findPos(this.buttonNode);
    var br = this.buttonNode.getBoundingClientRect();

    this.menuNode.style.display = 'block';
    this.menuNode.style.position = 'absolute';
    this.menuNode.style.top  = (pos.y + br.height) + "px";
    this.menuNode.style.left = pos.x + "px"; ;
  }
};

MenuButton.prototype.closeMenu = function (force, focus_menu_button) {
  if (typeof force !== 'boolean') force = false;
  if (typeof focus_menu_button !== 'boolean') focus_menu_button = true;

  if (force || (!this.mouseInMenuButton &&
    !this.menu.mouseInMenu &&
    !this.menu.menuHasFocus &&
    this.menuNode)) {
      this.menuNode.style.display = 'none';
      if (focus_menu_button) this.buttonNode.focus();
  }
};

MenuButton.prototype.toggleMenu = function () {
  if (this.menuNode) {
    if (this.menuNode.style.display === 'block') this.menuNode.style.display = 'none';
    else this.menuNode.style.display = 'block';
  }
};
