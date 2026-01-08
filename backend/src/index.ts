import { Hono } from "hono";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";
const app = new Hono();

app.route("/api/v1", userRouter);
app.route("/api/v1", postRouter);
export default app;
