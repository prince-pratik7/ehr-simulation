import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { EpicService } from './epic.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('Epic')
export class EpicController {
  constructor(private readonly epicService: EpicService) {}

  @Get('Patient')
  // @UseGuards(AuthGuard('jwt'))
  async getPatientData(
    @Req() req,
    @Query('patientId') patientId: string,
  ): Promise<any> {
    return this.epicService.getPatientData(patientId);
  }

  @Get('Observation')
  // @UseGuards(AuthGuard('jwt'))
  async fetchObservationsForPatient(
    @Req() req,
    @Query('patientId') patientId: string,
    @Query('category') category: string,
  ): Promise<any> {
    return this.epicService.fetchObservationData(patientId, category);
  }
}
