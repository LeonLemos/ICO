const {expect} = require ('chai'); 
const {ethers} = require('hardhat');

const tokens = (n)=> {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Crowdsale',()=>{

    beforeEach(async()=>{
        let crowdsale
    })

    describe('Deployment',()=>{
        it('Has correct name',async ()=>{
            const Crowdsale = await ethers.getContractFactory('Crowdsale')
            crowdsale = await Crowdsale.deploy()
            expect(await crowdsale.name()).to.equal('Crowdsale')
        })
    })
})