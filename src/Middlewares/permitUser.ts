import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const tokenSecret = process.env.TOKEN_SECRET;

const permitUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const headerAuthorization = req.headers.authorization as string;
    const token = headerAuthorization.split(" ")[1];
    jwt.verify(token, tokenSecret as Secret);
    return next();
  } catch (err) {
    res.sendStatus(403);
  }
};

export default permitUser;
