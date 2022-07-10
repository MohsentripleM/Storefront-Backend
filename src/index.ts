import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./handlers/user";
import orderRoutes from "./handlers/order";
import productRoutes from "./handlers/product";
import morgan from "morgan";
import { textSpanContainsPosition } from "typescript";

const corsOptions = {
  origin: "http://someotherdomain.com",
  optionsSucessStatus: 200,
};

const app: express.Application = express();
const address: string = "0.0.0.0:3000";
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
userRoutes(app);
orderRoutes(app);
productRoutes(app);

export default app;
