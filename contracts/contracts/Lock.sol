// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Socialend {
    struct LoanRequest {
        uint256 id;
        address borrower;
        uint256 worldId;
        uint256 amount;
        uint256 collateral;
        uint256 interest;
        uint256 dueDate;
        bool isFunded;
        bool isExecuted;
    }

    mapping(address => uint256) public outstandingDebts;
    mapping(address => bool) public blacklist;
    mapping(uint256 => LoanRequest) public loanRequests;

    
}