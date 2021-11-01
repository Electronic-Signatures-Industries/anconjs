import { OfflineSigner, Registry } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ethers } from 'ethers';
import { Wallet } from 'xdv-universal-wallet-core';
export declare class AnconClient {
    private apiUrl;
    rpcUrl: string;
    private ethereumUrl;
    private defaultEthAddress;
    signer?: OfflineSigner;
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
    constructor(isWeb: boolean, apiUrl: string, rpcUrl: string, ethereumUrl: string, defaultEthAddress: string, signer?: OfflineSigner);
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
    createWallet(accountName: string, passphrase: string): Promise<any>;
    /**
     * Imports an existing seed phrase
     * @param accountName Account name
     * @param passphrase Passphrase
     * @param mnemonic Seed phrase
     * @returns
     */
    importWallet(accountName: string, passphrase: string, mnemonic: string): Promise<any>;
    sign(accountNumber: any, address: string, chainId: string, sequence: any, fee: any, encoded: any): Promise<Uint8Array>;
    signAndBroadcast(chainId: string, evmChainId: number, fee: any, defaultAccount: string, encoded: any): Promise<any>;
    create(accountName: string, passphrase: string, registry: any, mnemonic?: string): Promise<this>;
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
    executeMetadata({ name, description, image, sources, owner, parent, verifiedCredentialRef, links, creator, did, from, fee, }: {
        name: any;
        description: any;
        image: any;
        sources: any;
        owner: any;
        parent: any;
        verifiedCredentialRef: any;
        links: any;
        creator: any;
        did: any;
        from: any;
        fee: any;
    }): Promise<{
        transaction: any;
        cid: unknown;
    }>;
    /**
     * Add Ancon File
     * @param
     */
    addFile({ did, file, fee }: {
        did: any;
        file: any;
        fee: any;
    }): Promise<{
        transaction: any;
        cid: unknown;
    }>;
    getEthAccountInfo(defaultEthAddress: string): Promise<any>;
}
