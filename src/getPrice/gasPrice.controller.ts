import { Controller, Get } from "@nestjs/common";
import { GasPriceService } from "./gasPrice.service";

@Controller("gasPrice")
export class GasPriceController {
  constructor(private readonly gasPriceService: GasPriceService) {}

  @Get()
  async getGasPrice() {
    return this.gasPriceService.getGasPrice();
  }
}
