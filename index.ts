import express , {Application, Request, Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import {errorHandler} from "./Middlewares/ErrorHandler"
import UserRoutes from "./Routes/userAuthRoutes"
import messageRoutes from "./Routes/messageRoutes"
import conversationRoutes from "./Routes/conversationRoutes"

dotenv.config()

export const app : Application = express();
// const PORT = process.env.PORT

//middlewares
app.use(cors())
app.use(express.json())
//routes
//test route
app.get("/", (req: Request, res : Response)=>{
    res.status(200).json({
        message : "ChattyTom Backend running"
    })
})
app.use("/auth", UserRoutes)
app.use("/message", messageRoutes)
app.use("/conversation", conversationRoutes)

//global error handler
app.use(errorHandler)

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
