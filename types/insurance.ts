export interface Insurance {
  _id: string;
  name: string;
  phone: string;
  tuition: string;
  type: string;
  expirationDate: string;
  reminderSent: boolean;
}

export interface CreateInsuranceRequest {
  name: string;
  phone: string;
  tuition: string;
  type: string;
  expirationDate: string;
}

export interface UpdateInsuranceRequest {
  name?: string;
  phone?: string;
  tuition?: string;
  type?: string;
  expirationDate?: string;
}
