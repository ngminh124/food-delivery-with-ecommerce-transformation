    import { body, query, validationResult } from "express-validator";
    import User from "../models/User";

    export class UserValidators {
    static signup() {
        return [
        body("name", "Name is required").isString(),
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
        body("type", "User role type is required").isString(),
        body("status", "User status is required").isString(),
        ];
    }
    static verifyUserEmailToken() {
        return [
        body("verification_token", "Verification token is required").isString(),
        ];
    }

    static login() {
        return [
        query("email", "Email is required")
            .isEmail()
            .custom((email, { req }) => {
            return User.findOne({
                email: email,
            })
                .then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error("No User registered with this email");
                }
                })
                .catch((e) => {
                throw new Error(e);
                });
            }),
        query("password", "Password is required").isAlphanumeric(),
        ];
    }

    static checkResetPasswordEmail() {
        return [
        query("email", "Email is required")
            .isEmail()
            .custom((email, { req }) => {
            return User.findOne({
                email: email,
            })
                .then((user) => {
                if (user) {
                    return true;
                } else {
                    throw new Error("No User registered with this Email");
                }
                })
                .catch((e) => {
                throw new Error(e);
                });
            }),
        ];
    }
    static verifyResetPasswordToken() {
        return [
        query("email", "Email is required").isEmail(),
        query("reset_password_token", "Reset password token is required")
            .isString()
            .custom((reset_password_token, { req }) => {
            return User.findOne({
                email: req.query.email,
                reset_password_token: reset_password_token,
                reset_password_token_time: { $gt: Date.now() },
            })
                .then((user) => {
                if (user) {
                    return true;
                } else {
                    throw new Error(
                    "Reset password token does not exist. Please regenerate a new token"
                    );
                }
                })
                .catch((e) => {
                throw new Error(e);
                });
            }),
        ];
    }

    static resetPassword() {
        return [
        body("email", "Email is required")
            .isEmail()
            .custom((email, { req }) => {
            return User.findOne({
                email: email,
            })
                .then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error("No user registered with this Email");
                }
                })
                .catch((e) => {
                throw new Error(e);
                });
            }),
        body("new_password", "New password is required").isAlphanumeric(),
        body("otp", "Reset password token is required")
            .isString()
            .custom((reset_password_token, { req }) => {
            if (req.user.reset_password_token == reset_password_token) {
                return true;
            } else {
                req.errorStatus = 422;
                throw "Reset password token is invalid. Please try again";
            }
            }),
        ];
    }

    static verifyPhoneNumber() {
        return [body("phone", "Phone number is required").isString()];
    }

    static verifyUserProfile() {
        return [
        body("phone", "Phone number is required").isString(),
        body("new_email", "New email is required")
            .isEmail()
            .custom((new_email, { req }) => {
                if(req.user.email === new_email) throw new Error("Please provide a new email to update");
                return User.findOne({email: new_email})
                .then((user) => {
                    if (user) {
                    throw "A User is already registered with this email";
                    } else {
                    return true;
                    }
                })
                .catch((e) => {
                    throw new Error(e);
                });
            }),
        body("password", "Password is required").isAlphanumeric(),
        ];
    }
    }
