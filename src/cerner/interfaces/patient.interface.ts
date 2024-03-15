export interface PatientInterface {
  id: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  labResults: {
    id: string;
    name: string;
    result: string;
    date: Date;
  }[];
}
