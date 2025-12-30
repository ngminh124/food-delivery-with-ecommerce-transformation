import { body } from "express-validator";

export class BannerValidators {
    static addBanner() {
        return [
        body("banner", "Banner is required")
            .custom((banner, { req }) => {
            if (!req.file) throw new Error("File not uploaded");
            else return true;
            }),
        ];
    }
    }
