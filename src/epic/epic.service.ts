import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { JWE, JWK } from 'node-jose';
import { join } from 'path';
@Injectable()
export class EpicService {
  private epicBaseUrl: string;
  private clientId: string;
  private redirectUri: string;
  private publicKey: string;
  private privateKey: string;
  private epicTokenEndPoint: string;
  private readonly logger = new Logger(EpicService.name);

  constructor() {
    dotenv.config();

    this.epicBaseUrl =
      process.env.EPIC_BASE_URL ||
      'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
    this.clientId = process.env.EPIC_CLIENT_ID;
    this.redirectUri = process.env.EPIC_REDIRECT_URI;
    this.epicTokenEndPoint = process.env.EPIC_TOKEN_ENDPOINT;

    /** both keys are use to create JWT token for more details refer to epic documentation page
     * https://fhir.epic.com/Documentation?docId=oauth2&section=Creating-Key-Pair
     */

    // const keysFolderPath = join(__dirname, '..', 'keys');
    // this.publicKey = readFileSync(
    //   join(keysFolderPath, 'publickey.pem'),
    //   'utf8',
    // );
    // this.privateKey = readFileSync(
    //   join(keysFolderPath, 'privatekey.pem'),
    //   'utf8',
    // );
  }

  async getPatientData(patientId: string): Promise<any> {
    const accessToken = process.env.EPIC_ACCESS_TOKEN;
    // const accessToken = await this.generateTokenFromEpic();

    const config = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Cookie: 'EpicPersistenceCookie=your_cookie_here',
      },
    };
    const response = await fetch(
      `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patientId}`,
      config,
    );

    if (response.status != 200) {
      throw new Error('Failed to fetch patient data from Epic');
    }

    const patientData: any = await response.json();
    return patientData;
  }

  async fetchObservationData(
    patientId: string,
    category: string,
  ): Promise<any> {
    const accessToken = process.env.EPIC_ACCESS_TOKEN;

    const config = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Cookie: 'EpicPersistenceCookie=your_cookie_here',
      },
    };
    const response = await fetch(
      `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation?patient=${patientId}&category=${category}`,
      config,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lab data from Epic API');
    }

    const labData: any = await response.json();
    return labData;
  }

  /*
    Note: t understand the logic of generateTokenFromEpic method please refer for the  below documentation
    https://fhir.epic.com/Documentation?docId=oauth2&section=Creating-Key-Pair
   */
  async generateTokenFromEpic() {
    const data = new URLSearchParams({
      grant_type: 'client_credentials',
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: await this.generateJWTToken(),
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'EpicPersistenceCookie=!3sqTIHr2WktiNbU3O0o5OvuHB8JfpnXFLHwdDykUorxOdwaqGosUIvFFczM1tzUztxobWtQr03ZlZEY=',
      },
      body: data,
    };

    try {
      const response = await fetch(`${this.epicTokenEndPoint}`, requestOptions);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch access token. Status: ${response.status} ${response.statusText}`,
        );
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error fetching access token: ${error.message}`);
    }
  }

  async generateJWTToken(): Promise<string> {
    try {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      const expirationTime = currentTime + 300; // Add 5 minutes (300 seconds)

      const payload = {
        iat: currentTime,
        iss: 'e98765dd-33de-4464-b010-4877654589a6', //client_id_of_backend_application_created_in_cerner_console
        sub: 'e98765dd-33de-4464-b010-4877654589a6', //client_id_of_backend_application_created_in_cerner_console
        aud: `${this.epicTokenEndPoint}`,
        exp: expirationTime,
        jti: '0b2f6f14-18de-5555-bd25-e3d384fa0e5d',
      };

      const key = await this.createKey();
      const encryptedToken = await this.encryptPayload(payload, key);
      return encryptedToken.toString();
    } catch (error) {
      this.logger.error(`Failed to generate JWT token: ${error.message}`);
      throw new Error('Token generation failed');
    }
  }

  private async createKey() {
    const keyStore = JWK.createKeyStore();
    const rsaKey = {
      kty: 'RSA',
      n: this.publicKey,
      e: 'AQAB', // Public exponent, usually 'AQAB' for RSA
    };

    return await keyStore.add({
      key: rsaKey,
      secret: this.privateKey,
    });
  }

  private async encryptPayload(payload: any, key: any) {
    return await JWE.createEncrypt({ format: 'compact' }, key)
      .update(JSON.stringify(payload))
      .final();
  }
}
