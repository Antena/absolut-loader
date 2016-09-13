# absolut-loader

Webpack loader (inpired by [baggage-loader](https://github.com/deepsweet/baggage-loader)), to be used as a pre-loader in conjunction with [ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader).

## What's ngtemplate-loader for?

[ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader) pre-loads the AngularJS template cache with required template files (i.e. `require('./some-template.html')`). This loader forces you to add those requires outside angular code definition, because otherwise, those requires would only be evaluated after angular bootstraps, which is too late.

See [Beware of requiring from the directive definition](https://github.com/WearyMonkey/ngtemplate-loader#beware-of-requiring-from-the-directive-definition).

## What's baggage-loader for?

This is where baggage-loader comes in: it runs as a pre-loader, and runs a first pass on your angular code.
The objective is to allow you to put your requires inside your angular code, by finding these and then preprending your source code with the same require.

The problem with `baggage-loader`, is that it takes the file path as a configuration for injecting.

For example:

```javascript
preLoaders: [ {
    test: /\/components\/.+script\.js$/,
    // baggage?file=var&file-without-var&…
    loader: 'baggage?template.html'
} ]
```
This would run on script.js files, and inject a require for template.html on top of that file.
It also allows you to define that file name based on the test file dir or file name (using `[dir]`, `[Dir]`, `[file]` and `[File]`).

The problem with this approach is that it forces you to name your html files in a certain way, either with a fixed name, based on dir or js file, or a combination of both.

This means it becomes unusable in some scenarios, and also, if you were to rename your template files, changing the require() inside your angular code wouldn't be enough.
Moreover, you would be injecting requires for files that you are not actually requiring from within your js file.

For example, given the following file structure:

```
components/
├── component-1/
│   ├── component-1-directive.js
│   └── component-1.html
├── component-2/
│   ├── component-2-directive.js
│   ├── component-2-controller.js
│   └── component-2.html
└── component-3/
    ├── component-3-controller.js
    ├── component-3-utils.js    
    ├── component-3-variation1-directive.js
    ├── component-3-variation1.html
    ├── component-3-variation2-directive.js
    └── component-3-variation2.html
```

Where component #3 has two flavours/variations which share a controller and some utility code, but have different directive definitions and different templates.

And the following `webpack.config.js`

```javascript
preLoaders: [
    {
        test: /components\/(.*)\.js/,
        loader: 'baggage?[dir].html'
    }
],
```
You would target most html files, except for this one, which would not be possible to target in a generic way: 
```
components/component-3/component-3-variation1.html
```

## Why absolut-loader?

This is where `absolut-loader` comes into play:

This pre-loader will look into the actual source of the specified js files, and look for the following pattern:

```javascript
require('./[something].html')
```

and *check if that file actually exists in that directory*. If so, it continues to prepend the js source with require just as baggage-loader does.

### Note
This loader does not currently support varible assignation or source maps, as `baggage-loader` does. 

### Full example

Given the same file structure as the example above, you add a pre-loader that targets all js files within components directory, but without passing any query params to `absolut`:

```javascript
preLoaders: [
    {
        test: /components\/(.*)\.js/,
        loader: 'absolut'
    }
],
```

Let's say the contents for `component-3-variation1-directive.js` are the following:

```javascript
'use strict';

// @ngInject
module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			config: '='
		},
		templateUrl: require('./component-3-variation1.html'),
		controller: 'Component3Controller'
	};
};

```
The pre-loader will check that a file `component-3-variation1.html` exists in that same directory, and if so, the following will be injected at the very beginning of the file:

```javascript
/* Injected by absolut-loader */
require('./component-3-variation1.html');
```

This will be then picked by `ngannotate-loader` in the next phase, which registers its contents in angular's templateCache, using the file's full path as a key, so to avoid possible collisions within a function, and replaces the original require by this function.

```javascript
/* Injected by absolut-loader */
	__webpack_require__(113);
```

```javascript
/* 113 */
/***/ function(module, exports) {

	var path = 'components/component-3/component-3-variation1.html';
	var html = "<div>\n    Hello World\n</div>";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
```
