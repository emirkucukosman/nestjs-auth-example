import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { createHash } from 'crypto';

import { FINGERPRINT_COOKIE_NAME } from '../constants';

@Injectable()
export class RefreshJWTGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const fingerprintCookie = request.cookies[FINGERPRINT_COOKIE_NAME];
    const { fingerprintHash } = request.body;

    if (!fingerprintCookie || !fingerprintHash) {
      return false;
    }

    const fingerprintCookieHash = createHash('sha256')
      .update(fingerprintCookie, 'utf-8')
      .digest('hex');

    return fingerprintHash === fingerprintCookieHash;
  }
}
