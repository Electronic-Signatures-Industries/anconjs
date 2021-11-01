"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnconClientV2 = void 0;
const tslib_1 = require("tslib");
const xdv_universal_wallet_core_1 = require("xdv-universal-wallet-core");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const node_fetch_1 = (0, tslib_1.__importDefault)(require("node-fetch"));
global['fetch'] = require('node-fetch');
class AnconClientV2 {
    /**
     * Register Msg imports
     */
    constructor(_isWeb, _apiUrl, _rpcUrl, _ethereumUrl, _signer) {
        this._apiUrl = _apiUrl;
        this._rpcUrl = _rpcUrl;
        this._ethereumUrl = _ethereumUrl;
        this._signer = _signer;
        this.wallet = new xdv_universal_wallet_core_1.Wallet({ isWeb: _isWeb });
    }
    //Create
    //Add Metadata
    //Add File
    //Get Object
    /**
     * Creates a wallet account
     * @param _accountName Account name
     * @param _passphrase Passphrase
     */
    /**
     * Creates a wallet
     * @param _accountName Account name
     * @param _passphrase Passphrase
     * @returns
     */
    async createWallet(_accountName, _passphrase) {
        await this.wallet.open(_accountName, _passphrase);
        const acct = (await this.wallet.getAccount());
        let walletId;
        if (acct.keystores.length === 0) {
            walletId = await this.wallet.addWallet();
        }
        else {
            walletId = acct.keystores[0].walletId;
        }
        const wallet = await this.wallet.createES256K({
            passphrase: _passphrase,
            walletId: walletId,
        });
        return wallet;
    }
    /**
   * Imports an existing seed phrase
   * @param _accountName Account name
   * @param _passphrase Passphrase
   * @param _mnemonic Seed phrase
   * @returns
   */
    async importWallet(_accountName, _passphrase, _mnemonic) {
        await this.wallet.open(_accountName, _passphrase);
        const acct = (await this.wallet.getAccount());
        if (acct.keystores.length > 0) {
            // already imported
            return this.wallet;
        }
        const walletId = await this.wallet.addWallet({
            mnemonic: _mnemonic,
        });
        const wallet = await this.wallet.createES256K({
            passphrase: _passphrase,
            walletId: walletId,
        });
        return wallet;
    }
    async sign(_accountNumber, _address, _chainId, _sequence, _fee, _encoded) {
        console.log(_address, _fee, _accountNumber, _sequence, _chainId);
        const raw = await this.connectedSigner.sign(_address, [_encoded], _fee, '', {
            accountNumber: _accountNumber,
            sequence: _sequence,
            chainId: _chainId,
        });
        return tx_1.TxRaw.encode(raw).finish();
    }
    async signAndBroadcast(chainId, evmChainId, methodName, msg, fee, defaultAccount) {
        const accounts = await this._signer.getAccounts();
        const cosmosAccount = await this.getEthAccountInfo(defaultAccount);
        const encoded = this.msgService[methodName](msg);
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
    async getEthAccountInfo(defaultEthAddress) {
        const res = await (await (0, node_fetch_1.default)(this._apiUrl + `/ethermint/evm/v1/cosmos_account/` + defaultEthAddress)).json();
        console.log('RES JSON ', res);
        //const temp = res[0]
        return Object.assign(Object.assign({}, res), { address: res.cosmos_address });
    }
}
exports.AnconClientV2 = AnconClientV2;
//# sourceMappingURL=AnconClientV2.js.map