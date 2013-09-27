describe('backbone.service', function () {

  beforeEach(function () {
    this.options = {
      url: "http://localhost",
      targets: {
        ping: '/ping',
        login: ['/login', 'post']
      }
    };
  });

  describe('Service', function () {
    it("should assign options", function () {
      var service = new Backbone.Service(this.options);
      expect(service.options).to.be.an('object');
    });

    it("should assign targets", function () {
      var service = new Backbone.Service(this.options);
      expect(service.targets).to.be.an('array');
      expect(service.targets[0].method).to.equal('GET');
      expect(service.targets[1].method).to.equal('post');
    });

    it("should create methods", function () {
      var service = new Backbone.Service(this.options);
      expect(service.ping).to.be.an('function');
      expect(service.login).to.be.an('function');
    });

    describe('#createMethod', function () {
      it("should create a new methods based on targets", function () {
        var service = new Backbone.Service();
        service.createMethod({ name: 'ping', url: '/ping' });
        expect(service.ping).to.be.a('function');
      });
    });

    describe('#createOptions', function () {
      it("should create options", function () {
        var service = new Backbone.Service(this.options);
        var options = service.createOptions(null, { path: '/ping' }, { param: true });
        expect(options.url).to.equal(this.options.url + '/ping');
        expect(options.success).to.be.a('function');
        expect(options.error).to.be.a('function');
        expect(options.data.param).to.equal(true);
      });

      it("should accept url function", function() {
        this.options.url = function() {
          return 'http://localhost';
        };
        
        var service = new Backbone.Service(this.options);
        var options = service.createOptions(null, { path: '/ping' });
        expect(options.url).to.equal('http://localhost/ping');
      });
    });

    describe("new target methods", function () {
      beforeEach(function () {
        var contentType = { "Content-Type": "application/json" };
        this.server = sinon.fakeServer.create();
        this.success = [200, contentType, JSON.stringify({ success: true })];
        this.error   = [404, contentType, JSON.stringify({ error: true })];
        this.service = new Backbone.Service(this.options);
      });

      afterEach(function () {
        this.server.restore();
      });

      it("should evaluate variables in url", function() {
        this.options.targets.test = '/test/{x}/{y}/{x}';
        this.service = new Backbone.Service(this.options);
        this.service.test({ x: 'X', y: 'Y', z: 'Z' });
        var request = this.server.requests[0];
        expect(request.url).to.equal('http://localhost/test/X/Y/X?z=Z');
      });

      it("should respond with success via then", function () {
        var callback = sinon.spy();
        this.server.respondWith('POST',  this.options.url + '/login', this.success);
        this.service.login({ username: 'bob', password: 'secret' }).then(callback);
        this.server.respond();
        expect(callback).to.have.been.calledWith({ success: true });
      });

      it("should respond with error via then", function () {
        var callback = sinon.spy();
        this.server.respondWith('POST',  this.options.url + '/login', this.error);
        this.service.login({ username: 'bob', password: 'secret' }).then(null, callback);
        this.server.respond();
        expect(callback).to.have.been.called
      });

      it("should respond with success via callback", function () {
        var callback = sinon.spy();
        this.server.respondWith('POST',  this.options.url + '/login', this.success);
        this.service.login({ username: 'bob', password: 'secret' }, { success: callback });
        this.server.respond();
        expect(callback).to.have.been.calledWith({ success: true });
      });

      it("should respond with error via callback", function () {
        var callback = sinon.spy();
        this.server.respondWith('POST',  this.options.url + '/login', this.error);
        this.service.login({ username: 'bob', password: 'secret' }, { error: callback });
        this.server.respond();
        expect(callback).to.have.been.called;
      });
   });
  });
});
