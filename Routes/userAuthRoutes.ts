import express from "express"
import { signup, signin } from "../Controllers/userAuthController"
// import authMiddleware from "../Middlewares/Auth"


const router = express.Router()

router.post("/signup", signup);
router.post("/signin", signin);

export default router;