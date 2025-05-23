import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userRefresh: { _id: string; role: string };
    }
  }
}

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    const refreshToken = req.headers['x-refresh-token'] as string;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found!');
    }
    try {
      const verifiedToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
      );
      req.userRefresh = verifiedToken as { _id: string; role: string };
      next();
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
