import { AppError } from "@job-portal/errors";
import type { DefaultAddressInput } from "../ports/customer-profile-client.port.js";

type VietnamWardApiResponse = {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
};

export interface AddressValidationService {
  validateDefaultAddress(address: DefaultAddressInput): Promise<void>;
}

export class VietnamAddressValidationService implements AddressValidationService {
  private readonly baseUrl = process.env.VN_ADDRESS_API_BASE_URL ?? "https://provinces.open-api.vn/api/v2";

  async validateDefaultAddress(address: DefaultAddressInput): Promise<void> {
    if (address.countryCode !== "VN" || address.administrativeVersion !== "VN_2025_07") {
      throw new AppError(400, "Invalid Vietnam administrative address", "AUTH_INVALID_ADDRESS");
    }

    if (process.env.VN_ADDRESS_VALIDATE_MODE !== "live") {
      return;
    }

    const ward = await this.fetchWard(address.wardCode);
    if (ward.province_code !== address.provinceCode) {
      throw new AppError(400, "Ward does not belong to province", "AUTH_INVALID_ADDRESS");
    }
    if (ward.name !== address.wardName) {
      throw new AppError(400, "Ward name does not match administrative code", "AUTH_INVALID_ADDRESS");
    }
  }

  private async fetchWard(code: number): Promise<VietnamWardApiResponse> {
    const response = await fetch(`${this.baseUrl}/w/${code}`);
    if (!response.ok) {
      throw new AppError(400, "Invalid ward code", "AUTH_INVALID_ADDRESS");
    }
    return response.json() as Promise<VietnamWardApiResponse>;
  }
}
