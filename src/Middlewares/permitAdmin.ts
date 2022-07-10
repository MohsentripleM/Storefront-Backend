import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const permitAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const headerAuthorization = req.headers.authorization as string;
    const token = headerAuthorization.split(" ")[1];
    const user = (jwt.decode(token) as jwt.JwtPayload).data;
    if (user.role == "admin") {
      return next();
    } else {
      throw new Error("not authorized login");
    }
  } catch (err) {
    res.sendStatus(403);
  }
};

export default permitAdmin;
