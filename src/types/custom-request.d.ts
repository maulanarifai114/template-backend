// custom.d.ts
import { PayloadDto } from 'src/types/auth/payload.dto';

declare module 'express' {
  interface Request {
    user?: PayloadDto;
  }
}
