import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class GasPriceService {
  private provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/e89d286f38f848c885d1fb6fdda37b13"
  );

  async getGasPrice() {
    const feeData = await this.provider.getFeeData();
    return {
      gasPrice: feeData.gasPrice?.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
    };
  }
}
