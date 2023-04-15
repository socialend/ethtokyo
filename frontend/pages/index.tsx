import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { BigNumber, ethers } from "ethers";

// import {
//   LoginButton,
//   WhenLoggedInWithProfile,
// } from "../../archives/components/index_archive";

import {
  Heading,
  Box,
  Button,
  ButtonGroup,
  IconButton,
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

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

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
                      <Button key="list" colorScheme="black" variant="outline">
                        List
                      </Button>
                    </Link>
                    <Link href="/createloan">
                      <Button>Create Loan</Button>
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

      {/* <LoginButton />
      <WhenLoggedInWithProfile>
        {({ profile }) => <div>{`Welcome @${profile.handle}`}</div>}
      </WhenLoggedInWithProfile> */}
      <h1 className={styles.title}>Welcome to KIZUNA Protocol</h1>
      <Link href="/" color="blue.400" _hover={{ color: "blue.500" }}>
        About
      </Link>
      <Heading>
        <Text>Lending List</Text>
      </Heading>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Asset</Th>
              <Th>Amount</Th>
              <Th>Collateral</Th>
              <Th>APY</Th>
              <Th>DueDate</Th>
              <Th>Lend</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Image
                  src="./usd-coin-usdc-logo.png"
                  boxSize="50px"
                  alt="Dan Abramov"
                />
              </Td>
              <Td>USDC</Td>
              <Td>72.85</Td>
              <Td>75.4%</Td>
              <Td>20%</Td>
              <Td>2023-06-31</Td>
              <Td>
                <Button as="a" href="/">
                  Lend Your USDC
                </Button>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Image
                  src="./usd-coin-usdc-logo.png"
                  boxSize="50px"
                  alt="Dan Abramov"
                />
              </Td>
              <Td>USDC</Td>
              <Td>72.85</Td>
              <Td>75.4%</Td>
              <Td>20%</Td>
              <Td>2023-06-31</Td>
              <Td>
                <Button as="a" href="/">
                  Lend Your USDC
                </Button>
              </Td>
            </Tr>
            <Tr></Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
