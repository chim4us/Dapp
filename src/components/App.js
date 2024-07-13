import React, {Component,useState, useEffect } from 'react'
import { green } from 'ansi-colors'
import './App.css'
import Navbar from './Nav.js'
import Web3 from 'web3'
import Tether from '../truffle_abis/Tether.json'
import Rwd from '../truffle_abis/RWD.json'
import DecentraBank from '../truffle_abis/DecentraBank.json'
import Main from './Main.js'
import ParticleSettings from './ParticleSettings.js'
import { relative } from 'upath'

class App extends Component{
    //calls once we load the page
    async UNSAFE_componentWillMount(){
        //await this.connectWalletHandler()
        await this.loadWeb3()
        await this.loadBlockchainData()
        
    }

    //Connect to web3 provider
    async loadWeb3() {
        if(window.ethereuem){
            window.web3 = new Web3(window.ethereum)
            await window.ethereuem.enable()
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            alert("Mummu")
        }
    }

    //convert eth
    tokenToWei =(number)=>{
        return Web3.utils.toWei(number.toString(), 'Ether');
    }

    tokenFromWei = (number) =>{
        return Web3.utils.fromWei(number.toString());
    }

    connectWalletHandler = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          alert("Please install MetaMask!");
          return;
        }
    
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          this.setState({ account: accounts[0],isConnected: true });
        } catch (err) {
          console.log(err);
        }
        this.loadBlockchainData()
      };

    //this gets the data from the blockchain
    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})

        if(this.state.isConnected){

        //get the network id of network user is connected to
        const networkId = await web3.eth.net.getId()

        //Load the tether contract
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance: tetherBalance.toString() })
        }else{
            window.alert('Tether contract not depoyed')
        }

        //Load the RWD contract
        const rwdData = Rwd.networks[networkId]
        if(rwdData){
            const rwd = new web3.eth.Contract(Rwd.abi, rwdData.address);
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString() })
            console.log(this.state.rwdBalance);
        }else{
            window.alert('RWD contract not depoyed')
        }

        //Load the DecentraBank contract
        const DecentraBankData = DecentraBank.networks[networkId]
        if(DecentraBankData){
            const decentraBank = new web3.eth.Contract(DecentraBank.abi, DecentraBankData.address);
            this.setState({decentraBank})
            let decentraBankBalance = await decentraBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: decentraBankBalance.toString() })
        }else{
            window.alert('Decentra Bank contract not depoyed')
        }
    }

        this.setState({loading:false});
    }

    stakeTokens = async (amount) =>{
        let TokenAllowed = await this.state.tether.methods.allowance(this.state.account,this.state.decentraBank._address).call()
        if(TokenAllowed < this.tokenToWei(amount)){
            this.setState({loading:true});
            await this.state.tether.methods.approve(this.state.decentraBank._address,this.tokenToWei(amount)).send({from: this.state.account}).on('transactionHash',(hash) =>{})
        }

        this.setState({loading:true});
        await this.state.decentraBank.methods.depositeToken(this.tokenToWei(amount)).send({from: this.state.account}).on('transactionHash',(hash) =>{
            this.setState({loading:false});
        })

        this.loadBlockchainData()
    }

    unStakeTokens = async () =>{
        this.setState({loading:true});
        await this.state.decentraBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash',(hash) =>{
            this.setState({loading:false});
        })
        this.loadBlockchainData()
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x2',
            tether: {},
            rwd : {},
            decentraBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true,
            isConnected: false
        }
    }

    render(){
        let content
        {this.state.loading ? content = <p id='loader' className='text-center' style={{margin:'30px',color:'white'}}> 
        LOADING...</p>:content = <Main 
        tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens ={this.stakeTokens}
        unStakeTokens = {this.unStakeTokens}
        />}
        return(
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticleSettings />
                </div>
                <Navbar 
                account={this.state.account}
                isConnected={this.state.isConnected}
                connectWalletHandler={this.connectWalletHandler}/>
                <div className="continer-fluid mt-5" >
                    <div className="row">
                        <main role='main'className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default App;

//find /Users/favor/Documents/EthPro -type f -exec grep -l "million.money" {} +

//recruitment@voyatekgroup.com