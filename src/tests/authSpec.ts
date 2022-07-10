import client from "../database";
import { User, UserStore } from "../models/user";
import bcrypt from "bcrypt";

const userTest = new UserStore();
const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;
const wrongName: string = "Wong Name";
const wrongPass: string = "Wong Password";

describe("Authentication Module", () => {
  describe("test methods existance", () => {
    it("should has authentication method", () => {
      expect(userTest.authenticate).toBeDefined();
    });
  });

  describe("Test authentication logic", () => {
    const user: User = {
      firstname: "Mahmoud",
      lastname: "Mamdouh",
      password: "p@$$w0rd",
      role: "user",
    };

    beforeAll(async () => {
      const createdUserID = await userTest.create(
        user.firstname,
        user.lastname,
        user.password
      );
    });

    afterAll(async () => {
      const conn = await client.connect();
      const sql = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
      await conn.query(sql);
      conn.release();
    });

    it("authenticate method should return the authenticated user", async () => {
      const userAuth = await userTest.authenticate(
        user.firstname,
        user.lastname,
        user.password
      );

      expect(userAuth?.firstname).toBe(user.firstname);
      expect(userAuth?.lastname).toBe(user.lastname);
      expect(userAuth?.role).toBe(user.role);
      expect(
        bcrypt.compareSync(user.password + pepper, userAuth?.password as string)
      ).toEqual(true);
    });

    it(" invalid authenticate method should return null", async () => {
      const userAuth = await userTest.authenticate(
        wrongName,
        wrongName,
        wrongPass
      );
      expect(userAuth).toBe(null);
    });
  });
});
