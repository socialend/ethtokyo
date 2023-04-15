import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";
import "hardhat-multibaas-plugin";
import { infuraId, portalId, polygonscanApiKey } from "./lib/env";

const quicknode = process.env.QUICKNODE_API_KEY || "";
const URL = `https://evocative-methodical-general.matic-testnet.discover.quiknode.pro/${quicknode}/`;
const accounts = [
  "35046882a8e35435b3e0620580c6d40e86ae85f96c0b95bc8f8360e5d4a0be52",
];

const aaaaa: any = {
  // Private key of the deployer account, beginning with 0x
  deployerPrivateKey:
    "0x35046882a8e35435b3e0620580c6d40e86ae85f96c0b95bc8f8360e5d4a0be52",

  // Full MultiBaas URL such as https://abc123.multibaas.com
  deploymentEndpoint: "https://kpxwaia6nnabrppiqdi33uvieq.multibaas.com",

  // Web3 endpoint
  // For Curvegrid Test Network, provision a web3 API key and paste it here
  // For Ethereum Mainnet, Sepolia Testnet, Polygon, etc. provide a URL including credentials from
  // a blockchain node provider (Infura, Chainstack, etc.)
  web3Endpoint:"https://polygon-mumbai.g.alchemy.com/v2/bDtkZcHKjEo6ZD8BCGW5A0qh4tv10qnh",

  // API key to access MultiBaas from deployer
  // Note that the API key MUST be part of the "Administrators" group
  // Create one on MultiBaas via navigation bar > Admin > API Keys
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YWQxODZjMy01ZDMwLTRhODYtYWEwNy02MmMyNjU2NTMzNmIiLCJpYXQiOjE2ODE1NDAyMzYsInN1YiI6IjEifQ.Q4rylBTUdzoR2CNS_covIgfvAN3DIJ9DzAwkgk67BdA",

  // The chain ID of the blockchain network
  // For example: Curvegrid test network = 2017072401, Ethereum Mainnet = 1, Sepolia = 11155111, Polygon Mainnet = 137, Polygon Mumbai = 80001
  // Only required if not specified in hardhat.config.js
  ethChainID: 80001,

  // The address of the HSM to be setup with signing permissions on the contract
  hsmAddress: "<HSM ADDRESS>",
};

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    polygonMumbai: {
      chainId: 80001,
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts,
    },
    scroll: {
      chainId: 534353,
      url: "https://alpha-rpc.scroll.io/l2",
      accounts,
    },
    linea: {
      chainId: 59140,
      url: "https://rpc.goerli.linea.build/",
      accounts
    },
  },
  dependencyCompiler: {
    paths: [
      "@appliedzkp/semaphore-contracts/base/Verifier.sol",
      "@worldcoin/world-id-contracts/src/Semaphore.sol",
    ],
  },
  etherscan: {
    apiKey: "PP5CWFS219CKDW2NQIE832B98G7HBRYG83",
    // apiKey: {
    //   goerli: "Z1TKKCFKK9GTVJ3FZP3IA4K8SINX16NCJ3",
    //   polygonMumbai: "PP5CWFS219CKDW2NQIE832B98G7HBRYG83",
    //   moonbaseAlpha: "J91J9C15UUQIZRVGQ6FYVBZW5219XEBYRE",
    // },
  },
  mbConfig: {
    apiKey: aaaaa.apiKey,
    host: aaaaa.deploymentEndpoint,
    allowUpdateAddress: ["development", "testing", "staging"],
    allowUpdateContract: ["development", "testing", "staging"],
  },
};

export default config;
