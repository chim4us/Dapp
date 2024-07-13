const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentraBank = artifacts.require('DecentraBank');

module.exports = async function  (deployer,networks, accounts){
    await deployer.deploy(Tether);
    const tether  = await Tether.deployed();

    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    await deployer.deploy(DecentraBank,rwd.address,tether.address);
    const decentrabank  = await DecentraBank.deployed();

    await rwd.transfer(decentrabank.address,'1000000000000000000000000');

    await tether.transfer(accounts[1],'100000000000000000000');
}


///web3.utils.toWei ('15','Ether')
//web3.utils.fromWei (balance)
//accounts = await web3.eth.getAccounts()
//tether = await Tether.deployed()
//balance = await tether.balanceOf(accounts[1])
