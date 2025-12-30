import { body, param } from "express-validator";
import User from "../models/User";

export class RestaurantValidators {
    static addRestaurant() {
        return [
        body("name", "Owner name is required").isString(),
        body("email", "Email is required")
                    .isEmail()
                    .custom((email, { req }) => {
                    return User.findOne({
                        email: email,
                        type: "user",
                    })
                        .then((user) => {
                        if (user) {
                            throw new Error("User already exists");
                        } else {
                            return true;
                        }
                        })
                        .catch((e) => {
                        throw new Error(e);
                        });
                    }),
        body("phonenumber", "Phone number is required").optional().isString(),
        body("password", "Password is required")
                    .isAlphanumeric()
                    .isLength({ min: 8, max: 20 })
                    .withMessage("Password must be between 8-20 characters"),
        body("cover", "Cover is required")
                    .custom((cover, { req }) => {
                    if (!req.file) throw new Error("File not uploaded");
                    else return true;
                    }),            
        body("res_name", "Restaurant name is required").isString(),
        body("short_name", "Restaurant short name is required").isString(),
        body("openTime", "Open time is required").isString(),
        body("closeTime", "Close time is required").isString(),
        body("price", "Price is required").isString(),
        body("delivery_time", "Delivery time is required").isString(),
        body("status", "Status is required").isString(),
        body("address", "Address is required").isString(),
        body("location", "Location is required").isString(),
        body("cuisines", "Cuisines is required").isString(),
        body("city_id", "City is required").isString(),
        ];
    }
}
