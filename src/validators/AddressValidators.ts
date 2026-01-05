import { body, query} from "express-validator";

export class AddressValidators {
  static addAddress() {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }
  static editAddress() {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
    }

    static checkAddress() {
    return [
      query("lat", "Latitude is required").isNumeric(),
      query("lng", "Longitude is required").isNumeric(),];
    }

    static getLimitedAddresses() {
    return [ 
      query("limit", "Limit is required").isNumeric(),];
    }

}