# nav-menu
Examples that utilize Menu and MenuButton components with ARIA and keyboard support.

## Notes & Questions

### Menu

* Calls to setFocusToButton are made independently of, and prior to, calls to the close method.
* Code in keydown handler for SPACE/RETURN, since it creates and dispatches a 'click' event, relies on the click handler (handleClick) to call the setFocusToButton and close methods in order to avoid duplication of method calls.
* Renamed previousItem and nextItem to setFocusToPreviousItem and setFocusToNextItem to show their relationship to other setFocus methods.

### MenuButton

* The property isLink (see constructor) is unused: what was its original purpose?
* In keydown handler, removed handling for TAB, which don't appear to need special handling.
* Eliminated openMenu and closeMenu methods
* Moved and renamed moveFocusToFirstMenuItem and moveFocusToLastMenuItem to the Menu object.

### Conventions

* Use 'var that = this' whenever alternate 'this' reference is needed.
* Comments: line breaks, indent four spaces, @param name on separate lines
