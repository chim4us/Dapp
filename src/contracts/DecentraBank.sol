// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
import './Tether.sol';
import './RWD.sol';

contract DecentraBank {
    string public name = "Decentra Bank";
    address public owner;

    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint ) public stakingBalance;
    mapping(address => bool ) public hasStaked;
    mapping(address => bool ) public isStaking;

    constructor (RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositeToken (uint _amount) public{
        require(_amount > 0 ,'Amount must be greater than 0');
        tether.transferFrom(msg.sender,address(this),_amount);
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function unstakeTokens()public{
        uint balance = stakingBalance[msg.sender];
        require(balance > 0 ,'stakking balance cant be less than 0');
        stakingBalance[msg.sender] = 0;
        tether.transfer(msg.sender,balance);
        isStaking[msg.sender] = false;
    }

    function issueToken() public{
        require(msg.sender ==owner,'caller must be the owner');
        for(uint i=0;i < stakers.length;i++){
            address recepient = stakers[i];
            uint balance = stakingBalance[recepient] / 9;
            if(balance > 0){
                rwd.transfer(recepient,balance);
            }
        }
    }
    
}
