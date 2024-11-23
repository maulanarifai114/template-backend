import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';

@Controller('profile')
@UseGuards(RolesGuard)
export class ProfileController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Get('detail')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.USER])
  async getProfile(@Req() request: Request) {
    const user = request.user;
    const dbUser = await this.prismaService.user.findUnique({
      where: {
        Id: user.id,
      },
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Avatar: true,
        Role: true,
      },
    });

    if (!dbUser) {
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: 'User not found',
      });
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success Get Profile',
      data: {
        id: dbUser.Id,
        firstName: dbUser.FirstName,
        lastName: dbUser.LastName,
        avatar: dbUser.Avatar,
        role: {
          id: dbUser.Role.Id,
          name: dbUser.Role.Name,
        },
      },
    });
  }
}
