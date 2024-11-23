import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { AuthModule } from './controller/auth/auth.module';
import { GlobalModule } from './controller/global/global.module';
import { SharedModule } from './shared.module';
import { PublicModule } from './controller/public/public.module';
import { AdminModule } from './controller/admin/admin.module';
import { UserModule } from './controller/user/user.module';

@Module({
  imports: [
    // Module
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module global
      envFilePath: ['.env'], // Optional: Load environment variables from a .env file
    }),
    RouterModule.register([
      {
        path: 'v1/auth',
        module: AuthModule,
      },
      {
        path: 'v1/admin',
        module: AdminModule,
      },
      {
        path: 'v1/user',
        module: UserModule,
      },
      {
        path: 'v1/public',
        module: PublicModule,
      },
      {
        path: 'v1',
        module: GlobalModule,
      },
    ]),
    SharedModule,

    // Controller
    AuthModule,
    GlobalModule,
    PublicModule,
    AdminModule,
    UserModule,
  ],
})
export class AppModule {}
