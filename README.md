# express-react-views

This is an [Express][express] view engine which renders [React][react] components on server. It renders static markup and *does not* support mounting those views on the client.

This is intended to be used as a replacement for existing server-side view solutions, like [jade][jade], [ejs][ejs], or [handlebars][hbs].


## Usage

```sh
npm install express-react-views react react-dom
```

**Note:** You must explicitly install `react` as a dependency. Starting in v0.5, `react` is a peer dependency here. This is to avoid issues that may come when using incompatible versions.

### Add it to your app.

```js
// app.js

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
```

### Options

Beginning with v0.2, you can now pass options in when creating your engine.

option | values | default
-------|--------|--------
`doctype` | any string that can be used as [a doctype](http://en.wikipedia.org/wiki/Document_type_declaration), this will be prepended to your document | `"<!DOCTYPE html>"`
`beautify` | `true`: beautify markup before outputting (note, this can affect rendering due to additional whitespace) | `false`
`transformViews` | `true`: use `babel` to apply JSX, ESNext transforms to views.<br>**Note:** if already using `babel-register` in your project, you should set this to `false` | `true`
`babel` | any object containing valid Babel options<br>**Note:** does not merge with defaults | `{presets: ['react', 'es2015']}`

The defaults are sane, but just in case you want to change something, here's how it would look:

```js
var options = { beautify: true };
app.engine('jsx', require('express-react-views').createEngine(options));
```


### Views

Under the hood, [Babel][babel] is used to compile your views into ES5 friendly code, using the [react][babel-preset-react] and [es2015][babel-preset-es2015] presets by default. Only the files in your `views` directory (i.e. `app.set('views', __dirname + '/views')`) will be compiled.

Your views should be node modules that export a React component. Let's assume you have this file in `views/index.jsx`:

```js
var React = require('react');

class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

module.exports = HelloMessage;
```

### Routes

Your routes would look identical to the default routes Express gives you out of the box.

```js
// app.js

app.get('/', require('./routes').index);
```

```js
// routes/index.js

exports.index = function(req, res){
  res.render('index', { name: 'John' });
};
```

**That's it!** Layouts follow really naturally from the idea of composition.

### Layouts

Simply pass the relevant props to a layout component.

`views/layouts/default.jsx`:
```js
var React = require('react');

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head><title>{this.props.title}</title></head>
        <body>{this.props.children}</body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
```

`views/index.jsx`:
```js
var React = require('react');
var DefaultLayout = require('./layouts/default');

class HelloMessage extends React.Component {
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hello {this.props.name}</div>
      </DefaultLayout>
    );
  }
}

module.exports = HelloMessage;
```


## Questions

### What about partials & includes?

These ideas don't really apply. But since they are familiar ideas to people coming from more traditional "templating" solutions, let's address it. Most of these can be solved by packaging up another component that encapsulates that piece of functionality.

### What about view helpers?

I know you're used to registering helpers with your view helper (`hbs.registerHelper('something', ...))`) and operating on strings. But you don't need to do that here.

* Many helpers can be turned into components. Then you can just require and use them in your view.
* You have access to everything else in JS. If you want to do some date formatting, you can `require('moment')` and use directly in your view. You can bundle up other helpers as you please.

### Where does my data come from?

All "locals" are exposed to your view in `this.props`. These should work identically to other view engines, with the exception of how they are exposed. Using `this.props` follows the pattern of passing data into a React component, which is why we do it that way. Remember, as with other engines, rendering is synchronous. If you have database access or other async operations, they should be done in your routes.


## Caveats

* I'm saying it again to avoid confusion: this does not do anything with React in the browser. This is *only* a solution for server-side rendering.
* This currently uses `require` to access your views. This means that contents are cached for the lifetime of the server process. You need to restart your server when making changes to your views. **In development, we clear your view files from the cache so you can simply refresh your browser to see changes.**
* React & JSX have their own rendering caveats. For example, inline `<script>`s and `<style>`s will need to use `dangerouslySetInnerHTML={{__html: 'script content'}}`. You can take advantage of ES6 template strings here.

```js
<script dangerouslySetInnerHTML={{__html: `
  // google analytics
  // is a common use
`}} />
```

* It's not possible to specify a doctype in JSX. You can override the default HTML5 doctype in the options.

[express]: http://expressjs.com/
[react]: http://facebook.github.io/react/
[jade]: http://jade-lang.com/
[ejs]: http://embeddedjs.com/
[hbs]: https://github.com/barc/express-hbs
[babel]: https://babeljs.io/
[babel-preset-react]: https://babeljs.io/docs/plugins/preset-react/
[babel-preset-es2015]: https://babeljs.io/docs/plugins/preset-es2015/
