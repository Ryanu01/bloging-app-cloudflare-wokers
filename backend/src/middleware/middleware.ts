import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../config";

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const headers =  c.req.header("Authorization")!
        const token = headers.split(" ")[1]
        if(!token) {
            return c.body("Unauthorized", 403)
        }

        const decode = await verify(token, JWT_SECRET)
        if(decode) {
            c.set("userId", decode)
            await next()
        }else {
            return c.body("Unauthorized", 403)    
        }

    } catch (error) {
        return c.json({
            message: `Error occured ${error}`
        })
    }
}