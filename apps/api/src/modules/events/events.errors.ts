import { HttpException, HttpStatus } from '@nestjs/common';

export function eventHttpError(
  status: HttpStatus,
  message: string,
  code: string,
  error = 'Ошибка',
): HttpException {
  return new HttpException(
    {
      statusCode: status,
      message,
      error,
      code,
    },
    status,
  );
}
