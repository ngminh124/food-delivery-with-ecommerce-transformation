import { parse } from "node:path";
import * as Bcrypt from 'bcrypt';
import { hash } from "bcrypt";
import * as JWT from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/environment';

export class Utils{

    public MAX_TOKEN_TIME =  (5*60*1000)

    static generateVerificationToken(digit: number = 6) {
        const digits = '0123456789';
        let otp = ''
        for (let i = 0; i < digit; i++ ) {
            otp += Math.floor(Math.random() * 10);
        }
        return parseInt(otp);
    }
    static encryptPassword(password){
        return new Promise((resolve, reject)=>{
            Bcrypt.hash(password, 10, (err, hash)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(hash);
            }
        });
        });
    } 

    static comparePassword(data: {password: string, encrypt_password: string} ): Promise<any>{
        return new Promise((resolve, reject)=>{
            Bcrypt.compare(data.password, data.encrypt_password, (err, same)=>{
            if(err){
                reject(err);
            }
            else if(!same){
                reject(new Error('User and Password does not match'));  
            }
            else{
                resolve(true);  
            }
        });
        });
    } 
    static jwtSign(payload){
        return JWT.sign(
                payload,
                getEnvironmentVariables().jwt_secret_key, 
                {expiresIn: '180d'}
            );
    }
}