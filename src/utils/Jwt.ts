import { parse } from "node:path";
import * as Bcrypt from 'bcrypt';
import { hash } from "bcrypt";
import * as JWT from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/environment';

export class Jwt{

    static jwtSign(payload){
        const p1={
            // audience =id, iss :'myapp.com'
        };
            return JWT.sign(
                    payload,
                    getEnvironmentVariables().jwt_secret_key, 
                    {expiresIn: '180d', issuer: 'minh.com'}
                );
        }
        static jwtVerify(token : string): Promise<any>{
            return new Promise((resolve, reject)=>{
                JWT.verify(token, getEnvironmentVariables().jwt_secret_key, (err, decoded)=>{
                    if(err) reject(err);
                    else if(!decoded) reject(new Error('Token is not valid'));
                    else resolve(decoded);

                });
            });
        }
    }