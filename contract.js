// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the BSC ERC20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSale {
    address public admin;
    IERC20 public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(address _tokenContractAddress, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = IERC20(_tokenContractAddress);
        tokenPrice = _tokenPrice; // 0.002 BNB
    }

    // Function to buy tokens
    function buyTokens() public payable {
        uint256 amount = msg.value / tokenPrice; // Calculate the amount of tokens to buy
        require(tokenContract.balanceOf(address(this)) >= amount, "Insufficient token balance in contract");
        require(tokenContract.transfer(msg.sender, amount), "Token transfer failed");
        
        // Update tokens sold and emit event
        tokensSold += amount;
        emit Sell(msg.sender, amount);
    }

    // Function to withdraw BNB from the contract (only admin)
    function withdrawBNB() public {
        require(msg.sender == admin, "Only admin can withdraw");
        payable(admin).transfer(address(this).balance);
    }

    // Function to withdraw remaining tokens from the contract (only admin)
    function withdrawTokens() public {
        require(msg.sender == admin, "Only admin can withdraw");
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
    }
}
