import request from "supertest";

import app from "../build/server";

// eslint-disable-next-line no-undef
describe("react-boilerplate", () => {
  // eslint-disable-next-line no-undef
  it("main page", done => {
    request(app).get("/").expect(200, done);
  });
  // eslint-disable-next-line no-undef
  it("display 404", done => {
    request(app).get("/no_such_path").expect(404, done);
  });
});
