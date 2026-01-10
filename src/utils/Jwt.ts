import * as JWT from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";
import * as Crypto from "crypto";
import { Redis } from "./Redis";

export class Jwt {
  static jwtSign(payload: any, userId: any, expires_in: any = "1h") {
    // const p1={
    //     // audience =id, iss :'myapp.com'
    // };
    // Jwt.gen_secret_key();
    return JWT.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: expires_in,
      audience: userId.toString(),
      issuer: "minh.com",
    });
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("Token is not valid"));
          else resolve(decoded);
        }
      );
    });
  }

  static async jwtSignRefreshToken(
    payload: any,
    userId: any,
    expires_in: any = "1y",
    // redis_ex: number = 60 * 60 * 24 * 365
    redis_ex: number = 20
  ) {
    try {
      const refresh_token = JWT.sign(
        payload,
        getEnvironmentVariables().jwt_refresh_secret_key,
        {
          expiresIn: expires_in,
          audience: userId.toString(),
          issuer: "minh.com",
        }
      );
      //set refresh token in redis with userId as key
      await Redis.setValue(userId.toString(), refresh_token, redis_ex);
      return refresh_token;
    } catch (e) {
      // throw new Error('Cannot sign refresh token');
      throw e;
    }
    // const p1 = {
    //   // audience =id, iss :'myapp.com'
    // };
  }

  static jwtVerifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        token,
        getEnvironmentVariables().jwt_refresh_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("User is not authorized"));
          // else resolve(decoded);
          else {
            //match refresh token from redis
            const user: any = decoded;
            //get token to match
            Redis.getValue(user.aud)
              .then((value) => {
                if (value === token) {
                  resolve(decoded);
                } else {
                  reject(
                    new Error("Your Session has expired. Please login again...")
                  );
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
        }
      );
    });
  }

  private static gen_secret_key() {
    const DEV_access_token_secret_key = Crypto.randomBytes(32).toString("hex");
    const DEV_refresh_token_secret_key = Crypto.randomBytes(32).toString("hex");

    const PROD_access_token_secret_key = Crypto.randomBytes(32).toString("hex");
    const PROD_refresh_token_secret_key =
      Crypto.randomBytes(32).toString("hex");

    console.table({
      DEV_access_token_secret_key,
      DEV_refresh_token_secret_key,
      PROD_access_token_secret_key,
      PROD_refresh_token_secret_key,
    });
  }
}
