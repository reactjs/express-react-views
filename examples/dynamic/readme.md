Dynamic react views example
===========================

This example is the todo list borrowed from the
[react.js main page](http://facebook.github.io/react/).
We render the application server-side using express-react-views.
An initial set of items has been added
to illustrate populating data from the server.


run it
------

    npm install
    npm start


How it works
------------

1. Separate the page into two templates,
   a [static container component](views/Html.js)
   and a [dynamic inner component](views/Content.js).

2. Use express-react-views to render and serve the container.
   Server-side data can be sent via view options.

3. Make your views available client-side as javascript.
   Here I created a [main](views/main.js) function for bootstrapping
   and packaged it up using [browserify](http://browserify.org/).

4. Initialize the client-side app into the dynamic component
   using the same data from the server-side.
   This example passes the initial data to the client
   as the argument of the main function.
   Be mindful of potential XSS vulnerabilities.
