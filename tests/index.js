var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    superagent = require('superagent'),
    chai = require('chai'),
    mocha = require('mocha'),
    expect = chai.expect;

describe('server', function () {
    before(function () {
        boot();
    });
})

describe('index', function () {
    it('should respond to GET', function (done) {
        superagent
            .get('http://localhost:'+port)
            .end(function(res) {
                expect(res.status.to.equal(200));
                done();
            });
    });
});
after(function() {
    shutdown;
});