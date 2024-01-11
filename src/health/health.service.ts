import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  health() {
    return { status: 'Life is beautiful' };
  }
}
