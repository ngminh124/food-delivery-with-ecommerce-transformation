import { body, param, query } from "express-validator";

export class CityValidators {
    static addCity() {
        return [
        body("name", "City name is required").isString(),
        body("lat", "City latitude is required").isNumeric(),
        body("lng", "City longitude is required").isNumeric(),
        body("status", "City status is required").isString(),
        // param('id')
        ];
    }
}
