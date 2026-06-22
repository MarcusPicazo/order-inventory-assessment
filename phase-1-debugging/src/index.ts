import express from "express";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { registerEventHandlers } from "./events/handlers";

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

registerEventHandlers();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
