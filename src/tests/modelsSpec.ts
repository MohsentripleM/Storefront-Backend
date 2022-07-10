import client from "../database";
import { User, UserStore } from "../models/user";
import bcrypt from "bcrypt";
import { Product, ProductStore } from "../models/product";
import { Order, OrderStore, order_status, OrderProduct } from "../models/order";

const userTest = new UserStore();
const productTest = new ProductStore();
const orderTest = new OrderStore();
let userID: number;
let createdOrder;

describe("testing models", () => {
  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1; DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;  DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
    await conn.query(sql);
    conn.release();
  });

  describe("User Model", () => {
    it("should have an index method", () => {
      expect(userTest.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(userTest.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(userTest.create).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(userTest.delete).toBeDefined();
    });

    it("should have a authenticate method", () => {
      expect(userTest.authenticate).toBeDefined();
    });
    it("should have a update method", () => {
      expect(userTest.update).toBeDefined();
    });

    describe("Test User Model Logic", () => {
      const user: User = {
        firstname: "Mahmoud",
        lastname: "Mamdouh",
        password: "p@$$w0rd",
        role: "user",
      };

      beforeAll(async () => {
        const createduser = await userTest.create(
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

      
      it("index method should get all users", async () => {
        const allUsers = await userTest.index();
        expect(allUsers).toEqual([ {
           id: 1, 
            firstname: 'Mahmoud',
             lastname: 'Mamdouh'
             } as User ]);
      });

      it("show method should show user details", async () => {
        const allUsers = await userTest.show("1");
        console.log(allUsers)
        expect(allUsers).toEqual({
           id: 1, 
            firstname: 'Mahmoud',
             lastname: 'Mamdouh',
             role:'user'
             } as User);
      });
      it("create method should add user", async () => {
        const createdUser: User = {
          firstname: "Ahmed",
          lastname: "Ali",
          password: "p@$$w0rd2",
          role: "user",
        };
        const result = await userTest.create(
          createdUser.firstname,
          createdUser.lastname,
          createdUser.password
        );
        expect(result).toBeGreaterThan(0);
      });

      

      it("update method should update user data", async () => {
        const firstnameUpdate = "Ali";
        const lastnameUpdate = "Hassan";
        const roleUpdate = "admin";
        const updatedUserID = 2;
        const result = await userTest.update(
          updatedUserID,
          firstnameUpdate,
          lastnameUpdate,
          roleUpdate
        );
        expect(result.firstname).toEqual("Ali");
        expect(result.lastname).toEqual("Hassan");
        expect(result.role).toEqual("admin");
      });
      it("delete method should delete user", async () => {
        const deletedUser = await userTest.delete(2);
        expect(deletedUser).toEqual({
          firstname: "Ali",
          lastname: "Hassan",
          id: 2} as User);
      });

      
    });
  });

  describe("Product Model", () => {
    it("should have an index method", () => {
      expect(productTest.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(productTest.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(productTest.create).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(productTest.delete).toBeDefined();
    });

    it("should have a update method", () => {
      expect(productTest.update).toBeDefined();
    });

    describe("Test Product Model Logic", () => {
      const product: Product = {
        name: "blanket",
        price: 500,
      };
      let productID: number;

      beforeAll(async () => {
        const createdProduct = await productTest.create(product);
      });

      afterAll(async () => {
        const conn = await client.connect();
        const sql = `DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
        await conn.query(sql);
        conn.release();
      });

      it("index method should get all Products", async () => {
        const allProducts = await productTest.index();
       
        expect(allProducts).toEqual([ {
           id:2 , 
            name: 'blanket',
            price:500
             } as Product ]);
      });

      it("show method should show Product details", async () => {
        const result = await productTest.show("2");
        console.log(result)
        expect(result).toEqual({
          id: 2, 
           name: 'blanket',
           price:500
            } as Product);
      });

      it("create method should add product", async () => {
        const createdProduct: Product = {
          name: "LCD",
          price: 9000,
        };
        const result = await productTest.create(createdProduct);

        expect(result.name).toEqual("LCD");
        expect(result.price).toEqual(9000);
        productID = result.id as number;
      });
      it("update method should update product data", async () => {
        const productNameUpdate = "UPS";
        const priceUpdate = "5000";
        const updatedProductID = productID;
        const result = await productTest.update(
          updatedProductID,
          productNameUpdate,
          parseInt(priceUpdate)
        );
        expect(result.name).toEqual("UPS");
        expect(result.price).toEqual(5000);
      });
      it("delete method should delete Product", async () => {
        const deletedProduct = await productTest.delete(productID);
        expect(deletedProduct).toEqual({
          id:productID,
          name: "UPS",
          price: 5000,
        } as Product);
      });

      


    });
  });

  describe("Order Model", () => {
    it("should have an index method", () => {
      expect(orderTest.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(orderTest.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(orderTest.create).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(orderTest.delete).toBeDefined();
    });

    it("should have a update method", () => {
      expect(orderTest.updateOrder).toBeDefined();
    });

    it("should have add new product method", () => {
      expect(orderTest.addNewProduct).toBeDefined();
    });

    describe("Test Order Model Logic", () => {
      let orderID: number;
      const order: Order = {
        user_id: 1,
        status: order_status.ordered,
      };

      const user: User = {
        firstname: "Mahmoud",
        lastname: "Alaa",
        password: "p@$$w0rd",
        role: "user",
      };

      const product: Product = {
        name: "blanket",
        price: 500,
      };
      let productID: number;

      beforeAll(async () => {
        userID = (await userTest.create(
          user.firstname,
          user.lastname,
          user.password
        )) as number;

        createdOrder = (await orderTest.create(order)) as Order;
        const createdProduct = await productTest.create(product);
        productID = createdProduct.id as number;
      });

      afterAll(async () => {
        const conn = await client.connect();
        const sql = `DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
        await conn.query(sql);
        conn.release();
      });

      it("index method should get all orders", async () => {
        const allOrders = await orderTest.index();
       
        expect(allOrders).toEqual([ {
           id: 2, 
            user_id: 1,
            status:"ordered"
             } as Order ]);
      });

      it("show method should show Order details", async () => {
        const result = await orderTest.show(2);
        console.log(result)
        expect(result).toEqual({
          id:2,
          user_id: 1, 
          status:"ordered",
            } as Order);
      });


      it("create method should add order", async () => {
        const createdorder: Order = {
          user_id: userID,
          status: order_status.ready,
        };
        const result = (await orderTest.create(createdorder)) as Order;

        expect(result.user_id).toEqual(userID);
        expect(result.status).toEqual("ready");
        orderID = result.id as number;
        console.log(result);
      });
      it("update method should update order", async () => {
        const orderUserID = userID;
        const updatedOrderID = orderID;
        const updateResult = await orderTest.updateOrder(
          updatedOrderID,
          orderUserID,
          order_status.ordered
        );
        console.log(updateResult);
        expect(updateResult.user_id).toEqual(userID);
        expect(updateResult.status).toBe("ordered");
      });

      it("addProduct method should add a product to the order", async () => {
        const newProduct: OrderProduct = {
          order_id: orderID,
          product_id: productID,
          quantity: 3,
        };

        const result = await orderTest.addNewProduct(newProduct);

        expect(result.order_id).toEqual(orderID);
        expect(result.product_id).toEqual(productID);
        expect(result.quantity).toEqual(3);
      });
      it("delete method should delete Order", async () => {
        const deletedOrder = await orderTest.delete(orderID);
        expect(deletedOrder.id).toEqual(orderID);
      });
    });
  });
});
