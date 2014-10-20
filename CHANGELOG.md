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
