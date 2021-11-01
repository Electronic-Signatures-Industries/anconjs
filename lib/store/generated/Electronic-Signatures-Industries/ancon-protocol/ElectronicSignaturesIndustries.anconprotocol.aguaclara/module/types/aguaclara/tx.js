"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgSendMetadataOwnershipResponse = exports.MsgSendMetadataOwnership = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
const packet_1 = require("../aguaclara/packet");
exports.protobufPackage = 'ElectronicSignaturesIndustries.anconprotocol.aguaclara';
const baseMsgSendMetadataOwnership = { creator: '', portId: '', channelId: '' };
exports.MsgSendMetadataOwnership = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.portId !== '') {
            writer.uint32(18).string(message.portId);
        }
        if (message.channelId !== '') {
            writer.uint32(26).string(message.channelId);
        }
        if (message.data !== undefined) {
            packet_1.AguaclaraPacketData.encode(message.data, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendMetadataOwnership);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.portId = reader.string();
                    break;
                case 3:
                    message.channelId = reader.string();
                    break;
                case 4:
                    message.data = packet_1.AguaclaraPacketData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSendMetadataOwnership);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.portId !== undefined && object.portId !== null) {
            message.portId = String(object.portId);
        }
        else {
            message.portId = '';
        }
        if (object.channelId !== undefined && object.channelId !== null) {
            message.channelId = String(object.channelId);
        }
        else {
            message.channelId = '';
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = packet_1.AguaclaraPacketData.fromJSON(object.data);
        }
        else {
            message.data = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.portId !== undefined && (obj.portId = message.portId);
        message.channelId !== undefined && (obj.channelId = message.channelId);
        message.data !== undefined && (obj.data = message.data ? packet_1.AguaclaraPacketData.toJSON(message.data) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSendMetadataOwnership);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.portId !== undefined && object.portId !== null) {
            message.portId = object.portId;
        }
        else {
            message.portId = '';
        }
        if (object.channelId !== undefined && object.channelId !== null) {
            message.channelId = object.channelId;
        }
        else {
            message.channelId = '';
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = packet_1.AguaclaraPacketData.fromPartial(object.data);
        }
        else {
            message.data = undefined;
        }
        return message;
    }
};
const baseMsgSendMetadataOwnershipResponse = { cid: '' };
exports.MsgSendMetadataOwnershipResponse = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.cid !== '') {
            writer.uint32(10).string(message.cid);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendMetadataOwnershipResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSendMetadataOwnershipResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSendMetadataOwnershipResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = object.cid;
        }
        else {
            message.cid = '';
        }
        return message;
    }
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    SendMetadataOwnership(request) {
        const data = exports.MsgSendMetadataOwnership.encode(request).finish();
        const promise = this.rpc.request('ElectronicSignaturesIndustries.anconprotocol.aguaclara.Msg', 'SendMetadataOwnership', data);
        return promise.then((data) => exports.MsgSendMetadataOwnershipResponse.decode(new minimal_1.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
//# sourceMappingURL=tx.js.map