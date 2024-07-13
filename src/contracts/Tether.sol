pragma solidity ^0.5.0;

contract Tether{
    string public name = 'Tether';
    string public  symbol = 'USDT';
    uint256 public totalsupply = 1000000000000000000000000;
    uint8 public decimal = 18;

    event Transfer(
        address _from,
        address _to,
        uint _value
    );

    event Approval(
        address _owner,
        address _spender,
        uint _value
    );

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    constructor () public{        
        balanceOf[msg.sender] = totalsupply;
         emit Transfer(address(0),msg.sender,totalsupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value,"ERC: Insufficient funds");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }

    function approve(address _spender, uint256 _value)public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success){
        require(balanceOf[_from] >= _value,"ERC: Insufficient funds");
        require(allowance[_from][msg.sender] >= _value,"ERC: Insufficient funds");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //allowance[_from][msg.sender] -= _value;
        emit Transfer(_from,_to,_value);
        return true;
    }
}