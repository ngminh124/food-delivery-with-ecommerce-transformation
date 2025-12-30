import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import { Utils } from "../utils/Utils";

export class RestaurantController {
  static async addRestaurant(req, res, next) {
    const restaurant = req.body;
    const path = req.file.path.replace(/\\/g, "/");
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(req.body.password);
      const data = {
        email: restaurant.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        phone: restaurant.phone,
        password: hash,
        name: restaurant.res_name,
        type: "restaurant",
        status: "active",
      };

      const user = await new User(data).save();
      const categoriesData = JSON.parse(
        restaurant.categories).map(x => {
          return {
            name: x,
            user_id: user._id,
          };
        });
      const categories = Category.insertMany(categoriesData);
      let restaurant_data: any = {
        name: restaurant.res_name,
        short_name: restaurant.short_name,
        // description: restaurant.description || '',
        // cover: restaurant.cover || '',
        location: JSON.parse(restaurant.location),
        address: restaurant.address,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
        status: restaurant.status,
        price: parseInt(restaurant.price),
        delivery_time: parseInt(restaurant.delivery_time),
        cuisine: JSON.parse(restaurant.cuisines),
        user_id: user._id,
        city_id: restaurant.city_id,
        cover: path,
      };
      if (restaurant.description)
        restaurant_data = {
          ...restaurant_data,
          description: restaurant.description,
        };
      // if(req.file){
      //     const path = req.file.path;
      //     restaurant_data = {... restaurant_data, cover: path};
      // }
      const restaurantDoc = await new Restaurant(restaurant_data).save();
      res.send(restaurantDoc);
    } catch (e) {
      next(e);
    }
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({ status: "active" });
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }
}
