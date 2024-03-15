import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
@Injectable()
export class EpicService {
  private epicBaseUrl: string;
  private clientId: string;
  private redirectUri: string;

  constructor() {
    dotenv.config();
    this.epicBaseUrl =
      process.env.EPIC_BASE_URL ||
      'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
    this.clientId = process.env.EPIC_CLIENT_ID;
    this.redirectUri = process.env.EPIC_REDIRECT_URI;
  }

  async getPatientData(patientId: string): Promise<any> {
    const accessToken = process.env.EPIC_ACCESS_TOKEN;
    console.log('accessToken', this.epicBaseUrl);

    const response = await fetch(`${this.epicBaseUrl}/Patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('response', response);
    // const response = {
    //   status: 200,

    //   json: () =>
    //     Promise.resolve({
    //       data: {
    //         id: '123',
    //         name: 'John Doe',
    //         age: 30,
    //         gender: 'Male',
    //         address: '123 Main St, Anytown, CA 12345',
    //         phone: '555-555-5555',
    //         email: 'johndoe@example.com',
    //         labResults: [
    //           {
    //             id: '1',
    //             name: 'Lipid Panel',
    //             result: 'Normal',
    //             date: new Date(),
    //           },
    //           {
    //             id: '2',
    //             name: 'Complete Blood Count (CBC)',
    //             result: 'Normal',
    //             date: new Date(),
    //           },
    //         ],
    //       },
    //     }),
    // };

    if (response.status != 200) {
      throw new Error('Failed to fetch patient data from Cerner');
    }

    const patientData: any = await response.json();
    return patientData;
  }

  async getLabData(labId: string): Promise<any> {
    const accessToken = process.env.EPIC_ACCESS_TOKEN;
    const response = await fetch(`https://api.cerner.com/lab/${labId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lab data from Cerner');
    }

    const labData: any = await response.json();
    return labData;
  }
}
