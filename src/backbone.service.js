(function (Backbone) {

  "use strict";

  function Service(options) {
    this.options = options || {};
    this.ctx = options.context || this;
    this.endpoints = parseEndpoints(options.endpoints);
    _(this.endpoints).each(this.createMethod, this);
  }

  Service.prototype.createMethod = function (endpoint) {
    this[endpoint.name] = function (data, options) {
      var promise = new Promise(this.ctx);
      options = _.extend(this.createOptions(promise, endpoint), options);
      Backbone.sync(endpoint.method, data, options);
      return promise;
    }
  }

  Service.prototype.createOptions = function (promise, endpoint) {
    return {
      url: this.options.url + endpoint.path,
      success: function (resp, status, xhr) {
        promise.resolve();
      },
      error: function () {
        promise.reject();
      }
    };
  };

  // helpers
  function parseEndpoints(endpoints) {
    return _(endpoints).map(function (props, name) {
      var endpoint = { name: name, path: props, method: "read" };
      if (_.isArray(props)) {
        _.extend(endpoint, { path: props[0], method: props[1] });
      }
      return endpoint;
    });
  }

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

})(Backbone);
