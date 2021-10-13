import { stringToPath } from "@cosmjs/crypto";
import {
  AccountData,
  decodeTxRaw,
  DirectSecp256k1HdWallet,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignBytes,
  makeSignDoc,
  OfflineSigner,
  Registry,
} from "@cosmjs/proto-signing";
import { ethers, UnsignedTransaction } from "ethers";
import { KeystoreDbModel, Wallet } from "xdv-universal-wallet-core";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { BroadcastTxResponse, SigningStargateClient } from "@cosmjs/stargate";
import {
  MsgFile,
  MsgFileResponse,
  MsgMetadata,
  MsgMetadataResponse,
} from "./generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.anconprotocol/module/types/anconprotocol/tx";
import {
  txClient,
  queryClient,
  registry,
} from "./generated/Electronic-Signatures-Industries/ancon-protocol/ElectronicSignaturesIndustries.anconprotocol.anconprotocol/module";
import { Subject, Subscription } from "rxjs";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Web3 from "web3";
import { encodeSecp256k1Pubkey, makeStdTx } from "@cosmjs/launchpad";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import fetch from "node-fetch";
import { fromBase64 } from "@cosmjs/encoding";
global["fetch"] = require("node-fetch");
import { Ancon_evm_client } from "./ancon_evm_client";

export class AnconClient {
  wallet: Wallet;
  tm: Tendermint34Client;

