// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundedTipDistribution {
    address public owner;

    event ContractFunded(address indexed funder, uint256 amount);
    event TipSent(address indexed sender, address indexed provider, uint256 amount);

    // Payable constructor to allow funding at deployment
    constructor() payable {
        require(msg.value > 0, "Deployment funding must be greater than zero");
        owner = msg.sender;
        emit ContractFunded(msg.sender, msg.value);
    }

    // Modifier to restrict access to owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Allow the contract to receive Ether
    receive() external payable {
        emit ContractFunded(msg.sender, msg.value);
    }

    // Function to fund the contract after deployment
    function fundContract() external payable {
        require(msg.value > 0, "Funding amount must be greater than zero");
        emit ContractFunded(msg.sender, msg.value);
    }

    // Function to send a tip from the contract balance to a provider
    function tipProvider(address providerAddress, uint256 tipAmount) external {
        require(providerAddress != address(0), "Invalid provider address");
        require(tipAmount > 0, "Tip amount must be greater than zero");
        require(address(this).balance >= tipAmount, "Insufficient contract balance");

        // Transfer the tip amount to the provider
        (bool success, ) = providerAddress.call{value: tipAmount}("");
        require(success, "Failed to send tip");

        emit TipSent(msg.sender, providerAddress, tipAmount);
    }

    // Check the contract's balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
