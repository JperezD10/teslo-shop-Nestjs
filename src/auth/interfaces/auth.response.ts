import { User } from "../entities/user.entity";
import { JwtPayload } from "./jwt-payload.interface";

export interface AuthResponse extends User{
    token: string
}