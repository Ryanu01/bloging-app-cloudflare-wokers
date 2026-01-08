import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { postSchema } from "../zod/types";
import { every } from "hono/combine";
import { postRouter } from "../routes/postRouter";
import { is } from "zod/locales";
import { promise } from "zod";

export const getPosts = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const user = await prisma.user.findFirst({
      where: {
        id: userId.userId,
      },
    });

    if (!user) {
      return c.body("Invalid user", 403);
    }

    const posts = await prisma.post.findMany();

    if (!posts) {
      return c.body("No posts available", 203);
    }

    return c.json({
      posts,
    });
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`,
    });
  }
};

export const postPosts = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body: {
      title: string;
      body: string;
    } = await c.req.json();
    const userId = c.get("userId");
    console.log(userId.userId);

    const userExist = await prisma.user.findFirst({
      where: {
        id: userId.userId,
      },
    });

    if (!userExist) {
      return c.body("User does not exist", 404);
    }

    const { success } = postSchema.safeParse(body);

    if (!success) {
      return c.body("Invalid inputs", 411);
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
        userId: userExist.id,
      },
    });

    return c.json({
      message: "Post addded successfully",
      post,
    });
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`,
    });
  }
};

export const getPostsById = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const user = await prisma.user.findFirst({
      where: {
        id: userId.userId,
      },
    });

    if (!user) {
      return c.body("User not found", 404);
    }

    const id = parseInt(c.req.param("id")!);

    const posts = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    if (!posts) {
      return c.body("No posts available", 203);
    }

    return c.json({
      posts,
    });
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`,
    });
  }
};

export const updatePost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const id = parseInt(c.req.param("id")!);
    const user = await prisma.user.findFirst({
      where: {
        id: userId.userId,
      },
    });

    if (!user) {
      return c.body("User not found", 404);
    }

    const body: {
      title: string;
      body: string;
    } = await c.req.json();

    const { success } = postSchema.safeParse(body);
    if (!success) {
      return c.body("Invalid inputs", 411);
    }

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    if (!post) {
      return c.body("No posts available", 404);
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: body.title,
        body: body.body,
      },
    });

    return c.json({
      updatedPost,
    });
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`,
    });
  }
};

export const deletePost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const user = await prisma.user.findFirst({
    where: {
      id: userId.userId,
    },
  });

  if (!user) {
    return c.body("User not found", 404);
  }

  const id = parseInt(c.req.param("id")!);

  const post = await prisma.post.delete({
    where: {
      userId: user.id,
      id,
    },
  });

  return c.json({
    message: "Post deleted",
    post,
  });
};
