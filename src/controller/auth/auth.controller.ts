import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Req, Res } from '@nestjs/common';

import { UtilityService } from 'src/services/utility.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from 'src/services/jwt.service';
import { AuthDto } from 'src/types/auth/auth.dto';
import { Request, Response } from 'express';
import { JwtDto } from 'src/types/auth/jwt.dto';
import * as dayjs from 'dayjs';

@Controller()
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
    private jwtService: JwtService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: AuthDto, @Res() res: Response) {
    let { email, password } = body;
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await this.prismaService.user.findFirst({
      where: { Email: email },
      include: { Role: true },
    });
    if (!user)
      return this.utilityService.globalResponse({
        statusCode: 404,
        message: 'User not found',
      });

    const isPasswordValid = this.utilityService.comparePassword(password, user.Password);
    if (!isPasswordValid)
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: 'Password Invalid',
      });

    const token = this.jwtService.generateTokens({
      id: user.Id,
      email,
      role: {
        id: user.Role.Id,
        name: user.Role.Name,
      },
    });

    this.jwtService.setTokenCookie(res, JSON.stringify(token));

    return this.utilityService.globalResponse({
      res,
      statusCode: 200,
      message: 'Sign in successfully',
      data: {
        role: {
          id: user.Role.Id,
          name: user.Role.Name,
        },
      },
    });
  }

  @Post('sign-out')
  async signOut(@Res() res: Response) {
    this.jwtService.clearTokenCookie(res);

    return this.utilityService.globalResponse({
      res,
      statusCode: 200,
      message: 'Sign out successfully',
    });
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: AuthDto) {
    let { email, password, firstName, lastName } = body;
    email = email.trim().toLowerCase();
    password = password.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();

    if (!firstName)
      return this.utilityService.globalResponse({
        statusCode: 409,
        message: 'First Name cannot empty',
      });

    const dbUser = await this.prismaService.user.findFirst({
      where: { Email: email },
    });
    if (dbUser)
      return this.utilityService.globalResponse({
        statusCode: 409,
        message: 'Email already exists',
      });

    const messagePassword = this.utilityService.validatePassword(password);
    if (messagePassword)
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: messagePassword,
      });

    const hashedPassword = this.utilityService.hashPassword(password);

    await this.prismaService.user.create({
      data: {
        Id: this.utilityService.generateId(),
        Email: email,
        Password: hashedPassword,
        FirstName: firstName,
        LastName: lastName,
        RoleId: '4',
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 201,
      message: 'User Created',
    });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const jwt: JwtDto = JSON.parse(req.cookies.jwt ?? '{}');
    try {
      const decoded = this.jwtService.verifyRefreshToken(jwt.refreshToken);
      delete decoded.iat;
      delete decoded.exp;
      const token = this.jwtService.generateTokens(decoded);
      this.jwtService.setTokenCookie(res, JSON.stringify(token));

      return this.utilityService.globalResponse({
        res,
        statusCode: 200,
        message: 'Token Refreshed',
      });
    } catch (error) {
      console.log(dayjs().format('ddd DD-MM-YYYY HH:mm:ss') + ' - ' + error.message);
      throw this.utilityService.globalResponse({
        statusCode: 400,
        message: 'Refresh Token Invalid',
      });
    }
  }
}
