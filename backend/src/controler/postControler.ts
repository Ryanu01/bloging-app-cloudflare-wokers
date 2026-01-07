import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const getPosts = async (c: Context) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId')
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user) {
            return c.body("Invalid user", 403)
        }

        const posts = await prisma.post.findMany()

        if(!posts) {
            return c.body("No posts available", 203)
        }

        return c.json({
            posts
        })
    } catch (error) {
        return c.json({
            message: `Error occured ${error}`
        })
    }
}
