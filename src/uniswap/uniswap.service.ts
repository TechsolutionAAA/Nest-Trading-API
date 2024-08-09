import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";

const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const provider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/e89d286f38f848c885d1fb6fdda37b13"
);
const FactoryABI = [
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "getPair",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const IUniswapV2PairABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { internalType: "uint112", name: "_reserve0", type: "uint112" },
      { internalType: "uint112", name: "_reserve1", type: "uint112" },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

@Injectable()
export class UniswapService {
  // Get pair address for given token addresses
  async getPair(tokenA: string, tokenB: string): Promise<string> {
    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      FactoryABI,
      provider
    );
    try {
      return await factoryContract.getPair(tokenA, tokenB);
    } catch (error) {
      console.error(`Failed to get pair for ${tokenA} and ${tokenB}:`, error);
      throw new Error("Unable to retrieve pair address");
    }
  }

  // Get reserves for a given pair address
  async getReserves(
    pairAddress: string
  ): Promise<{ reserve0: string; reserve1: string }> {
    try {
      const pairContract = new ethers.Contract(
        pairAddress,
        IUniswapV2PairABI,
        provider
      );
      const reserves = await pairContract.getReserves();
      const reserve0 = reserves[0].toString(); // Adjusted indexing
      const reserve1 = reserves[1].toString(); // Adjusted indexing
      return { reserve0, reserve1 };
    } catch (error) {
      console.error(`Failed to get reserves for pair ${pairAddress}:`, error);
      throw new Error("Unable to retrieve reserves");
    }
  }

  // Get estimated return for a given amount
  async getEstimatedReturn(
    fromTokenAddress: string,
    toTokenAddress: string,
    amountIn: string
  ): Promise<{ outputAmount: string }> {
    try {
      const pairAddress = await this.getPair(fromTokenAddress, toTokenAddress);

      if (pairAddress === ethers.ZeroAddress) {
        throw new Error("Pair not found");
      }

      const { reserve0, reserve1 } = await this.getReserves(pairAddress);

      const inputAmount = BigInt(amountIn);
      const inputReserve = BigInt(reserve0);
      const outputReserve = BigInt(reserve1);

      const numerator = inputAmount * outputReserve * 997n;
      const denominator = inputReserve * 1000n + inputAmount * 997n; // Changed `1000n` and `997n` to `1000` and `997` const

      const outputAmount = numerator / denominator;

      return { outputAmount: outputAmount.toString() };
    } catch (error) {
      console.error(
        `Failed to get estimated return for ${amountIn} from ${fromTokenAddress} to ${toTokenAddress}:`,
        error
      );
      throw new Error("Unable to calculate estimated return");
    }
  }
}
