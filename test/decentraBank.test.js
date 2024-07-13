//const {assert} = require('console');
//const { assert } = require('chai');
const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentraBank = artifacts.require('DecentraBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentraBank',([owner,cust1,cust2]) =>{
    let tether,rwd,decentrabank;

    function token (number){
        return web3.utils.toWei (number,'Ether');
    }

    before(async ()=>{
        tether = await Tether.new()
        rwd = await RWD.new()
        decentrabank = await DecentraBank.new(rwd.address,tether.address);

        //await rwd.transfer(decentrabank.address,'1000000000000000000000000');
        await rwd.transfer(decentrabank.address,token('1000000'));

        await tether.transfer(cust1,token('100'),{from: owner});
    })

    describe('Mock Tether Deploymment',async ()=>{
        it('matches name successfully', async()=>{
            const name = await tether.name()
            assert.equal(name,'Tether','Name does not match')
        })
    })

    describe('Reward Token Deploymment',async ()=>{
        it('matches name successfully', async()=>{
            const name = await rwd.name()
            assert.equal(name,'Reward Token','Name does not match')
        })
    })

    describe('DecentraBank Deploymment',async ()=>{
        it('matches name successfully', async()=>{
            const name = await decentrabank.name()
            assert.equal(name,'Decentra Bank','Name does not match')
        })

        it('Contract has token', async()=>{
            let rwdBal = await rwd.balanceOf(decentrabank.address)
            assert.equal(token('1000000'),rwdBal,'Name does not match')
        })

        describe('Yeild farming', async()=>{
            it('Reward tokens for staking part1', async()=>{
                let result 
                result =  await tether.balanceOf(cust1)
                assert.equal(result.toString(), token('100'),'Match 100 tether token to stake')
            })

            it('Stake 100 tether token', async()=>{
                await tether.approve(decentrabank.address,token('100'),{from: cust1});
                await decentrabank.depositeToken(token('100'),{from: cust1});
                let result =  await tether.balanceOf(cust1)
                assert.equal(result.toString(), token('0'),'Match 0 tether token on cust1 address')
            })

            it('Check the decentra Bank has the 100 tether', async()=>{
                let result =  await tether.balanceOf(decentrabank.address)
                assert.equal(result.toString(), token('100'),'decentra bank has 100 tether token')
            })

            it('Check customer updated status Decentra Bank has the 100 tether', async()=>{
                let result =  await tether.balanceOf(decentrabank.address)
                assert.equal(result.toString(), token('100'),'decentra bank has 100 tether token')
            })

            it('Check isstaked is marked as true on decentra Bank', async()=>{
                let result =  await decentrabank.isStaking(cust1)
                assert.equal(result.toString(), 'true','decentra bank has 100 tether token')
            })

            it('Check owner can issue tokens to stakers', async()=>{
                await decentrabank.issueToken({from: cust1}).should.be.rejected;
                await decentrabank.issueToken();
                let custRwdBal =  await rwd.balanceOf(cust1)
                assert.equal(custRwdBal.toString(), (token('100') / 9),'decentra bank has 100 tether token')
            })

            it('Custmers can unstake thier tokens', async()=>{
                await decentrabank.unstakeTokens({from: cust1});
                let isStaking =  await decentrabank.isStaking(cust1);
                assert.equal(isStaking.toString(), 'false','decentra bank has 100 tether token');

                //check unnstake balances
                let result =  await tether.balanceOf(cust1)
                assert.equal(result.toString(), token('100'),'Match 0 tether token on cust1 address')
            })
        })
    })
})