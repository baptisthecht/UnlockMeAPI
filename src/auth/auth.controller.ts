import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { deleteAccountDto } from './dto/deleteAccount.dto';
import { ApiTags } from '@nestjs/swagger';
import { resendEmailConfirmationDto } from './dto/resendEmailConfirmation.dto';
import { emailConfirmationDto } from './dto/emailConfirmation.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: registerDto) {
    return this.authService.register(registerDto);
  }

  @Post('email-confirmation')
  emailConfirmation(@Body() body: emailConfirmationDto) {
    return this.authService.emailConfirmation(body.email, body.code);
  }

  @Post('login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  @Post('reset-password')
  resetPasswordDemand(@Body() resetPasswordDto: resetPasswordDto) {
    return this.authService.resetPasswordDemand(resetPasswordDto);
  }

  @Post('reset-password-confirmation')
  resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: resetPasswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto,
    );
  }

  @Post('resend-email-confirmation')
  resendEmailConfirmation(@Body() body: resendEmailConfirmationDto) {
    return this.authService.resendEmailConfirmation(body.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-account')
  deleteAccount(
    @Req() request: Request | any,
    @Body() deleteAccountDto: deleteAccountDto,
  ) {
    const userId = request.user['id'];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
