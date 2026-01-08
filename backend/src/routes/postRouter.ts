import { Hono } from "hono";
import { authMiddleware } from "../middleware/middleware";
import { getPosts, postPosts } from "../controler/postControler";

export const postRouter = new Hono();

postRouter.get("/posts", authMiddleware, getPosts);
postRouter.post("/create-posts", authMiddleware, postPosts);
