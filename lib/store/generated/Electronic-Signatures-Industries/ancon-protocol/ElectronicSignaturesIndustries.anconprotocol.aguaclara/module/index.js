"use strict";
// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = exports.queryClient = exports.txClient = exports.MissingWalletError = void 0;
const stargate_1 = require("@cosmjs/stargate");
const proto_signing_1 = require("@cosmjs/proto-signing");
const rest_1 = require("./rest");
const tx_1 = require("./types/aguaclara/tx");
const types = [
    ["/ElectronicSignaturesIndustries.anconprotocol.aguaclara.MsgSendMetadataOwnership", tx_1.MsgSendMetadataOwnership],
];
exports.MissingWalletError = new Error("wallet is required");
const registry = new proto_signing_1.Registry(types);
exports.registry = registry;
const defaultFee = {
    amount: [],
    gas: "200000",
};
const txClient = async (wallet, { addr: addr } = { addr: "http://localhost:26657" }) => {
    if (!wallet)
        throw exports.MissingWalletError;
    const client = await stargate_1.SigningStargateClient.connectWithSigner(addr, wallet, { registry });
    const { address } = (await wallet.getAccounts())[0];
    return {
        signAndBroadcast: (msgs, { fee, memo } = { fee: defaultFee, memo: "" }) => client.signAndBroadcast(address, msgs, fee, memo),
        msgSendMetadataOwnership: (data) => ({ typeUrl: "/ElectronicSignaturesIndustries.anconprotocol.aguaclara.MsgSendMetadataOwnership", value: data }),
    };
};
exports.txClient = txClient;
const queryClient = async ({ addr: addr } = { addr: "http://localhost:1317" }) => {
    return new rest_1.Api({ baseUrl: addr });
};
exports.queryClient = queryClient;
//# sourceMappingURL=index.js.map