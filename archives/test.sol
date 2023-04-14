// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

function createLoanRequest() public {

}

function deleteLoanRequest() public {

}
}
