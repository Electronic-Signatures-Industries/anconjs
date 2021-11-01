"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sample = void 0;
require('dotenv').config();
const _1 = require(".");
const tx_1 = require("./store/generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.anconprotocol/module/types/anconprotocol/tx");
const tx_2 = require("./store/generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.aguaclara/module/types/aguaclara/tx");
const index_1 = require("./store/generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.aguaclara/module/index");
global['fetch'] = require('node-fetch');
class Sample {
    static async addFile() {
        // Creates a new Ancon client instance
        // isWeb = rxdb for web or node
        // api url
        // rpc url
        const client = new _1.AnconClient(false, 'http://localhost:1317', 'ws://localhost:26657', 'http://localhost:8545', '');
        // User creates new wallet / optional
        const ancon = await client.create('walletcore', 'abc123456789', index_1.registry, 'lend lock kit kiss walnut flower expect text upset nut arrive hub waste stairs climb neither must crowd harvest network wife lizard shiver obtain');
        let aguaclaraTxClient = await (0, index_1.txClient)(ancon.signer, {
            addr: ancon.rpcUrl
        });
        const address = 'ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d';
        let cid;
        let msg = tx_1.MsgMetadata.fromPartial({
            creator: address,
            name: 'tendermint',
            image: 'http://localhost:1317',
            additionalSources: [
                'bafyreia66w67tvsr5yiqagmxnklg3xdlxwroj2ho5sdzj45iydatgbbxci',
            ],
            links: ['bafyreia66w67tvsr5yiqagmxnklg3xdlxwroj2ho5sdzj45iydatgbbxci'],
            owner: 'did:key:z8mWaJHXieAVxxLagBpdaNWFEBKVWmMiE',
            description: 'tendermint',
            did: '',
            from: '',
        });
        let msgSendMeta = tx_2.MsgSendMetadataOwnership.fromPartial({
            creator: 'ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d',
            portId: 'aguaclara',
            channelId: 'channel-0',
            data: {
                creator: 'ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d',
                tokenAddress: '0xFA24605D4023b0bf847034Da72D25e1b8daC0E34',
                tokenId: '3',
                didRecipient: 'ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d',
                toMetadata: 'ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d',
            },
        });
        // // Subscribe to Tendermint events
        let query = `message.action='SendMetadataOwnership'`;
        ancon.tm.subscribeTx(query).addListener({
            next: async (log) => {
                console.log(log);
            },
        });
        query = `message.action='UpdateMetadataOwnership'`;
        ancon.tm.subscribeTx(query).addListener({
            next: async (log) => {
                // Decode response
                const res = tx_1.MsgUpdateMetadataOwnership.decode(log.result.data);
                console.log(res);
                // Hack: Protobuf issue
                cid = res.hash.split(';')[1];
                console.log(cid);
                // Get CID content from GET /ancon/{cid} or /ancon/{cid}/{path}
                const content = await ancon.queryClient.queryReadWithPath(cid, '/', {});
                console.log(content.data);
                let key = cid;
                const path = '';
                const requestProof = await fetch(`http://localhost:1317/ancon/proof/${key}${path}`);
                const proof = await requestProof.json();
                const root = proof.root;
                const exp = proof.proof;
                console.log(root, exp);
            },
        });
        const chainId = 'anconprotocol_9000-1';
        const evmChainId = 9000;
        const fee = {
            amount: [
                {
                    denom: 'aphoton',
                    amount: '4',
                },
            ],
            gas: '200000',
        };
        // Create Metadata Message request
        // Add Cosmos uatom
        const msgMetadataReceipt = await ancon.signAndBroadcast(chainId, evmChainId, fee, '0x37A232EB07A4FA8CA88FA6020F89773F6CA020A1', aguaclaraTxClient.msgSendMetadataOwnership(msgSendMeta));
        console.log(msgMetadataReceipt);
        // ancon.getTxProof(msgMetadataReceipt.txhash)
        // setTimeout(async () => {
        //   let resp = await fetch(
        //     `http://localhost:26657/tx?hash=0x${msgMetadataReceipt.txhash}&prove=true`,
        //   )
        //   const o = await resp.json()
        //   console.log(o, msgMetadataReceipt)
        //   const msgupd = MsgUpdateMetadataOwnership.fromPartial({
        //     hash: cid,
        //     previousOwner: 'did:key:z8mWaJHXieAVxxLagBpdaNWFEBKVWmMiE',
        //     newOwner: 'did:ethr:0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
        //     currentChainId: '9000',
        //     recipientChainId: '3',
        //     sender: address,
        //   })
        //   // Change Metadata Message request
        //   // Add Cosmos uatom
        //   const msgUpdateMetadataReceipt = await ancon.signAndBroadcast(
        //     chainId,
        //     evmChainId,
        //     'msgUpdateMetadataOwnership',
        //     msgupd,
        //     fee,
        //     '0x37A232EB07A4FA8CA88FA6020F89773F6CA020A1',
        //   )
        // }, 5000)
    }
}
exports.Sample = Sample;
;
(async function bootstrap() {
    await Sample.addFile();
})();
//# sourceMappingURL=sample.js.map