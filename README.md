Backbone.Service
================
[![build status](https://secure.travis-ci.org/mkuklis/backbone.service.png)](http://travis-ci.org/mkuklis/backbone.service)

Backbone.Service aims to help with the cases when restul API is not an option.

## Install

````javascript
<script src="backbone.service.js"></script>
````

## Usage

You can use backbone.service as a standalone object or extend backbone model or collection.

````javascript

// define server targets / endpoints
var targets = {
  login: ["/login", "post"],
  signup: ["/signup", "post"],
  logout: ["/logout", "get"],
  search: "/search" // defaults to get
  resetPassword: ["/resetpassword", "post"],
  updateSettings: ["/updateSettings", "post"]
};

// standalone service
var service = new Backbone.Service({ url: "http://localhost:5000", targets: targets });

// extend backbone model
var User = Backbone.Model.extend(service);

````

Each target passed to Backbone.Service becomes a method on the model or collection.

User model has now access to new methods: `login`, `signup`, `logout`, `search`, `resetPassword`, `updateSettings`.
Each new method takes two arguments: `data` and `options`.

You can use it like this:

````javascript

var user = new User();
user.login({ username: 'bob', password: 'secret' });

````

## Promises / Callbacks

Backbone.service comes with a simple implementation of promises. You can use them like this:

````javascript

user.updateSettings(settings).then(function (res) {
  // do something after successful update
}, function (err, res) {
  // do something in case of an error
});


````

Callbacks are still supported. You can pass them as a second argument in your calls:

````javascript
user.updateSettings(settings, {
  success: function (res) {
    // do something after successful update
  },
  error: function (err, res) {
    // do something in case of an error
  }
});

````

##License:
<pre>
(The MIT License)

Copyright (c) 2012 Michal Kuklis

</pre>
