const request = require("supertest");
const app = require("../build/server");

describe("react-boilerplate", () => {
  it("main page", function(done) {
    this.timeout(100000);
    request(app).get('/').expect(200, done);
  });
});
