import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidateHostNameMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // const allowedHostnames = process.env.HOSTNAME.split(',');
    // const hostname = req.headers.host;
    // if (!allowedHostnames.includes(hostname)) {
    //   throw new ForbiddenException();
    // }
    next();
  }
}
