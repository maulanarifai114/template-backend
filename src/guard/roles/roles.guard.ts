import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/services/jwt.service';
import { Roles } from './roles.decorator';
import { PayloadDto } from 'src/types/auth/payload.dto';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';
import { JwtDto } from 'src/types/auth/jwt.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private utilityService: UtilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const token: JwtDto = JSON.parse(request.cookies.jwt ?? '{}'); // Get token from cookie

    if (!token.accessToken) {
      throw this.utilityService.globalResponse({ statusCode: 401, message: 'Unauthorized access' });
    }

    const decoded: PayloadDto = this.jwtService.verifyAccessToken(token.accessToken);

    if (decoded) {
      const role = decoded.role;

      const hasRole = roles.map((a) => a.toLowerCase()).includes(role.name.toLowerCase());
      if (!role || !hasRole) throw this.utilityService.globalResponse({ statusCode: 401, message: 'Unauthorized access for ' + role.name.toLowerCase() });

      request.user = decoded;

      return true;
    } else {
      throw this.utilityService.globalResponse({ statusCode: 401, message: 'User not found' });
    }
  }
}
