import { Module } from '@nestjs/common';
import { ExampleController } from './example/example.controller';

@Module({
  controllers: [ExampleController],
})
export class AdminModule {}
