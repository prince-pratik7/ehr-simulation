import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { CernerService } from './cerner.service';
import { PatientInterface } from './interfaces/patient.interface';
import { Resource } from 'src/constant';
import { AuthGuard } from '@nestjs/passport';

@Controller('Cerner')
export class CernerController {
  constructor(private readonly cernerService: CernerService) {}

  @Get('Patient')
  @UseGuards(AuthGuard('jwt'))
  async getPatientData(
    @Req() req,
    @Query('patientId') patientId: string,
  ): Promise<PatientInterface> {
    return this.cernerService.getPatientData(patientId);
  }

  @Get('Observations')
  @UseGuards(AuthGuard('jwt'))
  async fetchObservationsForPatient(
    @Req() req,
    @Query('patientId') patientId: string,
  ): Promise<Resource[]> {
    return this.cernerService.fetchObservationData(patientId);
  }

  @Get('DiagnosticReports')
  @UseGuards(AuthGuard('jwt'))
  async fetchDiagnosticReportsforPatient(
    @Req() req,
    @Query('patientId') patientId: string,
  ): Promise<Resource[]> {
    return this.cernerService.fetchDiagnosticReportData(patientId);
  }
}
