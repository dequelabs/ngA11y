ngA11y
======

Angular accessibility module


## Usage

You must have a dependency on the 'ngA11y' module. The easiest way to get this is to declare the dependency for your entire application. E.g.

```
var app = angular.module('myApp', ['ngA11y']);
```

Then simply include the specific portions of the module that you want to use. For example, to use the focus management feature, include 'nga11yfocus.js' in your application's HTML file.

```
<script src="/pathtolibs/nga11yfocus.js" type="text/javascript"></script>
```

### Accessibility Focus Management Directive

When Angular.js replaces a portion of content in the HTML page with another piece of content and the piece of content that was replaced had the keyboard focus, then that focus will be lost and sent to the top of the document, leading to redundant navigation by keyboard-only users, disorientation, or worse - unless some action is taken. This will occur when using the router, regardless of whether your content contains focusable content because screen readers can set their reading cursor to any location in the DOM.

The 'nga11y-focus' directive can be used to tell Angular.js which element should receive focus when content is replaced that leads to focus being lost.

To enable this functionality, place the 'nga11y-focus' attribute on an element that is keyboard focusable (either by default, or through application of a tabindex attribute).

####Example

```
...
<input type="button" value="Will Receive Focus" nga11y-focus></input>
...
```

### Accessible Form Validation

Typical AngularJs examples for form validation take advantage of the data binding capabilities of the
framework and have validation error messages that dynamically change as the user is entering data into
fields, coupled with other techniques like greying out submit buttons when the form is invalid.  This can be confusing to screen reader users who do not get these announced to them.  Also when a form is
submitted with validation errors, focus should be set on the first invalid input, making it easier for
keyboard only users to locate the field they should correct.

The nga11y module provides two directives to assist with form validation 'nga11y-form' and
'nga11y-announce'

### nga11y-form

The 'nga11y-form' attribute directive binds a handler to the submit event of a form.  In the situation
where the form is invalid, it will set focus to the first invalid element of the form.

Example:

```
...
<form nga11y-form name="myForm" ... >
...
```

### nga11y-announce

The 'nga11y-announce' attribute will announce validation messages after a pause in typing or on the
blur event of an input.  It has an associated attribute 'nga11y-announce-invalid' which requires the id
of an element on the page that contains a validation error message.  It assumes that AngularJs is being
used to show or hide this element (e.g. using an ng-show attribute), and will announce the text of
the message when the message is not hidden.

Example:

```
...
<input id="firstName" name="firstName type="text" ... nga11y-announce nga11y-announce-invalid="errorMessage" ...>
...
<span id="errorMessage" ng-show="theForm.firstName.$invaid">Requires a first name</span>
...
```

### Accessible Modal Dialog Directives

Accessibility best practice recommends that when a modal dialog is shown, that the entire container
of the dialog should receive focus, and that the user when pressing tab and shift-tab will expect
focus to be captured within the modal, and elements outside of the dialog should not receive
focus.  Clicking on a closing element, or pressing the Escape key should close the dialog.

The nga11y library provides two directives to assist with this, the 'nga11y-modal' and 'nga11y-modal-closer' directives.

#### nga11y-modal

This is an atttribute that should be placed on an element that contains the contents of the modal.  It is the element that will be given focus when the modal is shown, and focus will only be
given to natively focusable elements within this container until the modal is dismissed.

Example:

```
...
<div nga11y-modal class="modal-content">
...
```

#### nga11y-modal-closer

This is an attribute that should be placed on an element in the modal that is responsible for
closing / cancelling the modal.  This element should be the one that on receiving a 'click' event
closes the modal normally.

Example:

```
...
<button nga11y-modal-closer>Close</button>
...
```

### Accessible Announcement Service

The a11yAnnounce Angular.js service supplies two functions for use by the Angular application - politeAnnounce and assertiveAnnounce. politeAnnounce will announce using aria-live="polite" and assertiveAnnounce will announce using aria-live="assertive".

To use it, simply inject the 'nga11yAnnounce' service into your code and call one of the two functions when updates occur.

#### Example

```
module.directive('myDirective', ['nga11yAnnounce', function (nga11yAnnounce) {
	...
	a11yAnnounce.politeAnnounce('an update ocurred');
	...
}]);
```
