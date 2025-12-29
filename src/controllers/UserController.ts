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
            verification_token_time: Date.now(),
            phonenumber,
            email,
            password: hash,
            type,
            status
        }

            
            let user = await new User(data).save();
            const payload= {
                user_id: user._id,
                email: user.email, 
            }
            const token = Jwt.jwtSign(payload);
            console.log('token: ', token);
            
            res.json({
                token: token,
                user: user 
            });
            
            // await NodeMailer.sendMail({
            //     to: [user.email],
            //     subject: 'Email verification',
            //     html: `<p>Your verification token is ${verification_token}. It will expire in 5 minutes.</p>`
            // });
        }
        catch(e){
            next(e);
        }

    }

    static async verify(req, res, next){
        const verification_token= req.body.verification_token;
        const email = req.user.email;
        try{
            const user = await User.findOneAndUpdate({
            email: email,
            verification_token: verification_token,
            verification_token_time: { $gt: Date.now() }
        },
        {
            email_verified: true
        },
        {
            new: true 
        });
        if(user){
            res.send(user)
        }
        else{
            throw new Error('Email verification token is expired. Please try again.');
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
            verification_token: verification_token,
            verification_token_time: Date.now()+ new Utils().MAX_TOKEN_TIME
        });
        if(user){
             await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Resend Email verification',
                html: `<p>Your Otp is ${verification_token}.</p>`
            });
            res.json({success: true});
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
                user_id: user._id,
                email: user.email,
            }
            const token = Jwt.jwtSign(payload);
            console.log('token: ', token);
            
            res.json({
                token: token,
                user: user 
            });
        }
        catch(e){
            next(e);
        }
    }
    
}