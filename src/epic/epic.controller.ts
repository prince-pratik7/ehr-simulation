import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { EpicService } from './epic.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('epic')
export class EpicController {
  constructor(private readonly epicService: EpicService) {}

  @Get('patient')
  // @UseGuards(AuthGuard('jwt'))
  async getPatientData(
    @Req() req,
    @Query('patientId') patientId: string,
  ): Promise<any> {
    return this.epicService.getPatientData(patientId);
  }

  @Get('lab')
  // @UseGuards(AuthGuard('jwt'))
  async getLabData(@Req() req, @Query('labId') labId: string): Promise<any> {
    return this.epicService.getLabData(labId);
  }
}
