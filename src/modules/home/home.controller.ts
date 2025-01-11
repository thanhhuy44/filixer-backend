import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHome() {
    const data = await this.homeService.getHome();
    return { data };
  }
}
