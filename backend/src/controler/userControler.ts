import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { signinSchema, userSchema } from "../zod/types";
import { sign } from "hono/jwt";
import { JWT_SECRET } from "../config";

export async function signup(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {

    const body: {
      username: string;
      email: string;
      password: string;
    } = await c.req.json();

    const { success } = userSchema.safeParse(body);
    if (!success) {
      return c.body("Invalid data", 400);
    }


    const exisitingUser = await prisma.user.findFirst({
      where: {
          OR: [
            {username: body.username},
            {email: body.email}
          ]
      }
    })

    if(exisitingUser) {
      return c.body("User already exist", 400)
    }

    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        email: body.email,
      },
    });

    return c.json({
      messsage: "User created successfully",
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`,
    });
  }
}


export const signin = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body: {
      email: string,
      password: string
    } = await c.req.json()

    const { success } = signinSchema.safeParse(body)

    if (!success) {
      return c.body("Invalid inputs", 411)
    }

    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    if(!user) {
      return c.body("User does not exist", 404)
    }

    const token = await sign({ userId: user.id }, JWT_SECRET)
    return c.json({
      token
    })
  } catch (error) {
    return c.json({
      message: `Error occured ${error}`
    })
  }
}