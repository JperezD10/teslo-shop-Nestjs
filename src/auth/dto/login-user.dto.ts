import { IsEmail, IsString } from "class-validator";
import { AuthModel } from "../interfaces/auth.interface";

export class LoginDto implements AuthModel{
    @IsString()
    password: string;

    @IsEmail()
    email: string;
}