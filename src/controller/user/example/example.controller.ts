import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';
import { Role } from 'src/guard/roles/roles.enum';
import { Roles } from 'src/guard/roles/roles.decorator';
import { ExampleCreateDto, ExampleListDto } from 'src/types/controller/admin/example.dto';
import { RolesGuard } from 'src/guard/roles/roles.guard';

@Controller('example')
@UseGuards(RolesGuard)
export class ExampleController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.USER])
  async listExample(@Req() request: Request, @Query('search') search: string, @Query('page') page: number, @Query('totalPage') totalPage: number) {
    const user = request.user;

    return this.utilityService.globalResponse<{ user: any; list: ExampleListDto[]; total: number; query: { search: string; page: number; totalPage: number } }>({
      data: { user: user, list: [], total: 0, query: { search, page, totalPage } },
      message: 'Success',
      statusCode: 200,
    });
  }

  @Get('detail/:id')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.USER])
  async detailExample(@Req() request: Request, @Param('id') id: string) {
    const user = request.user;

    return this.utilityService.globalResponse<{ user: any; id: string }>({
      data: { user: user, id },
      message: 'Success',
      statusCode: 200,
    });
  }

  @Post('save')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.USER])
  async saveExample(@Req() request: Request, @Body() body: ExampleCreateDto) {
    const user = request.user;

    return this.utilityService.globalResponse<{ user: any; body: ExampleCreateDto }>({
      data: { user, body },
      message: 'Success',
      statusCode: 200,
    });
  }

  @Post('delete')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.USER])
  async deleteExample(@Req() request: Request, @Body() body: string[]) {
    const user = request.user;

    return this.utilityService.globalResponse<{ user: any; body: string[] }>({
      data: { user, body },
      message: 'Success',
      statusCode: 200,
    });
  }
}
