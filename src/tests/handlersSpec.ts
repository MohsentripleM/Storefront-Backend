import supertest from "supertest";
import app from "..";
import client from "../database";
import { User, UserStore } from "../models/user";

const request = supertest(app);

let userToken = "";
let adminToken = "";
let tempUserID: number;
let tempProductID: number;
let tempOrderID: number;
let createdUserID: number;
let createdAdminID: number;

const userTest = new UserStore();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;
const wrongName: string = "Wong Name";
const wrongPass: string = "Wong Password";

describe("Testing end point", () => {
  const user: User = {
    firstname: "user1name",
    lastname: "user2name",
    password: "p@$$w0rd",
    role: "user",
  };

  const admin: User = {
    firstname: "admin1name",
    lastname: "admin2name",
    password: "p@$$w0rd",
    role: "admin",
  };
  // creating admin user and normal user to test them
  beforeAll(async () => {
    const createdUser = await userTest.create(
      user.firstname,
      user.lastname,
      user.password
    );
    createdUserID = createdUser as number;
    const createdAdmin = await userTest.create(
      admin.firstname,
      admin.lastname,
      admin.password
    );
    createdAdminID = createdAdmin as number;

    const conn = await client.connect();
    const sql = `UPDATE users SET role='admin' WHERE firstname = 'admin1name' AND lastname='admin2name'`;
    await conn.query(sql);
    conn.release();
  });

  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
    await conn.query(sql);
    conn.release();
  });

  describe("Test all users routes", () => {
    it("should authenticate and get user token", async () => {
      const response = await request
        .post("/authentication")
        .set("Content-type", "application/json")
        .send({
          firstname: "user1name",
          lastname: "user2name",
          password: "p@$$w0rd",
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.firstname).toBe("user1name");
      expect(response.body.lastname).toBe("user2name");
      expect(response.body.role).toBe("user");
      userToken = response.body.token;
    });

    it("should authenticate and get admin token", async () => {
      const response = await request
        .post("/authentication")
        .set("Content-type", "application/json")
        .send({
          firstname: "admin1name",
          lastname: "admin2name",
          password: "p@$$w0rd",
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(2);
      expect(response.body.firstname).toBe("admin1name");
      expect(response.body.lastname).toBe("admin2name");
      expect(response.body.role).toBe("admin");

      adminToken = response.body.token;
    });

    it("should fail to authenticate", async () => {
      const response = await request
        .post("/authentication")
        .set("Content-type", "application/json")
        .send({
          firstname: wrongName,
          lastname: wrongName,
          password: wrongPass,
        });
      expect(response.status).toBe(400);
      expect(response.text).toBe("invalid login");
    });

    describe("Test all users routes", () => {
      it("should create user", async () => {
        const response = await request
          .post("/users")
          .set("Content-type", "application/json")
          .send({
            firstname: "user3",
            lastname: "user33",
            password: "p@$$w0rd",
          });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(3);
        expect(response.body.firstname).toBe("user3");
        expect(response.body.lastname).toBe("user33");
        expect(response.body.role).toBe("user");
        tempUserID = response.body.id;
      });
      it("should update user", async () => {
        const response = await request
          .patch("/users/1")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstname: "firstname update",
            lastname: "lastname update",
            role: "admin",
          });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.firstname).toBe("firstname update");
        expect(response.body.lastname).toBe("lastname update");
        expect(response.body.role).toBe("admin");
      });
      it("only admin should get all users", async () => {
        const response = await request
          .get("/users")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });

      it("user should not get all users", async () => {
        const response = await request
          .get("/users")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it("only admin should get user details", async () => {
        const response = await request
          .get("/users/1")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });

      it("user should not get user details", async () => {
        const response = await request
          .get("/users")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it("only admin should delete users", async () => {
        const response = await request
          .delete(`/users/${tempUserID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);
        expect(response.body.id).toBe(tempUserID);
        expect(response.status).toBe(200);
      });

      it("should not delete not found user", async () => {
        const response = await request
          .delete(`/users/${tempUserID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(404);
      });

      it("user should not delete users", async () => {
        const response = await request
          .delete("/users/2")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });
    });

    describe("Test all product routes", () => {
      it("only admin should create product", async () => {
        const response = await request
          .post("/products")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "product1",
            price: 500,
          });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product1");
        expect(response.body.price).toBe(500);
        tempProductID = response.body.id;
      });
      it(" should update product", async () => {
        const response = await request
          .patch(`/products/${tempProductID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "product new name",
            price: 9999,
          });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product new name");
        expect(response.body.price).toBe(9999);
        expect(response.body.id).toBe(tempProductID);
      });
      it("user should not create product", async () => {
        const response = await request
          .post("/products")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it("any one should get all productss", async () => {
        const response = await request
          .get("/products")
          .set("Content-type", "application/json");

        expect(response.status).toBe(200);
      });

      it("you should be user to get product details", async () => {
        const response = await request
          .get(`/products/${tempProductID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
      });

      it("only admin should delete a product", async () => {
        const response = await request
          .delete(`/products/${tempProductID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);
        expect(response.body.id).toBe(tempProductID);
        expect(response.body.name).toBe("product new name");
        expect(response.body.price).toBe(9999);

        expect(response.status).toBe(200);
      });

      it("should not delete not found product", async () => {
        const response = await request
          .delete("/products/100")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(404);
      });

      it("user should not delete products", async () => {
        const response = await request
          .delete(`/products/${tempProductID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });
    });

    describe("Test all order routes", () => {


      
      it("only user should create order", async () => {
        const response = await request
          .post("/orders")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            user_id: createdUserID,
            status: "ordered",
          });

        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(createdUserID);
        expect(response.body.status).toBe("ordered");
        tempOrderID = response.body.id;
      });
      it("only admin should update order status and user id", async () => {
        const response = await request
          .patch(`/orders/${tempOrderID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            user_id: createdUserID,
            status: "delivered",
          });

        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(createdUserID);
        expect(response.body.status).toBe("delivered");
      });
      it("user should not get all orders", async () => {
        const response = await request
          .get("/orders")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it("only admin should get all orders", async () => {
        const response = await request
          .get("/orders")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });

      it("only admin should get order details", async () => {
        const response = await request
          .get(`/orders/${tempOrderID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(createdUserID);
        expect(response.body.status).toBe("delivered");
      });

      it("only admin should delete an order", async () => {
        const response = await request
          .delete(`/orders/${tempOrderID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });

      it("should not delete not found order", async () => {
        const response = await request
          .delete("/orders/100")
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(404);
      });

      it("user should not delete orders", async () => {
        const response = await request
          .delete(`/orders/${tempOrderID}`)
          .set("Content-type", "application/json")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });
    });
  });
});
