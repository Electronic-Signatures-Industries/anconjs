import { AnconWallet } from ".";

require("dotenv").config();

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
    }`;

    const mnemonic = process.env.SCRT;
    
    const client = new AnconWallet();
    const provider = await client.createSecretProvider(
      "walletcore",
      "abc123456789",
      mnemonic
    );
    await client.addMetadataContracts(
      provider.client,
      process.env.CONTRACT_ID,
      {}
    );
    const ancon = client.getContract("metadata");
    //   const query = `message.action='CreateFile'`

    //   provider.tmclient.subscribeTx(query).addListener({
    //     next: async (log: any) => {
    //       const rd = new Reader(log.result.data)
    //       // rd.uint32()
    //       rd.string()
    //       const c = rd.skip(4)
    //       const resp = MsgCreateFileResponse.decode(c.bytes())
    //       try {
    //         const cid = await provider.query.queryFile(resp.cid)
    //         console.log(log.result, resp, await cid.text())
    //       } catch (err) {
    //         console.log(err)
    //       }
    //     },
    //   })

    //  // const tx =  await ancon.metadata.ad
    // }
    const tx = await ancon.metadata.add(
      {
        name: "XDV metadata sample: NFT",
        description: "testing sample",
        image:
          "https://explore.ipld.io/#/explore/QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
        sources: ["QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D"],
        parent: "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
        refs: [
          "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
          "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
        ],
      },
      null,
      null,
      null
    );
    console.log("Transaction", tx);
  }
}

(async function bootstrap() {
  await Test.uploadFile();
})();
