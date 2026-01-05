import { body, query } from "express-validator";
import Restaurant from "../models/Restaurant";

export class OrderValidators {
  static placeOrder() {
    return [
      body("restaurant_id", "Restaurant ID is required")
        .isString()
        .custom((restaurantId, { req }) => {
          return Restaurant.findById(restaurantId)
            .then((restaurant) => {
              if (restaurant) {
                req.restaurant = restaurant;
                return true;
              } else {
                throw new Error("Restaurant does not exist");
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      ,
      body("order", "Order Items is required").isString(),
      body("address", "Address is required").isString(),
      body("status", "Order Status is required").isString(),
      body("total", "Order Total is required").isNumeric(),
      body("grandTotal", "Order Grand Total is required").isNumeric(),
      body("deliveryCharge", "Delivery Charge is required").isNumeric(),
      body("payment_status", "Payment Status is required").isBoolean(),
      body("payment_mode", "Payment Mode is required").isString(),
      body("instruction", "Special Instructions").optional().isString(),
    ];
  }
}
