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

The 'a11yfocus' directive can be used to tell Angular.js which element should receive focus when content is replaced that leads to focus being lost.

To enable this functionality, place the 'a11yfocus', or 'ng-attr-a11yfocus' attribute on an element that is keyboard focusable (either by default, or through application of a tabindex attribute).

####Example

```
    ...
    <input type="button" value="Will Receive Focus" ng-attr-a11yfocus></input>
    ...
```

### Accessible Form Validation

Typical AngularJs examples for form validation take advantage of the data binding capabilities of the
framework and have validation error messages that dynamically change as the user is entering data into
fields, coupled with other techniques like greying out submit buttons.  This is not particularly
accessible.

The form validation directives make it easier to write accesible form validation, and contains two
directives 'blur-focus' and 'accessible-form'

### blur-focus

TODO: add more description

#### Example

```
    ....
    <input name="test" type="text" blur-focus/>
    ...
```

### accessible-form

TODO: add more description

### Accessible announcement service

The a11yAnnounce Angular.js service supplies two functions for use by the Angular application - politeAnnounce and assertiveAnnounce. politeAnnounce will announce using aria-live="polite" and assertiveAnnounce will announce using aria-live="assertive".

To use it, simply inject the 'a11yAnnounce' service into your code and call one of the two functions when updates occur.

#### Example

```
    module.directive('myDirective', ['a11yAnnounce', function (a11yAnnounce) {
    	...
    	a11yAnnounce.politeAnnounce('an update ocurred');
    	...
    }]);
```
