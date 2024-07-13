import React, {Component} from 'react'
import Web3 from 'web3'
import tether from '../tether.png'

class Main extends Component{
    tokenToWei =(number)=>{
        if (number !== undefined && number !== null) {
            return Web3.utils.toWei(number.toString(), 'Ether');
        }
        return '0';
    }
    
    tokenFromWei = (number)=>{
        if (number !== undefined && number !== null) {
        return Web3.utils.fromWei(number.toString());
        }
        return '0';
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const amount = this.input.value.toString();
        this.props.stakeTokens(amount);
    }

    render(){
        return(
            <div id='content' className='mt-3'>
                <table className='table text-muted text-center'>
                    <thead>
                        <tr style={{color:'white'}}>
                            <th scope='col'>
                                Staking Balance
                            </th>
                            <th scope='col'>
                                Reward Balance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'white'}}>
                            <td>
                                {this.tokenFromWei(this.props.stakingBalance)} USDT
                            </td>
                            <td>
                                 {this.tokenFromWei(this.props.rwdBalance)} RWD
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-2' style={{opacity:'.9'}}>
                    <form className='mb-3' onSubmit={this.handleSubmit}>
                        <diiv style={{borderSpacinng:'0 1em'}}>
                            <label className='float-left' style={{marginLeft:'15px'}}>
                                <b>
                                    Stake token
                                </b>
                            </label>
                            <span className='float-right' style={{marginRight:'8px'}}>
                                Balance: {this.tokenFromWei(this.props.tetherBalance)}
                            </span>
                            <div className='input-group mb-4'>
                                <input type='text' placeholder= '0' required ref={(input) => { this.input = input }}/>
                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img alt='tether' src={tether} height='32' className='d-inline-block align-top' />
                                        &nbsp;&nbsp;&nbsp; USDT
                                    </div>
                                </div>
                            </div>
                            <button type='submit' className='btn btn-primary btn-lg btn-block'>Deposite</button>
                            
                        </diiv>

                    </form>
                    <button className='btn btn-primary btn-lg btn-block' onClick={() => this.props.unStakeTokens()}>WithDraw</button>
                    <div className='card-body text-center' style={{color:'blue'}}>
                        AirDrop
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;