import { Hono } from "hono";
import { userRouter } from "./routes/userRouter";
const app = new Hono();

app.route("/api/v1", userRouter);

export default app;
