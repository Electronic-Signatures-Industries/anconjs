"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoData = exports.AguaclaraPacketData = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = 'ElectronicSignaturesIndustries.anconprotocol.aguaclara';
const baseAguaclaraPacketData = { creator: '', tokenAddress: '', tokenId: '', didRecipient: '', toMetadata: '' };
exports.AguaclaraPacketData = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.tokenAddress !== '') {
            writer.uint32(18).string(message.tokenAddress);
        }
        if (message.tokenId !== '') {
            writer.uint32(26).string(message.tokenId);
        }
        if (message.didRecipient !== '') {
            writer.uint32(34).string(message.didRecipient);
        }
        if (message.toMetadata !== '') {
            writer.uint32(42).string(message.toMetadata);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAguaclaraPacketData);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.tokenAddress = reader.string();
                    break;
                case 3:
                    message.tokenId = reader.string();
                    break;
                case 4:
                    message.didRecipient = reader.string();
                    break;
                case 5:
                    message.toMetadata = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAguaclaraPacketData);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.tokenAddress !== undefined && object.tokenAddress !== null) {
            message.tokenAddress = String(object.tokenAddress);
        }
        else {
            message.tokenAddress = '';
        }
        if (object.tokenId !== undefined && object.tokenId !== null) {
            message.tokenId = String(object.tokenId);
        }
        else {
            message.tokenId = '';
        }
        if (object.didRecipient !== undefined && object.didRecipient !== null) {
            message.didRecipient = String(object.didRecipient);
        }
        else {
            message.didRecipient = '';
        }
        if (object.toMetadata !== undefined && object.toMetadata !== null) {
            message.toMetadata = String(object.toMetadata);
        }
        else {
            message.toMetadata = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.tokenAddress !== undefined && (obj.tokenAddress = message.tokenAddress);
        message.tokenId !== undefined && (obj.tokenId = message.tokenId);
        message.didRecipient !== undefined && (obj.didRecipient = message.didRecipient);
        message.toMetadata !== undefined && (obj.toMetadata = message.toMetadata);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAguaclaraPacketData);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.tokenAddress !== undefined && object.tokenAddress !== null) {
            message.tokenAddress = object.tokenAddress;
        }
        else {
            message.tokenAddress = '';
        }
        if (object.tokenId !== undefined && object.tokenId !== null) {
            message.tokenId = object.tokenId;
        }
        else {
            message.tokenId = '';
        }
        if (object.didRecipient !== undefined && object.didRecipient !== null) {
            message.didRecipient = object.didRecipient;
        }
        else {
            message.didRecipient = '';
        }
        if (object.toMetadata !== undefined && object.toMetadata !== null) {
            message.toMetadata = object.toMetadata;
        }
        else {
            message.toMetadata = '';
        }
        return message;
    }
};
const baseNoData = {};
exports.NoData = {
    encode(_, writer = minimal_1.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseNoData);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseNoData);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseNoData);
        return message;
    }
};
//# sourceMappingURL=packet.js.map