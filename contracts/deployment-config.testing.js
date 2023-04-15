// Copyright (c) 2021 Curvegrid Inc.

// Copy and rename this file with the network name (development, test, staging, production) in
// place of "template", as appropriate. For example: deployment-config.staging.js
// DO NOT check credentials into source control.

const config = {
  // Private key of the deployer account, beginning with 0x
  deployerPrivateKey:
    "0x35046882a8e35435b3e0620580c6d40e86ae85f96c0b95bc8f8360e5d4a0be52",

  // Full MultiBaas URL such as https://abc123.multibaas.com
  deploymentEndpoint: "https://kpxwaia6nnabrppiqdi33uvieq.multibaas.com",

  // Web3 endpoint
  // For Curvegrid Test Network, provision a web3 API key and paste it here
  // For Ethereum Mainnet, Sepolia Testnet, Polygon, etc. provide a URL including credentials from
  // a blockchain node provider (Infura, Chainstack, etc.)
  web3Endpoint: "https://alpha-rpc.scroll.io/l2",
    // "https://polygon-mumbai.g.alchemy.com/v2/bDtkZcHKjEo6ZD8BCGW5A0qh4tv10qnh",

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

module.exports = {
  config: config,
};
