import jwt from "jsonwebtoken";
import { config } from "../config/config";
import Logging from "../library/Logging";
import { IEmployee, IEmployeeModel } from "../models/Employee";

const NAMESPACE = "Auth";

const signJWT = (
  employee: IEmployeeModel,
  callback: (error: Error | null, token: string | null) => void
): void => {
  var timeSinchEpoch = new Date().getTime();
  var expirationTime =
    timeSinchEpoch + Number(config.server.token.expireTime) * 100000;
  var expirationTimeInSecond = Math.floor(expirationTime / 1000);

  Logging.info(`${NAMESPACE} Attempting to sign token for ${employee.login}`);

  try {
    jwt.sign(
      {
        employeeId: employee._id,
        employeeLogin: employee.login,
        employeePermission: employee.jobPosition,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSecond,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error: any) {
    Logging.error(`${NAMESPACE} ${error}`);
    callback(error, null);
  }
};

export default signJWT;
