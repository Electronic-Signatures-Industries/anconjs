import { OfflineSigner, Registry } from '@cosmjs/proto-signing';
import { ethers } from 'ethers';
import { Wallet } from 'xdv-universal-wallet-core';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { SigningStargateClient } from '@cosmjs/stargate';
export declare class AnconClientV2 {
    private _apiUrl;
    private _rpcUrl;
    private _ethereumUrl;
    private _signer?;
    wallet: Wallet;
    tm: Tendermint34Client;
    msgService: any;
    account: any;
    offlineSigner: SigningStargateClient;
    ethersclient: ethers.Wallet;
    connectedSigner: SigningStargateClient;
    rpc: ethers.providers.JsonRpcProvider;
    queryClient: any;
    registry: Registry;
    /**
     * Register Msg imports
     */
    constructor(_isWeb: boolean, _apiUrl: string, _rpcUrl: string, _ethereumUrl: string, _signer?: OfflineSigner);
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
    createWallet(_accountName: string, _passphrase: string): Promise<any>;
    /**
   * Imports an existing seed phrase
   * @param _accountName Account name
   * @param _passphrase Passphrase
   * @param _mnemonic Seed phrase
   * @returns
   */
    importWallet(_accountName: string, _passphrase: string, _mnemonic: string): Promise<any>;
    sign(_accountNumber: any, _address: string, _chainId: string, _sequence: any, _fee: any, _encoded: any): Promise<Uint8Array>;
    signAndBroadcast(chainId: string, evmChainId: number, methodName: string, msg: any, fee: any, defaultAccount: string): Promise<any>;
    getEthAccountInfo(defaultEthAddress: string): Promise<any>;
}
