import * as express from "express";
import * as mongoose from "mongoose";
import e = require("express");
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import BannerRouter from "./routers/BannerRouter";
import CityRouter from "./routers/CityRouter";
import RestaurantRouter from "./routers/RestaurantRouter";
import CategoryRouter from "./routers/CategoryRouter";
import ItemRouter from "./routers/ItemRouter";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handleError();
  }
  setConfigs() {
    // Set server configurations here
    this.connectMongoDB();
    this.allowCors();
    this.configureBodyParser();
  }

  connectMongoDB() {
    // Connect to MongoDB here
    mongoose.connect(getEnvironmentVariables().db_url).then(() => {
      console.log("Connected to MongoDB");
    });
  }

  configureBodyParser() {
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }

  allowCors() {
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    // Define server routes here
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/banner", BannerRouter);
    this.app.use("/api/city", CityRouter);
    this.app.use("/api/restaurant", RestaurantRouter);
    this.app.use("/api/category", CategoryRouter);
    this.app.use("/api/item", ItemRouter);
  }
  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }

  handleError() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong. Please try again",
        status_code: errorStatus,
      });
    });
  }
}
