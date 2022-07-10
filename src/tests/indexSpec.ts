import supertest from "supertest";
import app from "..";

// create a request object

const request = supertest(app);

describe("Testing the root route", () => {
  it("should return hello world", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});
