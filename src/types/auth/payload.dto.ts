export class PayloadDto {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  iat?: number;
  exp?: number;
}
