import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import authenticateUser from "../Middlewares/permitUser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import permitUser from "../Middlewares/permitUser";
import permitAdmin from "../Middlewares/permitAdmin";

const tokenSecret = process.env.TOKEN_SECRET;

dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

const create = async (req: Request, res: Response) => {
  const firstname: string | undefined = req.body.firstname;
  const lastname: string | undefined = req.body.lastname;
  const password: string = req.body.password;

  if (
    firstname &&
    lastname &&
    password &&
    typeof firstname == "string" &&
    typeof lastname == "string" &&
    typeof password == "string"
  ) {
    try {
      const newUserID = await store.create(firstname, lastname, password);
      // check request validation
      if (newUserID) {
        const token = jwt.sign(
          {
            data: {
              firstname: firstname,
              lastname: lastname,
              id: newUserID,
              role: "user",
            },
          },
          tokenSecret as string
        );
        res.json({
          firstname,
          lastname,
          id: newUserID,
          role: "user",
          token: token,
        });
      } else {
        res.status(500).send("The username is already used.");
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res
      .status(400)
      .send(
        "bad request. please send unique cobination of (firstname and last name) and  a valid password"
      );
  }
};

const destroy = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  if (id) {
    try {
      const deleted: User = await store.delete(id);
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

const authenticate = async (req: Request, res: Response) => {
  const firstname: string = req.body.firstname;
  const lastname: string = req.body.lastname;
  const password: string = req.body.password;

  if (
    firstname &&
    lastname &&
    password &&
    typeof firstname == "string" &&
    typeof lastname == "string" &&
    typeof password == "string"
  ) {
    try {
      const loginigUser = await store.authenticate(
        firstname,
        lastname,
        password
      );

      console.log(loginigUser);

      if (loginigUser) {
        const token = jwt.sign(
          {
            data: {
              firstname: loginigUser.firstname,
              lastname: loginigUser.lastname,
              id: loginigUser.id,
              role: loginigUser.role,
            },
          },
          tokenSecret as string
        );

        res.json({
          firstname: loginigUser.firstname,
          lastname: loginigUser.lastname,
          id: loginigUser.id,
          role: loginigUser.role,
          token: token,
        });
      } else {
        res.status(400).send("invalid login");
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

const show = async (req: Request, res: Response) => {
  const user: User = await store.show(req.params.id);
  res.json(user);
};

const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (id) {
    const firstname: string | undefined = req.body.firstname;

    const lastname: string | undefined = req.body.lastname;
    const role: string | undefined = req.body.role;
    console.log(role);
    if (
      !("firstname" in req.body || "lastname" in req.body || "role" in req.body)
    ) {
      res.status(400).send("missing parameters");
    } else if (
      ("firstname" in req.body && typeof firstname !== "string") ||
      ("lastname" in req.body && typeof lastname !== "string")
    ) {
      res.status(400).send("firstname and lastname must be string  ");
    } else if ("role" in req.body && role !== "user" && role !== "admin") {
      res.status(400).send("role must be user or admin");
    } else {
      try {
        const updatedUser = await store.update(id, firstname, lastname, role);

        res.json({
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          id: updatedUser.id,
          role: updatedUser.role,
        });
      } catch (err) {
        res.sendStatus(500);
      }
    }
  } else {
    res.status(404).send("user in not found");
  }
};

const userRoutes = (app: express.Application) => {
  app.get("/users", permitUser, permitAdmin, index);
  app.get("/users/:id", permitUser, permitAdmin, show);
  app.post("/users", create);
  app.delete("/users/:id", permitUser, permitAdmin, destroy);
  app.post("/authentication", authenticate);
  app.patch("/users/:id", permitUser, permitAdmin, update);
};

export default userRoutes;
