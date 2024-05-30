// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public balance;
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Mint(address indexed account, uint256 amount);
    event Burn(address indexed account, uint256 amount);
    event AccountTransferred(address indexed previousOwner, address indexed newOwner, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }
        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }

    function transferAccount(address newOwner) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(newOwner != address(0), "Invalid address");
        uint256 amount = balance;
        balance = 0;
        emit AccountTransferred(owner, newOwner, amount);
        owner = payable(newOwner);
    }
}

