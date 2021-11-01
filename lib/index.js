"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnconClient = void 0;
const tslib_1 = require("tslib");
const crypto_1 = require("@cosmjs/crypto");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const ethers_1 = require("ethers");
const node_fetch_1 = (0, tslib_1.__importDefault)(require("node-fetch"));
const rxjs_1 = require("rxjs");
const xdv_universal_wallet_core_1 = require("xdv-universal-wallet-core");
const module_1 = require("./store/generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.anconprotocol/module");
const tx_2 = require("./store/generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.anconprotocol/module/types/anconprotocol/tx");
global['fetch'] = require('node-fetch');
class AnconClient {
    /**
     * Register Msg imports
     */
    constructor(isWeb, apiUrl, rpcUrl, ethereumUrl, defaultEthAddress, signer) {
        this.apiUrl = apiUrl;
        this.rpcUrl = rpcUrl;
        this.ethereumUrl = ethereumUrl;
        this.defaultEthAddress = defaultEthAddress;
        this.signer = signer;
        this.wallet = new xdv_universal_wallet_core_1.Wallet({ isWeb });
    }
    /**
     * Creates a wallet account
     * @param accountName Account name
     * @param passphrase Passphrase
     */
    /**
     * Creates a wallet
     * @param accountName Account name
     * @param passphrase Passphrase
     * @returns
     */
    async createWallet(accountName, passphrase) {
        await this.wallet.open(accountName, passphrase);
        const acct = (await this.wallet.getAccount());
        let walletId;
        if (acct.keystores.length === 0) {
            walletId = await this.wallet.addWallet();
        }
        else {
            walletId = acct.keystores[0].walletId;
        }
        const wallet = await this.wallet.createES256K({
            passphrase: passphrase,
            walletId: walletId,
        });
        return wallet;
    }
    /**
     * Imports an existing seed phrase
     * @param accountName Account name
     * @param passphrase Passphrase
     * @param mnemonic Seed phrase
     * @returns
     */
    async importWallet(accountName, passphrase, mnemonic) {
        await this.wallet.open(accountName, passphrase);
        const acct = (await this.wallet.getAccount());
        if (acct.keystores.length > 0) {
            // already imported
            return this.wallet;
        }
        const walletId = await this.wallet.addWallet({
            mnemonic,
        });
        const wallet = await this.wallet.createES256K({
            passphrase: passphrase,
            walletId: walletId,
        });
        return wallet;
    }
    async sign(accountNumber, address, chainId, sequence, fee, encoded) {
        console.log(address, fee, accountNumber, sequence, chainId);
        const raw = await this.connectedSigner.sign(address, [encoded], fee, '', {
            accountNumber,
            sequence,
            chainId,
        });
        return tx_1.TxRaw.encode(raw).finish();
    }
    async signAndBroadcast(chainId, evmChainId, fee, defaultAccount, encoded) {
        const accounts = await this.signer.getAccounts();
        //const keyringAccount = { ...accounts[defaultAccountIndex] }
        const cosmosAccount = await this.getEthAccountInfo(defaultAccount);
        // curl -X GET "http://localhost:1317/ethermint/evm/v1/cosmos_account/32A21C1BB6E7C20F547E930B53DAC57F42CD25F6" -H  "accept: application/json"
        const acct = cosmosAccount.account_number;
        const addr = cosmosAccount.address;
        const sequence = cosmosAccount.sequence;
        const txsignedhex = await this.sign(acct, addr, chainId, sequence, fee, encoded);
        // Set it to Data in a ethereum tx / SendTxArgs
        const tx = {
            data: txsignedhex,
            value: 0,
            chainId: evmChainId,
        };
        const raw = await this.ethersclient.signTransaction(Object.assign({}, tx));
        const res = await this.rpc.send('ancon_sendRawTransaction', [raw]);
        return res;
    }
    async create(accountName, passphrase, registry, mnemonic) {
        let signer = this.signer;
        if (!this.signer) {
            const resp = await this.wallet.open(accountName, passphrase);
            const acct = (await this.wallet.getAccount(accountName));
            let walletId = '';
            if (acct.keystores.length === 0) {
                walletId = await this.wallet.addWallet({
                    mnemonic,
                });
            }
            else {
                walletId = acct.keystores[0].walletId;
            }
            const keystore = await acct.keystores.find((k) => k.walletId === walletId);
            this.rpc = new ethers_1.ethers.providers.JsonRpcProvider(this.ethereumUrl);
            this.ethersclient = ethers_1.ethers.Wallet.fromMnemonic(keystore.mnemonic, `m/44'/60'/0'/0`);
            this.ethersclient.connect(this.rpc);
            this.signer = signer = await proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(keystore.mnemonic, {
                prefix: 'ethm',
                hdPaths: [(0, crypto_1.stringToPath)(`m/44'/60'/0'/0`)],
            });
        }
        this.tm = await tendermint_rpc_1.Tendermint34Client.connect(this.rpcUrl);
        this.queryClient = await (0, module_1.queryClient)({
            addr: this.apiUrl,
        });
        this.connectedSigner = await stargate_1.SigningStargateClient.connectWithSigner(`ws://localhost:26657`, signer, {
            registry,
            prefix: 'ethm',
        });
        this.registry = registry;
        const msgCli = await (0, module_1.txClient)(signer, {
            addr: this.rpcUrl,
        });
        this.msgService = msgCli;
        return this;
    }
    /**
     * Add Ancon Metadata
     * @param name Identifies the asset to which this token represents.
     * @param description Describes the asset to which this token represents.
     * @param image A URI pointing to a resource with mime type image/* representing the asset to which this token represents.
     * @param sources Current intellectual property.
     * @param owner The owner is a DID identifier.
     * @param parent Direct ascendant of the current intellectual property.
     * @param verifiedCredentialRef Is the verified credential for the metadata
     * @param links Sample of references included in the current intellectual property
     * @param creator
     * @param did
     * @param from
     */
    async executeMetadata({ name, description, image, sources, owner, parent, verifiedCredentialRef, links, creator, did, from, fee, }) {
        const metadata = {
            name: name,
            description: description,
            image: image,
            sources: sources,
            owner: owner,
            parent: parent,
            verified_credential_ref: verifiedCredentialRef,
            links: links,
            creator: creator,
            did: did,
            from: from,
        };
        const sub = new rxjs_1.Subject();
        const query = `message.action='Metadata'`;
        const subscription = this.tm.subscribeTx(query).subscribe({
            next: async (log) => {
                try {
                    // Decode response
                    const res = tx_2.MsgMetadataResponse.decode(log.result.data);
                    // Hack: Protobuf issue
                    const cid = res.cid.substring(14);
                    sub.next(cid);
                    sub.complete();
                }
                catch (err) {
                    sub.error(err);
                }
            },
        });
        try {
            const wait = new Promise((resolve, reject) => {
                sub.subscribe({ next: (i) => resolve(i), error: (e) => reject(e) });
            });
            const encoded = this.msgService.msgMetadata(metadata);
            // hack
            encoded.value.creator = creator;
            encoded.value.sources = JSON.stringify(encoded.value.sources);
            encoded.value.links = JSON.stringify(encoded.value.links);
            const tx = await this.msgService.signAndBroadcast([encoded], {
                fee,
            });
            const cid = await wait;
            return { transaction: tx, cid };
        }
        catch (e) {
            throw e;
        }
        finally {
            subscription.unsubscribe();
        }
    }
    /**
     * Add Ancon File
     * @param
     */
    async addFile({ did, file, fee }) {
        const sub = new rxjs_1.Subject();
        file.did = did;
        const query = `message.action='File'`;
        const subscription = this.tm.subscribeTx(query).subscribe({
            next: async (log) => {
                try {
                    // Decode response
                    const res = tx_2.MsgFileResponse.decode(log.result.data);
                    // Hack: Protobuf issue
                    const cid = res.hash.substring(10);
                    sub.next(cid);
                    sub.complete();
                }
                catch (err) {
                    sub.error(err);
                }
            },
        });
        try {
            const wait = new Promise((resolve, reject) => {
                sub.subscribe({ next: (i) => resolve(i), error: (e) => reject(e) });
            });
            const encoded = this.msgService.msgFile(file);
            const tx = await this.msgService.signAndBroadcast([encoded], {
                fee,
            });
            const cid = await wait;
            return { transaction: tx, cid };
        }
        catch (e) {
            throw e;
        }
        finally {
            subscription.unsubscribe();
        }
    }
    async getEthAccountInfo(defaultEthAddress) {
        const res = await (await (0, node_fetch_1.default)(this.apiUrl + `/ethermint/evm/v1/cosmos_account/` + defaultEthAddress)).json();
        console.log('RES JSON ', res);
        //const temp = res[0]
        return Object.assign(Object.assign({}, res), { address: res.cosmos_address });
    }
}
exports.AnconClient = AnconClient;
//# sourceMappingURL=index.js.map