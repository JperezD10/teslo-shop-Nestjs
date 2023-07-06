import { Controller, Post, Body, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    return await this.authService.login(loginUserDto);
  }

  @Get('private')
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testToken(
    @GetUser() user: User
  ){
    return {
      ok: true,
      message: 'You can enter',
      user
    }
  }

  @Get('private2')
  @Auth(ValidRoles.superUser, ValidRoles.user)
  testAuth(
    @GetUser() user: User
  ){
    return {
      ok: true,
      message: 'You can enter',
      user
    }
  }

  @Get('check-status')
  @Auth()
  async cheackAuthStatus(
    @GetUser() user:User
  ){
    return await this.authService.checkAuthStatus(user);
  }

}
