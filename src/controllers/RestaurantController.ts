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
      // const categoriesData = JSON.parse(restaurant.categories).map((x) => {
      //   return {
      //     name: x,
      //     user_id: user._id,
      //   };
      // });


      // const categories = Category.insertMany(categoriesData);
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
      const categoriesData = JSON.parse(restaurant.categories).map((x) => {
        return {
          name: x,
          restaurant_id: restaurantDoc._id,
        };
      });
      const categories = Category.insertMany(categoriesData);
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

  static async getNearbyRestaurants(req, res, next) {
    // const METERS_PER_MILE = 1609.34;
    // const METERS_PER_KM = 1000;
    // const EARTH_RADIUS_IN_MILE = 3963.2;
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 10;
    const currentPage = parseInt(data.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const restaurants_doc_count = await Restaurant.countDocuments(
        {
        status: "active",
        location: {
          // $nearSphere: {
          //   $geometry: {
          //     type: "Point",
          //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
          //   },
          //   $maxDistance: parseFloat(data.radius) * METERS_PER_KM, // radius in km
          // },
          $geoWithin: { 
                            $centerSphere: [ 
                                [parseFloat(data.lat), parseFloat(data.lng) ], 
                                parseFloat(data.radius) /  EARTH_RADIUS_IN_KM
                            ]
                        }
        },
      }
      );
              const totalPages = Math.ceil(restaurants_doc_count / perPage); // 5.05 => 6
              if (totalPages == 0 || totalPages == currentPage) {
                nextPage = null;
              }
              if (totalPages < currentPage) {
                // throw new Error('No more restaurants available.');
                throw "No more restaurants available.";
              }
      const nearbyRestaurants = await Restaurant.find({
        status: "active",
        location: {
          // $nearSphere: {
          //   $geometry: {
          //     type: "Point",
          //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
          //   },
          //   $maxDistance: parseFloat(data.radius) * METERS_PER_KM, // radius in km
          // },
          $geoWithin: { 
                            $centerSphere: [ 
                                [parseFloat(data.lat), parseFloat(data.lng) ], 
                                parseFloat(data.radius) /  EARTH_RADIUS_IN_KM
                            ]
                        }
        },
      })
      .skip((currentPage * perPage) - perPage) // 7 documents, (page 1 - 5), (page 2 - 1)
      .limit(perPage)
      // const banner = await Banner.find({ status: true });
      // res.send({
      //   nearbyRestaurants,
      //   // banners: banner,
      // });
      res.json({
        restaurants: nearbyRestaurants,
        perPage,
        currentPage,
        prevPage,
        nextPage,
        totalPages
      });
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyRestaurants(req, res, next) {
    // const METERS_PER_MILE = 1609.34;
    // const METERS_PER_KM = 1000;
    // const EARTH_RADIUS_IN_MILE = 3963.2;
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 2;
    const currentPage = parseInt(data.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      // const restaurants= await Restaurant.estimatedDocumentCount(); filter is not available in estimatedDocumentCount
      const restaurants_doc_count = await Restaurant.countDocuments(
        {
        status: "active",
        name: { $regex: data.name, $options: "i" }, 
        location: {
          // $nearSphere: {
          //   $geometry: {
          //     type: "Point",
          //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
          //   },
          //   $maxDistance: parseFloat(data.radius) * METERS_PER_KM, // radius in km
          // },
          $geoWithin: { 
                            $centerSphere: [ 
                                [parseFloat(data.lat), parseFloat(data.lng) ], 
                                parseFloat(data.radius) /  EARTH_RADIUS_IN_KM
                            ]
                        }
        },
      }
      );
              const totalPages = Math.ceil(restaurants_doc_count / perPage); // 5.05 => 6
              if (totalPages == 0 || totalPages == currentPage) {
                nextPage = null;
              }
              if (totalPages < currentPage) {
                // throw new Error('No more restaurants available.');
                throw "No more restaurants available.";
              } 
      const nearbyRestaurants = await Restaurant.find({
        status: "active",
        name: { $regex: data.name, $options: "i" },
        location: {
          // $nearSphere: {
          //   $geometry: {
          //     type: "Point",
          //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
          //   },
          //   $maxDistance: parseFloat(data.radius) * METERS_PER_KM, // radius in km
          // },
          $geoWithin: { 
                            $centerSphere: [ 
                                [parseFloat(data.lat), parseFloat(data.lng) ], 
                                parseFloat(data.radius) /  EARTH_RADIUS_IN_KM
                            ]
                        }
            
        },
      })
      .skip((currentPage * perPage) - perPage) // 7 documents, (page 1 - 5), (page 2 - 1)
      .limit(perPage);
      // const banner = await Banner.find({ status: true });
      // res.send({
      //   nearbyRestaurants,
      //   // banners: banner,
      // });
      res.json({
        restaurants: nearbyRestaurants,
        perPage,
        currentPage,
        prevPage,
        nextPage,
        totalPages
      });
    } catch (e) {
      next(e);
    }
  }
}
