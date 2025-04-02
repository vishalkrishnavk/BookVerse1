import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { io, server, app } from "./utils/socket.js";
//securty packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import fav from "./routes/favouritesRoutes.js";
import cartRoute from "./routes/cartRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import messageRoutes from "./routes/messageRoutes.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

/* const app = express(); */

app.use(
  cors({
    origin: ["http://localhost:3000", "http://172.20.185.203:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // For JSON payloads
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For URL-encoded payloads

app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 8800;
dbConnection();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

app.use(`/auth`, authRoute); //auth/register
app.use(`/users`, userRoute);
app.use(`/posts`, postRoute);
app.use(`/books`, bookRoutes);
app.use(`/order`, orderRoutes);
app.use(`/favourites`, fav);
app.use(`/cart`, cartRoute);
app.use(`/admin`, adminRoutes);
app.use("/messages", messageRoutes);

//error middleware
app.use(errorMiddleware);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port: ${PORT}`);
});
