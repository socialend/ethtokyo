// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "contracts/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Socialend {
    address USDC;
    uint256 interestRate;
    constructor(address _USDC, uint256 _interestRate) {
        USDC = _USDC;
        interestRate = _interestRate;  //20%
    }

    struct LoanRequest {
        uint256 id;
        address borrower;
        // uint256 worldId;
        uint256 amount;
        uint256 collateral;
        uint256 interest;
        uint256 remainingAmount;
        uint256 dueDate;
        uint256 lastUpdated;
        bool isFunded;
        bool isExecuted;
    }
    uint256 private requestIdCounter;

    mapping(address => uint256) public outstandingDebts;
    mapping(address => bool) public blacklist;
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(address => uint256) public fundingLoans;
    mapping(uint256 => address) public funder;

    event LoanRequestCreated(
        uint256 id,
        address borrower,
        uint256 amount,
        uint256 collateral,
        uint256 interest,
        uint256 dueDate
    );

    event LoanRequestDeleted(
        uint256 id,
        address borrower
    );

    function createLoanRequest(
        // uint256 worldId,
        uint256 amount,
        uint256 collateral,
        uint256 interest,
        uint256 dueDate
    ) public {
        require(blacklist[msg.sender] == false, "You are in blacklist");

        // uint256 collateralRatio = amount / collateral;

        //TODO : Get Lens followers and compute social score
        //TODO : Check social score is met the rewquirement

        requestIdCounter++;

        IERC20(USDC).transferFrom(msg.sender, address(this), amount);

        LoanRequest memory newLoanRequest = LoanRequest(
            requestIdCounter,
            msg.sender,
            // worldId,
            amount,
            collateral,
            interest,
            amount,
            dueDate,
            block.timestamp,
            false,
            false
        );

        loanRequests[requestIdCounter] = newLoanRequest;
        emit LoanRequestCreated(
            requestIdCounter,
            msg.sender,
            amount,
            collateral,
            interest,
            dueDate
        );
    }

    function deleteLoanRequest(uint256 id) public {
        require(
            loanRequests[id].isFunded == false,
            "This loan has already been funded"
        );
        require(
            loanRequests[id].borrower == msg.sender,
            "You are not the borrower of this loan"
        );
        delete loanRequests[id];
        emit LoanRequestDeleted(id, msg.sender);
    }

    function fundLoanRequest(uint256 requestId) public {
        LoanRequest storage request = loanRequests[requestId];
        require(!request.isFunded, "Loan request is already funded.");
        require(!request.isExecuted, "Loan request is already executed.");

        // トークンを貸し手から借り手に送る
        IERC20(USDC).transferFrom(msg.sender, request.borrower, request.amount);
        request.isFunded = true;

        funder[requestId] = msg.sender;

        // 追加のロジック（担保のロック、返済のスケジューリングなど）
    }

    function repayLoan(uint256 requestId, uint256 amount) public {
        LoanRequest storage request = loanRequests[requestId];
        require(request.borrower == msg.sender);
        require(request.isFunded, "Loan request is not funded.");
        require(!request.isExecuted, "Loan request is already executed.");
        
        IERC20(USDC).transferFrom(msg.sender, funder[requestId], amount);
        
        uint256 interest = calculateInterest(request.remainingAmount, request.lastUpdated);
        request.remainingAmount += interest;
        request.remainingAmount -= amount;

        if(request.remainingAmount == 0 ) {
            request.isExecuted = true;
            IERC20(USDC).transfer(msg.sender, request.collateral);
        }
    }

    function liquidateCollateral(uint256 requestId) public {
        LoanRequest storage request = loanRequests[requestId];
        require(request.isFunded, "Loan request is not funded.");
        require(!request.isExecuted, "This request is already executed.");
        require(request.dueDate < block.timestamp, "Before deadline");
        require(request.remainingAmount != 0, "");
        
        // 未返却資産を追跡し、ブラックリストに追加
        outstandingDebts[request.borrower] += request.remainingAmount;
        blacklist[request.borrower] = true;

        IERC20(USDC).transfer(msg.sender, request.collateral);

        request.isExecuted = true;
    }

    function calculateInterest(
        uint256 remainingAmount,
        uint256 lastUpdatedTimestamp
    ) internal view returns (uint256) {
        // Calculate the time difference between the current timestamp and the last updated timestamp
        uint256 timeDifference = (block.timestamp - lastUpdatedTimestamp) * 10000000;
        console.log(timeDifference, "timeDifference");

        // Convert the time difference from seconds to years
        uint256 timeDifferenceInYears = timeDifference / (365 * 24 * 60 * 60);
        console.log(timeDifferenceInYears, "timeDifferenceInYears");

        // Calculate the interest amount
        uint256 interestAmount = (remainingAmount * interestRate * timeDifferenceInYears) / 1000000000;
        console.log(interestAmount, "interestAmount");

        return interestAmount;
    }

    function getLoanRequest(uint256 requestId) public view returns (LoanRequest memory){
        LoanRequest storage request = loanRequests[requestId];
        return request;
    }

    function getFunder(uint256 requestId) public view returns(address funderAddress) {
        funderAddress = funder[requestId];
    }

    function getRemainingAmount(uint256 requestId) public view returns(uint256 remainingAmount) {
        LoanRequest storage request = loanRequests[requestId];
        uint256 interest = calculateInterest(request.remainingAmount, request.lastUpdated);
        remainingAmount = request.remainingAmount + interest;
    }
}