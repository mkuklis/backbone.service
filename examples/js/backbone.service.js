(function (factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('backbone'));
  } else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  } else {
    factory(_, Backbone);
  }
})(function (_, Backbone) {

  "use strict";

  function Service(options) {
    this.options = options || {};
    this.targets = parseTargets(this.options.targets || {});
    _(this.targets).each(this.createMethod, this);
  }

  Service.prototype.createMethod = function (target) {
    var promise, method;

    this[target.name] = function (data, options) {
      promise = new Promise(this);
      options = this.createOptions(promise, target, data, options);
      method = methodMap[target.method.toUpperCase()];
      Backbone.sync(method, this, options);

      return promise;
    }
  }

  Service.prototype.createOptions = function (promise, target, data, options) {
    var self = this;
    var url = _.result(this.options, 'url') + evaluate(target.path, data);

    options || (options = {});

    return _.extend({
      url: url,
      data: data,
      success: function (resp, status, xhr) {
        options.success && options.success.call(self, resp);
        promise.resolve(resp);
      },
      error: function (xhr, status, error) {
        options.error && options.error.apply(self, [error, xhr]);
        promise.reject(error, xhr);
      }
    }, options);
  };

  var methodMap = {
    'POST':   'create',
    'PUT':    'update',
    'DELETE': 'delete',
    'GET':    'read'
  };

  function parseTargets(targets) {
    var target;

    return _(targets).map(function (props, name) {
      target = { name: name, path: props, method: "GET" };

      if (_.isArray(props)) {
        _.extend(target, { path: props[0], method: props[1] });
      }

      return target;
    });
  }

  function evaluate(template, data) {
    var mapped = [];
    var result = template.replace(/\{([^{}]*)\}/g, function (ignore, key) {
      if (key in data) {
        mapped.push(key);
        return data[key];
      }
      return key;
    });

    _(mapped).each(function (key) {
      delete data[key];
    });

    return result;
  }

  _.extend(Service.prototype, Backbone.Events);
  Backbone.Service = Service;

  // simple promise implementation
  function Promise(context) {
    this.context = context || this;
    this.success = [];
    this.error = [];
  }

  Promise.prototype = {
    constructor: Promise,

    then: function (success, error) {
      if (success) {
        if (this.resolved) {
          success.apply(this.context, this.resolved);
        }
        else {
          this.success.push(success);
        }
      }

      if (error) {
        if (this.rejected) {
          error.apply(this.context, this.rejected);
        }
        else {
          this.error.push(error);
        }
      }

      return this;
    },

    resolve: function () {
      var callback;

      this.resolved = arguments;
      this.error = [];

      while (callback = this.success.shift()) {
        callback.apply(this.context, this.resolved);
      }
    },

    reject: function () {
      var callback;

      this.rejected = arguments;
      this.success = [];

      while (callback = this.error.shift()) {
        callback.apply(this.context, this.rejected);
      }
    }
  };
})
//(Backbone);
