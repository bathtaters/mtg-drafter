import { pbkdf2 } from "crypto";
import { config } from "dotenv";

export const hash = (password: string, salt: string) =>
  new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });

export const validate = (password: string, salt: string, hash: string) =>
  new Promise<boolean>((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      else resolve(hash === key.toString("hex"));
    });
  });

export function getWatchSalt() {
  config(); // Load .env

  const salt = process.env.WATCH_SALT;
  if (typeof salt !== "string" || salt.length < 32 || /[^0-9a-f]/.test(salt))
    throw new Error(
      `Missing or invalid WATCH_SALT from .env (Must be a random lower case hex digit w/ at least 32 characters).`
    );

  return salt;
}
