import express, { Request, Response } from "express";
import permitAdmin from "../Middlewares/permitAdmin";
import permitUser from "../Middlewares/permitUser";
import { Product, ProductStore } from "../models/product";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product: Product = await store.show(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400).send(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const Product: Product = {
      name: req.body.name,
      price: req.body.price,
    };

    if (Product.price) {
      const newProduct = await store.create(Product);
      res.json(newProduct);
    } else {
      res.status(400).send("you must send the product price");
    }
  } catch (err) {
    res.status(400).send("bad request");
  }
};

const destroy = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);

  if (id) {
    try {
      const deleted: Product = await store.delete(id);
      if (deleted) {
        res.json(deleted);
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("bad request");
  }
};
const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (id) {
    try {
      const name = req.body.name;
      const price = parseInt(req.body.price as string);
      if (price) {
        const updatedProduct = await store.update(id, name, price);
        res.json(updatedProduct);
      } else {
        res.status(400).send("the price must be integer");
      }
    } catch (err) {
      res.status(400).send("bad request");
    }
  } else {
    res.status(404).send("product is not found");
  }
};

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", permitUser, permitAdmin, create);
  app.delete("/products/:id", permitUser, permitAdmin, destroy);
  app.patch("/products/:id", permitUser, permitAdmin, update);
};

export default productRoutes;
