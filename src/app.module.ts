import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { GasPriceController } from "./getPrice/gasPrice.controller";
import { UniswapController } from "./uniswap/uniswap.controller";
import { GasPriceService } from "./getPrice/gasPrice.service";
import { UniswapService } from "./uniswap/uniswap.service";

@Module({
  imports: [],
  controllers: [AppController, GasPriceController, UniswapController],
  providers: [GasPriceService, UniswapService],
})
export class AppModule {}
