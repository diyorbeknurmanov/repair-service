const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const cookieParser = require("cookie-parser");
const index_router = require("./routes");
const errorHandlingMiddleware = require("./middleware/errors/error-handling.middleware");

const PORT = config.get("port") || 3030;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", index_router);
app.use(errorHandlingMiddleware);
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true, force: false });

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
