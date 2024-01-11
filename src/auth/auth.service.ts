import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { loginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { deleteAccountDto } from './dto/deleteAccount.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: MailerService,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: registerDto) {
    const { email, password, displayName } = registerDto;
    const userbyEmail = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (userbyEmail) {
      throw new ConflictException('Email already exists');
    }
    const hash = await bcrypt.hash(password, 10);
    const temp_secret = speakeasy.generateSecret();
    await this.prismaService.user.create({
      data: {
        email: email,
        displayName: displayName,
        password: hash,
        temp_secret: temp_secret.base32,
      },
    });
    const code = speakeasy.totp({
      secret: temp_secret.base32,
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });
    await this.emailService.sendRegisterConfirmation(email, code);
    return {
      data: 'User created successfully',
    };
  }

  async resendEmailConfirmation(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('User not exists');
    }
    if (user.email_verified || !user.temp_secret) {
      throw new ForbiddenException('Email already verified');
    }
    const code = speakeasy.totp({
      secret: user.temp_secret,
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });
    await this.emailService.sendRegisterConfirmation(email, code);
    return {
      data: 'Email sent successfully',
    };
  }

  async emailConfirmation(email: string, code: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('User not exists');
    }
    if (!user.temp_secret || user.email_verified) {
      throw new ForbiddenException('Email already verified');
    }
    const match = speakeasy.totp.verify({
      secret: user.temp_secret,
      encoding: 'base32',
      token: code,
      digits: 6,
      step: 60 * 15,
    });
    if (!match) {
      throw new ForbiddenException('Invalid code');
    }
    await this.prismaService.user.update({
      where: { email: email },
      data: { secret: user.temp_secret, temp_secret: null },
    });
    return {
      data: 'Email confirmed successfully',
    };
  }

  async login(loginDto: loginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
      include: {
        withdrawals: {
          select: {
            id: true,
            createdAt: true,
            amount: true,
            status: true,
            RIB: true,
          },
        },

        photos: {
          select: {
            id: true,
            url: true,
            shareLink: true,
            createdAt: true,
            price: true,
            priceForSeller: true,
            sales: true,
            salesCount: true,
          },
        },
        sales: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            priceForSeller: true,
            photo: {
              select: {
                id: true,
                url: true,
                shareLink: true,
                createdAt: true,
                price: true,
                priceForSeller: true,
                sales: true,
                salesCount: true,
              },
            },
            buyerEmail: true,
            buyerName: true,
            status: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = this.JwtService.sign(payload, {
      expiresIn: '365d',
      secret: this.configService.get('JWT_SECRET'),
    });
    const fieldsToRemove = ['password', 'temp_secret', 'secret'];
    const userWithoutSensitive = Object.fromEntries(
      Object.entries(user).filter(([key]) => !fieldsToRemove.includes(key)),
    );
    return {
      token,
      user: userWithoutSensitive,
      data: 'Logged in successfully',
      success: true,
    };
  }

  async resetPasswordDemand(resetPasswordDto: resetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    if (!user.secret) {
      throw new ForbiddenException(
        'You must have a verified email to reset your password',
      );
    }
    const code = speakeasy.totp({
      secret: user.secret,
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.emailService.sendResetPassword(user.email, url, code);
    return {
      data: 'Reset password email sent',
    };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: resetPasswordConfirmationDto,
  ) {
    const { email, password, code } = resetPasswordConfirmationDto;
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    if (!user.secret) {
      throw new ForbiddenException(
        'You must have a verified email adress to reset your password',
      );
    }
    const match = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: code,
      digits: 6,
      step: 60 * 15, // 15min
    });
    if (!match) {
      throw new UnauthorizedException('Invalid code');
    }
    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({
      where: { email: email },
      data: { password: hash },
    });
    return {
      data: 'Password updated successfully',
    };
  }

  async deleteAccount(userId: number, deleteAccountDto: deleteAccountDto) {
    const { password } = deleteAccountDto;
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid password');
    }
    await this.prismaService.user.delete({
      where: { id: userId },
    });
    return {
      data: 'Account deleted successfully',
    };
  }
}
