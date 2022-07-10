// @ts-ignore
import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM products";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get Product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [p.name, p.price]);

      const Product = result.rows[0];

      conn.release();

      return Product as Product;
    } catch (err) {
      throw new Error(`Could not add Product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1) RETURNING*";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const Product = result.rows[0];

      conn.release();

      return Product as Product;
    } catch (err) {
      throw new Error(`Could not delete Product ${id}. Error: ${err}`);
    }
  }

  async update(
    id: number,
    name: string | undefined,
    price: number | undefined
  ): Promise<Product> {
    try {
      let sql, result;
      const conn = await client.connect();
      if (
        name &&
        typeof name === "string" &&
        price &&
        typeof price === "number"
      ) {
        sql = "UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *";
        result = await conn.query(sql, [name, price, id]);
      } else if (name && typeof name === "string") {
        sql = "UPDATE products SET name=$1 WHERE id=$2 RETURNING *";
        result = await conn.query(sql, [name, id]);
      } else if (price && typeof price === "number") {
        sql = "UPDATE products SET  price=$1 WHERE id=$2 RETURNING *";
        result = await conn.query(sql, [price, id]);
      } else {
        throw new Error("missing parameters");
      }
      const updatedProduct = result.rows[0];
      conn.release();

      return updatedProduct as Product;
    } catch (err) {
      throw new Error(`Could not update Product ${id}. Error: ${err}`);
    }
  }
}
