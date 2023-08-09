import {useEffect, useState} from 'react';

import {Container} from 'react-bootstrap';
import {ethers} from 'ethers';

//Components
import Navigation from './Navigation';
import Info from './Info';
import Loading from './Loading';
import Progress from './Progress';
import Buy from '.Buy';

//ABIS
import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

function App(){

    const [account, setAccount] = useState(null);
    const [accountBalance, setAccountBalance] = useState(0);

    const [price, setPrice] = useState(0);
    const [maxTokens, setMaxTokens] = useState(0);
    const [tokensSold, setTokensSold] = useState(0);


    const [provider, setProvider] = useState(null);
    const [crowdsale, setCrowdsale] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const loadBlockchainData = async()=>{

        //Initiate provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        //Initiate Contracts
        const token = new ethers.Contract(config[31337].token.address,TOKEN_ABI,provider)
        const crowdsale = new ethers.Contract(config[31337].crowdsale.address,CROWDSALE_ABI_ABI,provider)

        //Fetch Accounts
        const accounts = await window.ethereum.request({method:'eth_request_accounts'})
        const account = ethers.utils.getAddress(accounts[0])

        //Fetch Account Balance
        const accountBalance = ethers.utils.formatUnits(await token.balance(account),18)

        const price = ethers.utils.formatUnits(await crowdsale.price(),18)
        const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(),18)
        const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(),18)
        
        //Add to state
        setAccount(account)
        setAccountBalance(accountBalance)
        setCrowdsale(crowdsale)
        setPrice(price)
        setMaxTokens(maxTokens)
        setTokensSold(tokensSold)



        //Stop Infinite loading loop
        setIsLoading(false)
    }

    useEffect(()=>{
        if(isLoading){
            loadBlockchainData()
        }
    },[isLoading]);

 
    return(
        <Container>
            <Navigation/>
            <h1 className='my-4 text-center'>Introducing Dapp Token</h1>
            {/*Only loads page when price loads */}
            { isLoading ? (<Loading/>) : 
            ( <> 
            <p className ="text-center"><strong>Current Price:</strong>{price} ETH</p> 
            <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading}/>
            <Progress maxTokens={maxTokens} tokensSold={tokensSold}/>
            
            </>) }
            
            {/*Read From state*/}
            <hr/> {/* Only loads account on page when its connected */}
            {account && (<Info account={account} accountBalance= {accountBalance}/>)}
            
        </Container>
    )
}

export default App;