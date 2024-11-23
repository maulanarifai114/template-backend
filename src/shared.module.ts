import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';

@Global()
@Module({
  imports: [JwtModule],
  providers: [PrismaService, UtilityService, JwtService],
  exports: [JwtModule, PrismaService, UtilityService, JwtService],
})
export class SharedModule {}
