import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useCallback } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";

import {
  Heading,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Container,
  Text,
  Link,
  Flex,
  Spacer,
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  HStack,
  Image,
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { KizunaAbi } from "../lib/abi";
import { ERC20ABI } from "../lib/ERC20abi";

const abi = ethers.utils.defaultAbiCoder;

import { useSigner, useNetwork, useAccount } from "wagmi";

const Home: NextPage = () => {
  const [amount, setAmount] = useState("");
  const [collateral, setCollateral] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");
  const [root, setRoot] = useState("");
  const [proof, setProof] = useState<string[]>([]);
  const contractAddress = "0xEaC22E146E48E38A37A892AD66B7fE3d57874AAe";
  const USDCContractAddress = "0xE097d6B3100777DC31B34dC2c58fB524C2e76921";
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  console.log(dueDate, "dueDate");

  const onSuccess = async (result: ISuccessResult) => {
    console.log(result);
    const { proof, merkle_root, nullifier_hash } = result;
    console.log(proof, "proof");
    console.log(merkle_root, "merkle_root");
    console.log(nullifier_hash, "nullifier_hash");
    handleWorldcoinParameteres(merkle_root, nullifier_hash, proof);
  };
  const app_id = process.env.NEXT_PUBLIC_APP_ID || "";
  const app_id_dev =
    process.env.NEXT_PUBLIC_APP_ID_DEV ||
    "app_staging_7822955fc8648ea2c6dc374ae4decf2c";

  const handleAmountChange = (e: any) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };
  const handleCollateralChange = (e: any) => {
    const inputValue = e.target.value;
    setCollateral(inputValue);
  };
  const handleDueDateChange = (e: any) => {
    const inputValue = e.target.value;
    const dateObject = new Date(inputValue);
    const timestamp = dateObject.getTime();
    setDueDate(timestamp.toString());
  };

  const handleWorldcoinParameteres = (
    _root: string,
    _nullifyHash: string,
    _proof: string
  ) => {
    setNullifierHash(_nullifyHash);
    setRoot(_root);
    const unpackedProof = abi.decode(["uint256[8]"], _proof)[0];
    // const newArray = unpackedProof.map((item: BigNumber) => {
    //   return item.toHexString();
    // });
    setProof(unpackedProof);
  };

  const createLoanRequest = async () => {
    if (!signer) return;
    const overrides = {
      gasLimit: ethers.utils.hexlify(200000),
    };
    console.log(address);
    console.log(signer);
    console.log("create loan request");
    const USDCcontract = new ethers.Contract(
      USDCContractAddress,
      ERC20ABI,
      signer
    );
    console.log("Approving USDC");
    const aptx = await USDCcontract.approve(contractAddress, amount, overrides);
    console.log(aptx, "aptx");
    const contract = new ethers.Contract(contractAddress, KizunaAbi, signer);
    console.log(amount, "amount");
    console.log(collateral, "collateral");
    console.log(dueDate, "dueDate");
    console.log(root, "root");
    console.log(nullifierHash, "nullifierHash");
    console.log(proof, "proof");
    const tx = await contract.createLoanRequest(
      amount,
      collateral,
      dueDate,
      root,
      nullifierHash,
      proof
    );
    console.log(tx);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Box as="section" pb={{ base: "12", md: "24" }} p="3">
          <Box as="nav" bg="bg-surface" boxShadow="sm">
            <Flex>
              <Button as="a" href="/">
                KIZUNA Protocol
              </Button>
              <Spacer></Spacer>
              <ConnectButton />
            </Flex>
            <Container py={{ base: "4", lg: "5" }}>
              <HStack spacing="5" justify="space-between">
                <Flex justify="center" flex="1">
                  <ButtonGroup variant="link" spacing="100">
                    <Link href="/list">
                      <Button key="list">List</Button>
                    </Link>
                    <Link href="/createloan">
                      <Button
                        key="create"
                        colorScheme="black"
                        variant="outline"
                      >
                        Create Loan
                      </Button>
                    </Link>
                    <Link href="/yourpool">
                      <Button>Your Pool</Button>
                    </Link>
                  </ButtonGroup>
                </Flex>
              </HStack>
            </Container>
          </Box>
        </Box>
      </header>

      <main className={styles.main}>
        <Text>Request Amount</Text>
        <Input onChange={handleAmountChange}></Input>

        <Text>Bond</Text>
        <Input onChange={handleCollateralChange}></Input>

        <Text>Deadline</Text>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          onChange={handleDueDateChange}
        />
        {/* <Input></Input> */}

        <IDKitWidget
          action=""
          signal={address}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          app_id={app_id_dev}
          theme="light"
          // walletConnectProjectId="get_this_from_walletconnect_portal"
        >
          {({ open }) => <Button onClick={open}>World ID</Button>}
        </IDKitWidget>

        <Button onClick={createLoanRequest}>Create Loan Request</Button>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
