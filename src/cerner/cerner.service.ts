import { Injectable, Logger } from '@nestjs/common';
import { PatientInterface } from './interfaces/patient.interface';
import * as dotenv from 'dotenv';
import * as fetch from 'node-fetch';
import { extractResources } from 'src/utility';
import { Resource } from 'src/constant';

@Injectable()
export class CernerService {
  private readonly url;
  private readonly scope;
  private readonly clientId;
  private readonly clientSecret;
  private readonly logger = new Logger(CernerService.name);

  /**
   * Constructor to initialize Cerner service with environment variables.
   */
  constructor() {
    dotenv.config();
    this.clientId = process.env.CERNER_CLIENT_ID;
    this.clientSecret = process.env.CERNER_CLIENT_SECRET;
    this.url = process.env.CERNER_URL;
    this.scope = process.env.CERNER_SCOPE;
  }

  /**
   * Retrieves patient data from Cerner service.
   * @param patientId The ID of the patient to retrieve data for.
   * @returns Patient data from Cerner service.
   */
  async getPatientData(patientId: string): Promise<PatientInterface> {
    this.logger.log(
      `Fetching patient data for ID ${patientId} from Cerner service...`,
    );
    const accessToken = await this.getTokenFromCerner();

    const options = {
      method: 'GET',
      url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Patient/${patientId}`,
      headers: {
        Accept: 'application/json',
        Authorization: accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    if (!response.ok) {
      this.logger.error(
        `Failed to fetch patient data from Cerner for ID ${patientId}`,
      );
      throw new Error('Failed to fetch patient data from Cerner');
    }

    const patientData = await response.json();
    return patientData;
  }

  /**
   * Retrieves lab data from Cerner service.
   * @param patientId The ID of the patient to retrieve lab data for.
   * @returns Lab data from Cerner service.
   */
  async fetchObservationData(patientId: string): Promise<Resource[]> {
    this.logger.log(
      `Fetching lab data for ID ${patientId} from Cerner service...`,
    );
    const accessToken = await this.getTokenFromCerner();
    const options = {
      method: 'GET',
      url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Observation?patient=${patientId}`,
      // url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/DiagnosticReport?patient=${patientId}`,
      // & _count=10
      headers: {
        Accept: 'application/json',
        Authorization: accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
    };
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    if (!response.ok) {
      this.logger.error(
        `Failed to fetch lab data from Cerner for ID ${patientId}`,
      );
      throw new Error('Failed to fetch lab data from Cerner');
    }

    const observationData = await response.json();
    const observations = extractResources(observationData, 'Observation');

    return observations;
  }

  /**
   * Retrieves lab data from Cerner service.
   * @param patientId The ID of the patient to retrieve lab data for.
   * @returns Lab data from Cerner service.
   */
  async fetchDiagnosticReportData(patientId: string): Promise<Resource[]> {
    this.logger.log(
      `Fetching lab data for ID ${patientId} from Cerner service...`,
    );
    const accessToken = await this.getTokenFromCerner();
    const options = {
      method: 'GET',
      url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/DiagnosticReport?patient=${patientId}`,
      headers: {
        Accept: 'application/json',
        Authorization: accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
    };
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    if (!response.ok) {
      this.logger.error(
        `Failed to fetch diagnostic data from Cerner for ID ${patientId}`,
      );
      throw new Error('Failed to fetch diagnostic data from Cerner');
    }

    const diagnosticReportData = await response.json();
    const diagnosticReport = extractResources(
      diagnosticReportData,
      'DiagnosticReport',
    );

    return diagnosticReport;
  }

  /**
   * Retrieves access token from Cerner service.
   * @returns Access token from Cerner service.
   */
  async getTokenFromCerner(): Promise<string> {
    try {
      const clientCredentials = `${this.clientId}:${this.clientSecret}`;
      const base64Encoded = Buffer.from(clientCredentials).toString('base64');

      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('scope', this.scope);

      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64Encoded}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
        },
        body: formData.toString(),
      };

      const response = await fetch(this.url, config);
      if (!response.ok) {
        throw new Error('Failed to fetch access token from Cerner');
      }

      const responseData = await response.json();
      return responseData.access_token;
    } catch (error) {
      this.logger.error(
        'Failed to fetch access token from Cerner:',
        error.message,
      );
      throw new Error('Failed to fetch access token from Cerner');
    }
  }
}
