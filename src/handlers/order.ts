import express, { Request, Response } from "express";
import permitAdmin from "../Middlewares/permitAdmin";
import permitUser from "../Middlewares/permitUser";
import { Order, OrderProduct, OrderStore } from "../models/order";

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).send(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order: Order = await store.show(parseInt(req.params.id as string));
    res.json(order);
  } catch (err) {
    res.status(400).send(err);
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id,
    };

    const newOrder = await store.create(order);
    if (newOrder) {
      res.json(newOrder);
    } else {
      res.status(400).send("you should send user id ");
    }
  } catch (err) {
    res.status(400).send(`bad request. ${err}`);
  }
};
const addProduct = async (req: Request, res: Response) => {
  const order_id = parseInt(req.params.id);
  const product_id = parseInt(req.body.product_id);
  const quantity = parseInt(req.body.quantity);

  if (order_id && product_id && quantity > 0) {
    try {
      const product: OrderProduct = {
        order_id,
        product_id,
        quantity,
      };
      const newOrder = await store.addNewProduct(product);
      res.json(newOrder);
    } catch (err) {
      res.status(400).send("bad request");
    }
  } else {
    res.status(400).send("bad request. parameters must be numbers");
  }
};
const destroy = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (id) {
    try {
      const deleted: Order = await store.delete(id);
      if (deleted) {
        res.send(`order ${deleted.id} has been deleted`);
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(200).send(err);
    }
  } else {
    res.status(400).send("bad request");
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (id) {
    try {
      const userID = req.body.user_id;
      const status = req.body.status;
      if (
        status !== "ordered" &&
        status !== "ready" &&
        status !== "delivered" &&
        status !== "cancelled"
      ) {
        res
          .status(400)
          .send(
            "the status must be (ordered or ready or delivered or cancelled)"
          );
      } else {
        const updatedOrder = await store.updateOrder(id, userID, status);
        res.json(updatedOrder);
      }
    } catch (err) {
      res.status(400).send("bad request");
    }
  } else {
    res.status(404).send("order is not found");
  }
};

const orderRoutes = (app: express.Application) => {
  app.get("/orders", permitUser, permitAdmin, index);
  app.get("/orders/:id", permitUser, show);
  app.post("/orders", permitUser, createOrder);
  app.post("/orders/:id/products", permitUser, addProduct);
  app.delete("/orders/:id", permitUser, permitAdmin, destroy);
  app.patch("/orders/:id", permitUser, permitAdmin, updateOrder);
};

export default orderRoutes;
