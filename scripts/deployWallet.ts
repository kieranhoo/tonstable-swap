import { Address, beginCell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';

import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {

    // const randomSeed = Math.floor(Math.random() * 10000);
    const randomSeed = 7495 * 10**14;

    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        
        adminAddress: provider.sender().address as Address,
        content: beginCell().storeUint(randomSeed, 256).endCell(),
        jettonWalletCode: await compile('JettonWallet')

    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));
 
    await provider.waitForDeploy(jettonMinter.address);

/////////////////////////////////////////////////////////////////////

    await jettonMinter.sendMint(provider.sender(), {
        value: toNano('0.2'),
        amount: toNano('0.01'),
        jettonAmount: toNano('250'),
        toAddress: provider.sender().address as Address,
        queryId: Date.now()
    });

    await provider.waitForDeploy(jettonMinter.address);
///////////////////////////////////////////////////////////////////////////

    

    console.log("TotalSupply: ", await jettonMinter.getsupply());
    // run methods on `jettonMinter`
}
