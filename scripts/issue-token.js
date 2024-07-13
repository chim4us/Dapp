const DecentraBank = artifacts.require('DecentraBank');

module.exports = async function issueRewards(callback){
    let decentrabank  = await DecentraBank.deployed();
    await decentrabank.issueToken();
    console.log('Tokens have been issued successfully')
    callback();
}