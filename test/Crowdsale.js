const {expect} = require ('chai'); 
const {ethers} = require('hardhat');

const tokens = (n)=> {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

const ether = tokens

describe('Crowdsale',()=>{
    let crowdsale, token
    let accounts, deployer, user1

    beforeEach(async()=>{
        //Load Contracts
        const Crowdsale = await ethers.getContractFactory('Crowdsale')
        const Token = await ethers.getContractFactory('Token')

        
        //Deploy Token
        token = await Token.deploy('Dapp University','DAPP','1000000')

        //Configure Accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]

        //Deploy Crowdsale
        crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000')

        //Send tokens to crowdsale
        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
        await transaction.wait()

    })

    describe('Deployment',()=>{

        it('sends tokens to the crowdsale contract', async()=>{
            expect( await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
        })

        it('Returns the price', async()=> {  
            expect(await crowdsale.price()).to.equal(ether(1))
        })

        it('Returns token address', async()=> {  
            expect(await crowdsale.token()).to.equal(token.address)
        })
    })

    describe('Buying tokens',()=>{
        let transaction, result
        let amount =tokens(10)

        describe('Success',()=>{

            beforeEach( async()=> {
                transaction = await crowdsale.connect(user1).buyTokens(amount,{value: ether(10)})
                result = await transaction.wait()
            })

            it('Transfers tokens', async()=> {  
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
                expect(await token.balanceOf(user1.address)).to.equal(amount)
            })

            it('Updates contracts ether balance', async()=>{
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
            })

            it('Updates tokens sold', async()=>{
                expect(await crowdsale.tokensSold()).to.equal(amount)
            })

            it('Emits event', async()=>{
                
                await expect(transaction).to.emit(crowdsale,'Buy').withArgs(amount, user1.address)
            })
        })

        describe('Failure',()=>{
            it('rejects insuff ether', async()=>{
                await expect(crowdsale.connect(user1).buyTokens(tokens(10),{value:0})).to.be.reverted
            })
        })

        
    })

    describe('Sending eth',()=>{
        let transaction, result
        let amount = ether(10)

        describe('Success',()=>{

            beforeEach( async()=> {
                transaction = await user1.sendTransaction({to:crowdsale.address, value : amount})
                result = await transaction.wait()
            })

            it('Updates contracts ether balance', async()=>{
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
            })

            it('Updates Updates token balance', async()=>{
                expect(await token.balanceOf(user1.address)).to.equal(amount)
            })

            

            
        })
    })


   

        
})
