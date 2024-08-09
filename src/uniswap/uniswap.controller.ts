import { Controller, Get, Param, BadRequestException } from "@nestjs/common";
import { UniswapService } from "./uniswap.service";
import { getAddress } from "ethers"; // Importing getAddress from ethers library
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("return")
@ApiTags("Uniswap") // Tagging for grouping in Swagger UI
export class UniswapController {
  constructor(private readonly uniswapService: UniswapService) {}

  @Get(":fromTokenAddress/:toTokenAddress/:amountIn")
  @ApiParam({
    name: "fromTokenAddress",
    required: true,
    description: "The address of the token to swap from",
  })
  @ApiParam({
    name: "toTokenAddress",
    required: true,
    description: "The address of the token to swap to",
  })
  @ApiParam({
    name: "amountIn",
    required: true,
    description: "The amount of tokens to swap",
  })
  @ApiResponse({
    status: 200,
    description: "The estimated return for the given parameters.",
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async getReturn(
    @Param("fromTokenAddress") fromTokenAddress: string,
    @Param("toTokenAddress") toTokenAddress: string,
    @Param("amountIn") amountIn: string
  ) {
    try {
      // Validate Ethereum addresses
      const validFromTokenAddress = getAddress(fromTokenAddress);
      const validToTokenAddress = getAddress(toTokenAddress);

      if (isNaN(Number(amountIn))) {
        throw new BadRequestException("amountIn must be a number");
      }

      const estimatedReturn = await this.uniswapService.getEstimatedReturn(
        validFromTokenAddress,
        validToTokenAddress,
        amountIn
      );

      console.log(`estimatedReturn: ${JSON.stringify(estimatedReturn)}`);

      return estimatedReturn;
    } catch (error) {
      console.error("Error:", error.message);
      throw new BadRequestException(error.message);
    }
  }
}
