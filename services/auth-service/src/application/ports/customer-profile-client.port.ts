export type DefaultAddressInput = {
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  line2?: string;
  provinceCode: number;
  provinceName: string;
  provinceCodename?: string;
  provinceDivisionType?: string;
  wardCode: number;
  wardName: string;
  wardCodename?: string;
  wardDivisionType?: string;
  countryCode: "VN";
  postalCode?: string;
  administrativeVersion: "VN_2025_07";
};

export interface CustomerProfileClient {
  createCustomerProfile(input: {
    tenantId: string;
    authUserId: string;
    name: string;
    email: string | null;
    phoneNumber: string;
    defaultAddress: DefaultAddressInput;
  }): Promise<{ customerProfileId: string }>;
}

export class NoopCustomerProfileClient implements CustomerProfileClient {
  async createCustomerProfile(input: {
    tenantId: string;
    authUserId: string;
    name: string;
    email: string | null;
    phoneNumber: string;
    defaultAddress: DefaultAddressInput;
  }) {
    return { customerProfileId: `${input.tenantId}:${input.authUserId}` };
  }
}
