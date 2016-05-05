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
* Removed `focus` and `blur` event handling, which appears to be unneeded for the button.
* Eliminated `openMenu` and `closeMenu` methods; replaced with calls to `Menu` methods `open` and `close`.
* Renamed methods `moveFocusToFirstMenuItem` and `moveFocusToLastMenuItem` to `setFocusToFirstItem` and `setFocusToLastItem` respectively, and moved them to the `Menu` object.

### Lessons Learned

* If you set `display: none` on an element and that element or one of its contained descendants has focus, when the element and/or its descendants become no longer visible, the browser will, by default, set focus to the first focusable element on the page. To avoid this, set the focus to its target destination (if one exists) before setting `display: none`.

### Conventions Adopted

* Use `var that = this;` whenever alternate `this` reference is needed.
* Comments: use blank line as separator, indent four spaces, `@param` name on separate lines

### User Actions and System Responses

#### Mouse Events

* `Menu`: handle `mouseover` and `mouseout` for `menuNode` element
* `MenuButton`: handle `mouseover` and `mouseout` for `buttonNode` element

#### Keyboard Events

* `Menu`: handle `keydown`: `SPACE/RETURN`, `ESC`, `UP`, `DOWN`, `HOME/PAGEUP`, `END/PAGEDOWN`, `TAB` for menu item elements
* `MenuButton`: handle `keydown`: `SPACE/RETURN`, `UP`, `DOWN` for `buttonNode` element

#### Focus Events

* `Menu`: handle `focus` and `blur` for menu item elements

#### Focus Management

* `Menu`: explicit calls to `buttonNode.focus()` before closing menu
* `MenuButton`: explicit calls to menu item `setFocus` methods
