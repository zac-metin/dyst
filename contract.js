// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 interface and SafeMath library
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSale {
    using SafeMath for uint256;

    address public admin;
    IERC20 public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(address _tokenContractAddress, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = IERC20(_tokenContractAddress);
        tokenPrice = _tokenPrice; // 0.002 BNB (in wei)
    }

    // Function to buy tokens
    function buyTokens() public payable {
        require(msg.value >= tokenPrice, "Insufficient BNB sent");
        
        // Calculate the amount of tokens to buy based on the sent BNB
        uint256 amount = msg.value.mul(1e18).div(tokenPrice); // Convert BNB to wei
        
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
