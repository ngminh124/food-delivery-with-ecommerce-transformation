import { body, query, validationResult } from "express-validator";
import User from "../models/User";

export class UserValidators {
    
    static signup(){
        return [
                    body('name', 'Name is required').isString(),
                    body('email', 'Email is required').isEmail().custom((email, {req})=>{
                        return User.findOne({
                            email: email, 
                            type: 'user'
                        }).then((user)=>{
                            if(user){
                                throw new Error('User already exists');
                            }
                            else{
                                return true;
                            }
                        }).catch(e=>{
                            throw new Error(e);
                        });
            }),
                    body('phonenumber', 'Phone number is required').optional().isString(),
                    body('password', 'Password is required').isAlphanumeric()
                        .isLength({ min: 8, max: 20 })
                        .withMessage('Password must be between 8-20 characters'),
                    body('type', 'User role type is required').isString(),
                    body('status', 'User status is required').isString(),
                
                
                ] ;
    }
    static verifyUserEmail(){
        return [
            body('verification_token', 'Verification token is required').isNumeric(),
            body('email', 'Email is required').isEmail(),
        ];
    }
    static verifyUserForResendEmail(){
        return [
            query('email', 'Email is required').isEmail(),
        ]; 
    }

    static login(){
        return [
                    query('email', 'Email is required').isEmail().custom((email, {req})=>{
                        return User.findOne({
                            email: email, 
                        }).then((user)=>{
                            if(user){
                                req.user= user;
                                return true;
                            }
                            else{
                                throw new Error('No User registered with this email');
                            }
                        }).catch(e=>{
                            throw new Error(e);
                        });
            }),
                    query('password', 'Password is required').isAlphanumeric()
            ] ;
    }
}