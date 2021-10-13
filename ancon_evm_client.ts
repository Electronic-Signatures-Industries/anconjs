export class Ancon_evm_client {
  constructor() {}

  verifyCosmosKeyringAddress(keyringAddress: string, cosmosAddress: string) {
    if (keyringAddress !== cosmosAddress) {
      throw new Error(
        "keyring: " + keyringAddress + " cosmos: " + cosmosAddress
      );
    }
    return true;
  }
}
