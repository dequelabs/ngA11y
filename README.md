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
