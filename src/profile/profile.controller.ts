import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
     @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Req() req) {
    return req.user; 
  }
}
