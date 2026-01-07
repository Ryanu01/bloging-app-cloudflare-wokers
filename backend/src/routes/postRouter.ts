import { Hono } from "hono";
import { authMiddleware } from "../middleware/middleware";

export const postRouter = new Hono()

postRouter.get('/posts', authMiddleware)
