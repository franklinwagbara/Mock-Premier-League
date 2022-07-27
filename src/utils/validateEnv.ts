import { cleanEnv, port, str } from "envalid";

export const validateEnv = () => {
  return cleanEnv(process.env, {
    PORT: port(),
    DB_URI: str(),
  });
};
