import React, {Component,useState, useEffect } from 'react'
import bank from '../bank.png'

class Navbar extends Component{
    render(){
        //{<button onClick={this.connectWalletHandler} className="btn btn-primary">Connect Wallet</button>}
        return(
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{
                backgroundColor:'black',height:'50px'
            }}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0' style={{
                    color:'white'
                }}>
                    <img src={bank} width='50' height='30' className='d-inline-block align-top' alt='bank Image'/>
                    &nbsp; Dapp Yield staking (decentralized bankinng) 
                    </a>
                    <ul className='navbar-nav px-3'>
                        <li className='text-nowrap d-none nav-item d-sm-nonne d-sm-block'>
                            <small a style={{
                                color:'white'
                            }}>
                                {!this.props.isConnected && (
                                    <button onClick={this.props.connectWalletHandler} className="btn btn-primary">
                                    Connect Wallet
                                    </button>
                                )}
                                {this.props.isConnected && (
                                    <div className="text-center">Account Number {this.props.account}</div>
                                )}
                                
                            </small>
                        </li>
                    </ul>
                
            </nav>
            
        )
    }
}

export default Navbar;

//Account Number {this.props.account}