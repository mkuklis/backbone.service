backbone.service
================
[![build status](https://secure.travis-ci.org/mkuklis/backbone.service.js.png)](http://travis-ci.org/mkuklis/backbone.service.js)

Sometimes you run into situations when restful API is not an option. Backbone.service is trying to solve this for you.

## Install

````javascript
<script src="backbone.service.js"></script>
````

## Usage

You can use backbone.service.js as a standalone object or extend backbone model or collection.

````javascript

// server targets
 var targets = {
   login: ["/login", "post"],
   signup: ["/signup", "post"],
   logout: ["/logout", "get"],
   search: ["/search", "get"],
   resetPassword: ["/resetpassword", "post"],
   updateSettings: ["/updateSettings", "post"]
 };

// standalone service

var service = new Backbone.Service({ url: "http://localhost:5000", targets: targets }));

// extend backbone model

var User = Backbone.Model.extend(service);

````

User model has now access to new methods: `login`, `signup`, `logout`, `search`, `resetPassword`, `updateSettings`.
You can use it like this:

````javascript

var user = new User();
user.login({ username: 'bob', password: 'secret' });

````

## Promises

Backbone.service comes with a simple implementation of promises. You can use them like this:

````javascript

user.updateSettings(settings).then(function (res) {
  // do something after successful update
}, function (err, response) {
  // do something in case of an error
});


````

Callbacks are still supported. You can pass them as a second argument in your calls:

````javascript
user.updateSettings(settings, { success: function (res) {}, error: function (res) {} });

````

##License:
<pre>
(The MIT License)

Copyright (c) 2012 Michal Kuklis

</pre>
