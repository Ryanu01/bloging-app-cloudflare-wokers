import { Hono } from "hono";
import { signin, signup } from "../controler/userControler";

export const userRouter = new Hono();

userRouter.post("/users/signup", signup);
userRouter.post("/users/signin", signin);
