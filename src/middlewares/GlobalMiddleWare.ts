import { validationResult } from 'express-validator';
import { Jwt } from '../utils/Jwt';

export class GlobalMiddleWare {

    static checkError(req, res, next){
        const errors = validationResult(req);
                 if(!errors.isEmpty()){
                    return next(new Error(errors.array()[0].msg));
                }
                else{
                    next();
                }
        
    }


    static async auth(req, res, next){
        const header_auth= req.headers.authorization;
        const token = header_auth ? header_auth.slice(7, header_auth.length) : null; // 'Bearer '.length =7
        // const authHeader= header_auth.split(' ');  const token1= authHeader[1];
        try{
            if(!token){
                req.status(401);
                next(new Error('User does not exist'));
                
            }
            const decoded= await Jwt.jwtVerify(token);
            req.user= decoded;
            next();
        }
        catch(e){
            // next(e);
            next(new Error('User does not exist'));
        }
    }

    static adminRole(req, res, next){

        const user= req.user;
        // const authHeader= header_auth.split(' ');  const token1= authHeader[1];
        if(user.type !== 'admin'){
                req.errorStatus = 401;
                next(new Error('You are unauthorized User'));
            }
        next(); 
    }
}