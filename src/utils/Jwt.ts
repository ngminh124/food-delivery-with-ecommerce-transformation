import { parse } from "node:path";
import * as Bcrypt from "bcrypt";
import { hash } from "bcrypt";
import * as JWT from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";
import * as Crypto from "crypto";

export class Jwt {
  static jwtSign(payload, userId) {
    // const p1={
    //     // audience =id, iss :'myapp.com'
    // };
    // Jwt.gen_secret_key();
    return JWT.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: "1h",
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

  static jwtSignRefreshToken(payload, userId) {
    const p1 = {
      // audience =id, iss :'myapp.com'
    };
    return JWT.sign(payload, getEnvironmentVariables().jwt_refresh_secret_key, {
      expiresIn: "1y",
      audience: userId.toString(),
      issuer: "minh.com",
    });
  }
  static jwtVerifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        token,
        getEnvironmentVariables().jwt_refresh_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("Token is not valid"));
          else resolve(decoded);
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
