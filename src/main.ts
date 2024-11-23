import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { TrimPipe } from './pipes/trim/trim.pipe';
import { DefaultPaginationPipe } from './pipes/default-pagination/default-pagination.pipe';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true,
    },
  });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  app.use(cookieParser());
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new DefaultPaginationPipe());
  await app.listen(port);
}
bootstrap();
