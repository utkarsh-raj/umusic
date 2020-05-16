var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var request = require("request");
var app = require("../app");
var expect = chai.expect;

describe("smoke test", function() {
  it("checks equality", function() {
    expect(true).to.be.true;
  });
});

describe("server test", function() {
	it("should return a string", function() {
		chai.request(app)
			.get("/test")
			.end(function(err, res) {
				expect(res.text).to.equal("The server is up!");
			});
	})
});