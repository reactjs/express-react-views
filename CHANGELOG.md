# v0.10.5 (2018-01-15)

* Switch from babel-preset-es2015 to babel-preset-env


# v0.10.4 (2017-10-13)

* Fixed bug preventing the use of arrays for the Express views setting


# v0.10.3 (2017-10-13)

* Added support for React 16
* Upgrade package dependencies


# v0.10.2 (2016-05-27)

* Fix bug preventing view cache from being cleared in some cases


# v0.10.1 (2016-04-14)

* Add React v15 to peerDependencies


# v0.10.0 (2016-02-08)

* Update to Babel v6, using `react` and `es2015` presets by default
* Clear view module cache on render errors so the server doesn't need to be restarted


# v0.9.0 (2015-10-08)

* Update to React v0.14, drop support for React v0.12-0.13
* Update other package dependencies.

# v0.8.2 (2015-07-27)

* Add new `transformViews` option to make it possible to disable Babel


# v0.8.1 (2015-05-28)

* Fix bug where views weren't getting compiled on Windows


# v0.8 (2015-05-10)

* Switch to Babel for compile pipeline

# v0.7.2 (2015-04-06)

* Update dependency to work with React v0.12 *and* v0.13


# v0.7.1 (2015-02-04)

* Fix bug when calling createEngine without arguments


# v0.7.0 (2015-01-07)

* Add support for `stripTypes` option
* Use `object-assign` instead of `lodash.merge`
* Update js-beautify


# v0.6.0 (2014-11-05)

* Update to React v0.12.


# v0.5.1 (2014-10-20)

* Support common pattern of ES6 module transpilers where the component would actually be exported to `default`, not directly.


# v0.5 (2014-08-14)

* Move React to `peerDependencies`
* Stop beautifying code without permission. There is now an option to do this.


# v0.4 (2014-07-26)

* Update React dependency to v0.11.1+


# v0.3 (2014-07-04)

* The module cache is cleared of files matching the specified extension at the end of each render. This allows views to be modified without restarting the server.


# v0.2 (2014-04-05)

* `__express` and `renderFile` are gone. You must now call `createEngine(options)` which will create an engine with given options.


# v0.1 (2014-03-31)

* Initial release!
