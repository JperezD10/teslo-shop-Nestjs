import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { AuthModel } from "../interfaces/auth.interface";

export class CreateUserDto implements AuthModel{
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(5)
    fullName: string;
}