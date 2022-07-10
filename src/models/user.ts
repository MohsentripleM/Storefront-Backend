// @ts-ignore
import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
  role?: string;
};

export class UserStore {
  async create(
    firstname: string,
    lastname: string,
    password: string
  ): Promise<number | null> {
    try {
      // @ts-ignore

      const sql =
        "INSERT INTO users (firstname,lastname,password) VALUES($1,$2,$3) RETURNING id";
      const sqlcheck =
        "SELECT* FROM users WHERE firstname = ($1) AND lastname=($2)";

      const hash = bcrypt.hashSync(
        password + pepper,
        parseInt(rounds as string)
      );
      const conn = await client.connect();
      const nameCheck = await conn.query(sqlcheck, [firstname, lastname]);
      if (!nameCheck.rowCount) {
        const result = await conn.query(sql, [firstname, lastname, hash]);
        conn.release();
        const userID = result.rows[0];

        return userID.id;
      }
      return null;
    } catch (err) {
      throw new Error(`unable create user (${firstname} ${lastname}): ${err}`);
    }
  }
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT id,firstname,lastname FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }
  async show(id: string): Promise<User> {
    try {
      const sql = "SELECT id,firstname,lastname,role FROM users WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user ${id}. Error: ${err}`);
    }
  }
  async update(
    id: number,
    firstname: string | undefined,
    lastname: string | undefined,
    role: string | undefined
  ): Promise<User> {
    try {
      let sql, result;
      const conn = await client.connect();

      if (
        firstname &&
        typeof firstname === "string" &&
        lastname &&
        typeof lastname === "string" &&
        role &&
        typeof role === "string"
      ) {
        sql =
          "UPDATE users SET firstname=$1 , lastname=$2 ,role=$3 WHERE id=$4 RETURNING*;";

        result = await conn.query(sql, [firstname, lastname, role, id]);
      } else if (
        firstname &&
        typeof firstname === "string" &&
        lastname &&
        typeof lastname === "string"
      ) {
        sql =
          "UPDATE users SET firstname =$1, lastname=$2 WHERE id=$3 RETURNING*;";

        result = await conn.query(sql, [firstname, lastname, id]);
      } else if (firstname && typeof firstname === "string") {
        sql = "UPDATE users SET firstname=$1 WHERE id=$2 RETURNING*;";

        result = await conn.query(sql, [firstname, id]);
      } else if (lastname && typeof lastname === "string") {
        sql = "UPDATE users SET lastname=$1 WHERE id=$2 RETURNING*;";

        result = await conn.query(sql, [lastname, id]);
      } else if (role && (role == "user" || "admin")) {
        sql = "UPDATE users SET role=$1 WHERE id=$2 RETURNING*;";

        result = await conn.query(sql, [role, id]);
      }
      conn.release();
      const UpdatedUser = result?.rows[0];
      return UpdatedUser as User;
    } catch (err) {
      throw new Error(` Error: ${err}`);
    }
  }

  async delete(id: number | undefined): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1) RETURNING id,firstname,lastname ";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const deletedUser: User = result.rows[0];

      conn.release();

      return deletedUser;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(
    firstname: string,
    lastname: string,
    password: string
  ): Promise<User | null> {
    try {
      const sql = "SELECT * FROM users WHERE firstname=($1) AND lastname=($2);";
      const conn = await client.connect();

      const result = await conn.query(sql, [firstname, lastname]);

      conn.release();

      if (result.rowCount) {
        const user = result.rows[0];
        console.log(user);

        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user as User;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Invalid username or password. Error: ${err}`);
    }
  }
}
