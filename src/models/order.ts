// @ts-ignore
import client from "../database";

export enum order_status {
  ordered = "ordered",
  ready = "ready",
  delivered = "delivered",
  canceled = "canceled",
}

export type Order = {
  id?: number;
  status: order_status;
  user_id?: number;
};
export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};
export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get Order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order | null> {
    try {
      if (o.status && o.user_id) {
        const sql =
          "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *;";
        // @ts-ignore
        const conn = await client.connect();

        const result = await conn.query(sql, [o.status, o.user_id]);

        const order = result.rows[0];

        conn.release();

        return order as Order;
      } else if (o.user_id) {
        const sql = "INSERT INTO orders  (user_id) VALUES($1) RETURNING *;";
        // @ts-ignore
        const conn = await client.connect();

        const result = await conn.query(sql, [o.user_id]);

        const order = result.rows[0];
        return order as Order;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not add Order ${o.user_id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const order: Order = result.rows[0];

      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete Order ${id}. Error: ${err}`);
    }
  }
  async addNewProduct(newProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const checkSQL = "SELECT * from orders where id=$1";
      const sql =
        "INSERT INTO order_products (order_id,product_id,quantity) VALUES($1, $2, $3) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();
      const order: Order = (await conn.query(checkSQL, [newProduct.order_id]))
        .rows[0];
      if (
        order.status.toString() == order_status.delivered.toString() ||
        order.status.toString() == order_status.canceled.toString()
      ) {
        throw new Error(`can not add product to ${order.status} orders`);
      } else {
        const result = await conn.query(sql, [
          newProduct.order_id,
          newProduct.product_id,
          newProduct.quantity,
        ]);
        console.log(result);
        conn.release();
        return result.rows[0] as OrderProduct;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        `Could not add Order ${newProduct.product_id}. Error: ${err}`
      );
    }
  }

  async updateOrder(
    orderID: number,
    userID: number | undefined,
    status: order_status | undefined
  ): Promise<Order> {
    try {
      let sql, result;
      const conn = await client.connect();
      if (
        userID &&
        typeof userID === "number" &&
        status &&
        typeof status === "string"
      ) {
        sql = "UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING *";
        result = await conn.query(sql, [userID, status, orderID]);
      } else if (userID && typeof userID === "number") {
        sql = "UPDATE orders SET user_id=$1 WHERE id=$2 RETURNING *";
        result = await conn.query(sql, [userID, orderID]);
      } else if (status && typeof status === "string") {
        sql = "UPDATE orders SET  status=$1 WHERE id=$2 RETURNING *";
        result = await conn.query(sql, [status, orderID]);
      } else {
        throw new Error("missing parameters");
      }
      const updatedOrder = result.rows[0];
      conn.release();

      return updatedOrder as Order;
    } catch (err) {
      throw new Error(`Could not update Order ${orderID}. Error: ${err}`);
    }
  }
}
