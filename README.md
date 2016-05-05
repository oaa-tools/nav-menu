## nav-menu
Examples that utilize `Menu` and `MenuButton` components with ARIA and keyboard support.

### Notes & Questions

#### `Menu`

* Calls to `setFocusToButton` are made independently of, and prior to, calls to the `close` method.
* Code in `keydown` handler for `SPACE/RETURN` relies on the click handler `handleClick` to call the `setFocusToButton` and `close` methods in order to avoid duplication of method calls.
* Renamed `previousItem` and `nextItem` to `setFocusToPreviousItem` and `setFocusToNextItem` to show their relationship to other `setFocus` methods.

#### `MenuButton`

* The property `isLink` (see constructor) is unused: what was its original purpose?
* In the `keydown` handler, removed handling for `TAB`, which does not appear to need special handling.
* Eliminated `openMenu` and `closeMenu` methods; replaced with calls to `Menu` methods `open` and `close`.
* Renamed methods `moveFocusToFirstMenuItem` and `moveFocusToLastMenuItem` to `setFocusToFirstItem` and `setFocusToLastItem` respectively, and moved them to the `Menu` object.

### Conventions Adopted

* Use `var that = this;` whenever alternate `this` reference is needed.
* Comments: line breaks, indent four spaces, `@param` name on separate lines
