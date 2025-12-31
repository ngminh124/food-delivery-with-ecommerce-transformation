import { body, param, query } from "express-validator";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";

export class ItemValidators {
  static addItem() {
    return [
      body("itemImages", "Item images are required").custom(
        (cover, { req }) => {
          if (!req.file) throw new Error("File not uploaded");
          else return true;
        }
      ),
      body("name", "Item name is required").isString(),
      body("restaurant_id", "Item restaurant Id is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                return true;
              } else {
                throw new Error("Restaurant does not exist");
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("category_id", "Item category Id is required")
        .isString()
        .custom((category_id, { req }) => {
          return Category.findOne({
            _id: category_id,
            restaurant_id: req.body.restaurant_id,
          })
            .then((category) => {
              if (category) {
                return true;
              } else {
                throw new Error("Category does not exist");
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("price", "Item price is required").isNumeric(),
      body("veg", "Item is veg or not is required").isString(),
      body("status", "Item status is required").isString(),

      // param('id')
    ];
  }
}
