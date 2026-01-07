import User from '../models/User';
import { Utils } from '../utils/Utils';
import { NodeMailer } from '../utils/NodeMailer';
import * as JWT from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/environment';
import { Jwt } from '../utils/Jwt';


export class UserController {

    static async signup(req, res, next){
        // const data=[{ username: 'john_doe'}];
        // res.status(200).send(data);
        // const error = new Error('User email or password is incorrect');
        // next(error);
        // res.send(req.body);

        // console.log(Utils.generateVerificationToken());

        const name= req.body.name;
        const phonenumber= req.body.phonenumber;
        const email = req.body.email;
        const password = req.body.password;
        const type = req.body.type;
        const status = req.body.status;
        const verification_token= Utils.generateVerificationToken();


        

        try{
            const hash= await Utils.encryptPassword(password);
            const data ={
            
            name,
            verification_token ,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
            phonenumber,
            email,
            password: hash,
            type,
            status
        } 

            
            let user = await new User(data).save();
            const payload= {
                // user_id: user._id,
                // aud: user._id,
                email: user.email, 
                type: user.type
            }
            const access_token = Jwt.jwtSign(payload, user._id.toString());
            const refresh_token = Jwt.jwtSignRefreshToken(payload, user._id.toString());
            res.json({
                access_token: access_token,
                refresh_token: refresh_token,
                user: user 
            });
            
            // await NodeMailer.sendMail({
            //     to: [user.email],
            //     subject: 'Email verification',
            //     html: `<p>Your verification token is     ${verification_token}. It will expire in 5 minutes.</p>`
            // });
        }
        catch(e){
            next(e);
        }

    }

    static async verifyUserEmailToken(req, res, next){
        const verification_token= req.body.verification_token;
        const email = req.user.email;
        try{
            const user = await User.findOneAndUpdate({
            email: email,
            verification_token: verification_token,
            verification_token_time: { $gt: Date.now() }
        },
        {
            
            email_verified: true,
            updated_at: new Date()
        },
        {
            new: true 
        });
        if(user){
            res.send(user)
        }
        else{
            throw new Error('Wrong Otp or Email verification token is expired. Please try again...');
        }
    }
        catch(e){
            next(e);
        }
    }
    static async resendVerificationEmail(req, res, next){
        // res.send(req.user);
        const email = req.user.email;
        const verification_token= Utils.generateVerificationToken();
       
        try{
            const user = await User.findOneAndUpdate(
                {email: email},
        {
            updated_at: new Date(),
            verification_token: verification_token,
            verification_token_time: Date.now()+ new Utils().MAX_TOKEN_TIME
        });
        if(user){
            res.json({success: true});
             await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Resend Email verification',
                html: `<p>Your Otp is ${verification_token}.</p>`
            });
            
        }
        else{
            throw new Error('User does not exist.');
        }
        }
        catch(e){
            next(e);
        }
    }
    
    static async login(req, res, next){
        const user= req.user;
        const password = req.query.password;
        const data={
            password,
            encrypt_password: user.password 
        };
        
        try{
            await Utils.comparePassword(data);
            const payload= {
                // aud: user._id,
                // user_id: user._id,
                email: user.email,
                type: user.type
            }
            const access_token = Jwt.jwtSign(payload, user._id.toString());
            const refresh_token = Jwt.jwtSignRefreshToken(payload, user._id.toString());
            console.log('token: ', access_token);
            
            res.json({
                access_token: access_token,
                refresh_token: refresh_token,
                user: user 
            });
        }
        catch(e){
            next(e);
        }
    }
    static async sendResetPasswordOtp(req, res, next){
        // res.send(req.user);
        const email = req.query.email;
        const reset_password_token= Utils.generateVerificationToken();
       
        try{
            const user = await User.findOneAndUpdate(
                {email: email},
        {
            updated_at: new Date(),
            reset_password_token: reset_password_token,
            reset_password_token_time: Date.now()+ new Utils().MAX_TOKEN_TIME
        });
        if(user){
            
            res.json({success: true});
            console.log('reset password otp: ', reset_password_token);
             await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Reset Password email verification OTP',
                html: `<p>Your Otp is ${reset_password_token}.</p>`
            });
        }
        else{
            throw new Error('User does not exist.');
        }
        }
        catch(e){
            next(e);
        }
    }

    static verifyResetPasswordToken(req, res, next){
        res.json({success: true});
    }
    
    static async resetPassword(req, res, next){
        
        const user= req.user;
        const new_password= req.body.new_password;
       
        try{
            const encryptedPassword= await Utils.encryptPassword(new_password);
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                // findByIdAndUpdate(user._id,{...})
        {
            updated_at: new Date(),
            password: encryptedPassword,
        },
        { new: true }
    );
        if(updatedUser){
            res.send(updatedUser)
        }
        else{
            throw new Error('User does not exist.');
        }
        }
        catch(e){
            next(e);
        }
    }

    static async profile(req, res, next){  
        
        const user= req.user;
       
        try{
            const profile = await User.findById(user.aud);
        if(profile){
            res.send(profile)
        }
        else{
            throw new Error('User does not exist.');
        }
        }
        catch(e){
            next(e);
        }
    }

    static async updatePhoneNumber(req, res, next){
        const user= req.user;
        const phone = req.body.phone;
        try{
            const userData= await User.findByIdAndUpdate(
                user.aud,
                {phone: phone, updated_at: new Date() },
                {new: true}
            );
            res.send(userData);
        }catch(e){
            next(e);
        }
    }

    static async updateProfile(req, res, next){
        const user= req.user;
        const phone = req.body.phone;
        const new_email= req.body.new_email;
        const plain_password= req.body.password;
        const verification_token= Utils.generateVerificationToken();
        try{
            const userData= await User.findByIdAndUpdate(user.aud,);
            if(!userData) throw new Error('User does not exist.');
            await Utils.comparePassword({
                password: plain_password,
                encrypt_password: userData.password
            });
            const updatedUser= await User.findByIdAndUpdate(
                user.aud,
                {
                    phone: phone,
                    email: new_email,
                    email_verified: false,
                    verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at: new Date()
                },
                {new: true}
            );
            const payload= {
                // user_id: user._id,
                // aud: user.aud,
                email: updatedUser.email, 
                type: updatedUser.type
            }
            const access_token = Jwt.jwtSign(payload, user.aud);
            const refresh_token = Jwt.jwtSignRefreshToken(payload, user.aud);
            
            res.json({
                access_token: access_token,
                refresh_token: refresh_token,
                user: updatedUser 
            });
            
            await NodeMailer.sendMail({
                to: [updatedUser.email],
                subject: 'Email verification',
                html: `<p>Your verification token is ${verification_token}. It will expire in 5 minutes.</p>`
            });
        }catch(e){
            next(e);
        }
    }
    
}