import { Hono } from "hono";
import { authMiddleware } from "../middleware/middleware";
import {
  deletePost,
  getPosts,
  postPosts,
  updatePost,
} from "../controler/postControler";

export const postRouter = new Hono();

postRouter.get("/posts", authMiddleware, getPosts);
postRouter.post("/create-posts", authMiddleware, postPosts);
postRouter.get("/posts/:id", authMiddleware, getPosts);
postRouter.put("/posts/:id", authMiddleware, updatePost);
postRouter.delete("/posts/:id", authMiddleware, deletePost);
