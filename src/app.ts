import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import coreRoutes from "./routes/core.routes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/deal", dealRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/core", coreRoutes);

app.use(errorMiddleware);
export default app;