  msgService: any;
  account: any;
  offlineSigner: SigningStargateClient;
  ethersclient: ethers.Wallet;
  /**
   * Register Msg imports
   */
  constructor(
    isWeb: boolean,
    private apiUrl: string,
    private rpcUrl: string,
    private ethereumUrl: string,
    private defaultEthAddress: string,
    private signer?: OfflineSigner
  ) {
    this.wallet = new Wallet({ isWeb });
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
  async createWallet(accountName: string, passphrase: string) {
    await this.wallet.open(accountName, passphrase);

    const acct = (await this.wallet.getAccount()) as any;
    let walletId: string;

    if (acct.keystores.length === 0) {
      walletId = await this.wallet.addWallet();
    } else {
      walletId = acct.keystores[0].walletId;
    }

    const wallet = await this.wallet.createES256K({
      passphrase: passphrase,
      walletId: walletId,
    });

    return wallet as any;
  }

  /**
   * Imports an existing seed phrase
   * @param accountName Account name
   * @param passphrase Passphrase
   * @param mnemonic Seed phrase
   * @returns
   */
  async importWallet(
    accountName: string,
    passphrase: string,
    mnemonic: string
  ) {
    await this.wallet.open(accountName, passphrase);

    const acct = (await this.wallet.getAccount()) as any;

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

    return wallet as any;
  }

  async sign(
    accountNumber: any,
    address: string,
    chainId: string,
    sequence,
    fee: any,
    encoded,
    signer,
    keyringAccount
  ) {
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(keyringAccount.pubkey));
    const txBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages: [encoded],
        memo: "",
      },
    };
    const txBodyBytes = registry.encode(txBodyEncodeObject);
    console.log(txBodyBytes);
    const gasLimit = fee.gas;
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit
    );
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber
    );
    const compileSignDoc = makeSignDoc(
      signDoc.bodyBytes,
      signDoc.authInfoBytes,
      signDoc.chainId,
      accountNumber
    );
    const res = await signer.signDirect(address, compileSignDoc);

    const compileTxRaw = TxRaw.fromPartial({
      bodyBytes: res.signed.bodyBytes,
      authInfoBytes: res.signed.authInfoBytes,
      signatures: [fromBase64(res.signature.signature)],
    });

    return TxRaw.encode(compileTxRaw).finish();
  }

  async create(accountName: string, passphrase: string, mnemonic?: string) {
    let signer = this.signer as DirectSecp256k1HdWallet;
    let rpc;
    let eth: ethers.Wallet;
    if (!this.signer) {
      const resp = await this.wallet.open(accountName, passphrase);
      const acct = (await this.wallet.getAccount(accountName)) as any;
      let walletId = "";
      if (acct.keystores.length === 0) {
        walletId = await this.wallet.addWallet({
          mnemonic,
        });
      } else {
        walletId = acct.keystores[0].walletId;
      }

      const keystore = await acct.keystores.find(
        (k: KeystoreDbModel) => k.walletId === walletId
      );
      rpc = new ethers.providers.JsonRpcProvider(this.ethereumUrl);
      eth = this.ethersclient = ethers.Wallet.fromMnemonic(
        keystore.mnemonic,
        `m/44'/60'/0'/0`
      );
      this.ethersclient.connect(rpc);
      signer = await DirectSecp256k1HdWallet.fromMnemonic(keystore.mnemonic, {
        prefix: "ethm",
        hdPaths: [stringToPath(`m/44'/60'/0'/0`)],
      });
    }

    const accounts = await signer.getAccounts();

    console.log(accounts);
    const keyringAccount = { ...accounts[0] };
    // keyringAccount.address = "ethm1x73r96c85nage2y05cpqlzth8ak2qg9p0vqc4d";
    const cosmosAccount = await this.getEthAccountInfo(
      "0x37A232EB07A4FA8CA88FA6020F89773F6CA020A1"
    );

    const anclient = new Ancon_evm_client()

    anclient.verifyCosmosKeyringAddress(keyringAccount.address, cosmosAccount.address )

    this.tm = await Tendermint34Client.connect(this.rpcUrl);
    // const queryCli = await queryClient({
    //   addr: this.apiUrl,
    // })

    const msgCli = await txClient(signer, {
      addr: this.rpcUrl,
    });
    const sign = this.sign;
    this.msgService = msgCli;
    const ancon = {
      query: null,
      msg: msgCli,
      tendermint: this.tm,
      registry: registry,
      metadata: {
        add: async function (msg: MsgMetadata, fee: any): Promise<string> {
          const encoded = ancon.msg.msgMetadata(msg);

          // curl -X GET "http://localhost:1317/ethermint/evm/v1/cosmos_account/32A21C1BB6E7C20F547E930B53DAC57F42CD25F6" -H  "accept: application/json"
          const acct = cosmosAccount.account_number;
          const addr = cosmosAccount.address;
          const sequence = cosmosAccount.sequence;

          const txsignedhex = await sign(
            acct,
            addr,
            "9000",
            sequence,
            fee.fee,
            encoded,
            signer,
            keyringAccount
          );

          // Set it to Data in a ethereum tx / SendTxArgs
          const tx = {
            data: txsignedhex,
            value: 0,
            chainId: 9000,
            // from: '0xB9F6914A7415F9AD867A9C537471A46DFA852BAE'
          };

          // const params = [txsignedhex]
          const raw = await eth.signTransaction({ ...tx });
          const res = await rpc.send("ancon_sendRawTransaction", [raw]);

          return res;
        },

        get: async function (cid: string, path: string): Promise<any> {
          const resp = await ancon.query.queryResource(cid, { path }, {});
          return resp.data;
        },
      },
      file: {
        add: async function (
          msg: MsgFile,
          fee: any
        ): Promise<BroadcastTxResponse> {
          const encoded = ancon.msg.msgFile(msg);

          // curl -X GET "http://localhost:1317/ethermint/evm/v1/cosmos_account/32A21C1BB6E7C20F547E930B53DAC57F42CD25F6" -H  "accept: application/json"
          const acct = cosmosAccount.account_number;
          const addr = cosmosAccount.address;
          const sequence = cosmosAccount.sequence;
          const signers = {
            pubkey: keyringAccount.pubkey,
            sequence,
          };
          const data = await sign(
            acct,
            addr,
            "9000",
            sequence,
            fee.fee,
            encoded,
            signer,
            keyringAccount
          );

          const tx: UnsignedTransaction = {
            data,
            value: 0,
            chainId: 9000,
            // from: '0xB9F6914A7415F9AD867A9C537471A46DFA852BAE'
          };

          // const params = [txsignedhex]
          const raw = await eth.signTransaction({ ...tx });
          console.log(raw);
          const res = await rpc.send("ancon_sendRawTransaction", [raw]);

          return res;
        },
        get: async function (cid: string, path: string): Promise<any> {
          const resp = await ancon.query.queryResource(cid, { path }, {});
          return resp.data;
        },
      },
    };

    return ancon;
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
  async executeMetadata({
    name,
    description,
    image,
    sources,
    owner,
    parent,
    verifiedCredentialRef,
    links,
    creator,
    did,
    from,
    fee,
  }) {
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

    const sub = new Subject<string>();
    const query = `message.action='Metadata'`;

    const subscription = this.tm.subscribeTx(query).subscribe({
      next: async (log: any) => {
        try {
          // Decode response
          const res = MsgMetadataResponse.decode(log.result.data);

          // Hack: Protobuf issue
          const cid = res.cid.substring(14);
          sub.next(cid);
          sub.complete();
        } catch (err) {
          sub.error(err);
        }
      },
    }) as Subscription;

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
    } catch (e) {
      throw e;
    } finally {
      subscription.unsubscribe();
    }
  }
  /**
   * Add Ancon File
   * @param
   */
  async addFile({ did, file, fee }) {
    const sub = new Subject<string>();
    (file as MsgFile).did = did;
    const query = `message.action='File'`;

    const subscription = this.tm.subscribeTx(query).subscribe({
      next: async (log: any) => {
        try {
          // Decode response
          const res = MsgFileResponse.decode(log.result.data);

          // Hack: Protobuf issue
          const cid = res.hash.substring(10);
          sub.next(cid);
          sub.complete();
        } catch (err) {
          sub.error(err);
        }
      },
    }) as Subscription;

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
    } catch (e) {
      throw e;
    } finally {
      subscription.unsubscribe();
    }
  }

  async getEthAccountInfo(defaultEthAddress: string): Promise<any> {
    const res = await (
      await fetch(
        this.apiUrl + `/ethermint/evm/v1/cosmos_account/` + defaultEthAddress
      )
    ).json();
    console.log("RES JSON ", res);
    //const temp = res[0]
    return { ...res, address: res.cosmos_address };
  }
}
