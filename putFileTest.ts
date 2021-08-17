import { fromBase64, fromHex, Bech32 } from '@cosmjs/encoding'

import { assertIsBroadcastTxSuccess, logs } from '@cosmjs/stargate'
import {
  ABCIMessageLog,
  TxMsgData,
  TxResponse,
} from '@cosmjs/stargate/build/codec/cosmos/base/abci/v1beta1/abci'
import { hexlify } from 'ethers/lib/utils'
import { AnconWallet, XDVNodeProvider } from '.'
import {
  MsgClientImpl,
  MsgCreateFile,
  MsgCreateFileResponse,
} from './types/xdvnode/tx'
import { Reader, util, configure, Writer } from 'protobufjs/minimal'
import { TxBody } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import {
  AuthInfo,
  SignDoc,
  Tx,
} from '@cosmjs/proto-signing/build/codec/cosmos/tx/v1beta1/tx'
import { makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing'
import { SignMode } from '@cosmjs/proto-signing/build/codec/cosmos/tx/signing/v1beta1/signing'
import { Any } from '@cosmjs/proto-signing/build/codec/google/protobuf/any'
import Long from 'long'

export class Test {
  static async uploadFile() {
    const data = `{
		link: 'bafyreib77wpm5tvgkbr4t4aiiopjyispw76h2trd5yvpzmq6cejdjhcsie',
		payload: 'AXESID_9ns7OplBjyfAIQ56cIk-3_H1OI-4q_LIeERI0nFJB',
		signatures: [
		  {
			protected: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRpZDprZXk6ekFIZDdoQ1dXcjgxUlZIZkxYMkNaRFladGNDR2lMQXc5czdyRzRWdjhlQ3g4RERkZiN6QUhkN2hDV1dyODFSVkhmTFgyQ1pEWVp0Y0NHaUxBdzlzN3JHNFZ2OGVDeDhERGRmIn0',
			signature: 'NiQ236iEKLjkJ7zqU4u1GIqsnV0fj9XU3fp8th8lLqCRstn-UtiL-CZE4-WQBPm_N_brRqyCdTiqRcMp3wAybve8MRFzY1d8DEnD8iyxY_ZJOeLr_d9hSKDqLCX80uuxjPk89MExrK19pC36k44kAO1wIYBwCn8iiiIHtkPrYnebJ1iWS5JTd_ZaHMitZ99QCNpmQG3-1BSNXucERr61Mn9VrLgwpQNlCfC_m_QXCsKYhgTo020fDK0aHuAgmMAGKW-s9F9BA-PGvNike_S3KjKiy0dmcWi-J07N7d5hgYXh8l0RChwz_yLFO8o6k0EgEZbFTZdLqeuYM6VHoGWpDQ'
		  }
		]
	  }`

    const mnemonic = process.env.SCRT;
    const customFees = {
      upload: {
          amount: [{ amount: "2000000", denom: "uscrt" }],
          gas: "2000000",
      },
      init: {
          amount: [{ amount: "500000", denom: "uscrt" }],
          gas: "500000",
      },
      exec: {
          amount: [{ amount: "500000", denom: "uscrt" }],
          gas: "500000",
      },
      send: {
          amount: [{ amount: "80000", denom: "uscrt" }],
          gas: "80000",
      },
    }
    const client = new AnconWallet()
    await client.createAccount('walletcore', 'abc123456789')
    const provider = await client.createSecretProvider(
      'walletcore',
      'abc123456789',
      mnemonic,

    )
    await client.addMetadataContracts(provider.client, 30290, {})
    const ancon = client.getContract('metadata');
    const query = `message.action='CreateFile'`

    provider.tmclient.subscribeTx(query).addListener({
      next: async (log: any) => {
        const rd = new Reader(log.result.data)
        // rd.uint32()
        rd.string()
        const c = rd.skip(4)
        const resp = MsgCreateFileResponse.decode(c.bytes())
        try {
          const cid = await provider.query.queryFile(resp.cid)
          console.log(log.result, resp, await cid.text())
        } catch (err) {
          console.log(err)
        }
      },
    })

   // const tx =  await ancon.metadata.ad
  }
}

;(async function bootstrap() {
  await Test.uploadFile()
})()
