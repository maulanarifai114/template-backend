import { Module } from '@nestjs/common';
import { ProfileController } from './profile/profile.controller';

@Module({
  controllers: [ProfileController],
})
export class GlobalModule {}
