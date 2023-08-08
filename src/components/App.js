import {useEffect, useState} from 'react';

import {Container} from 'react-bootstrap';
import {ethers} from 'ethers';

import Navigation from './Navigation';
import Info from './Info';
import { useEffect } from 'react';

function App(){

    const [account, setAccount] = useState(null);
    const loadBlockchainData = async()=>{
        const provider = new ethers.providers.Web3provider(window.ethereum)

        const accounts = await window.ethereum.request({method:'eth_request_accounts'})
        const account = ethers.utils.getAddress(accounts[0])

        //Add to state
        setAccount(account)
    }

    useEffect(()=>{
        loadBlockchainData()
    });

 
    return(
        <Container>
            <Navigation/>
            {/*Read From state*/}
            <hr/> {/* Only loads account on page when its connected */}
            {account && (<Info account={account}/>)}
            
        </Container>
    )
}

export default App;