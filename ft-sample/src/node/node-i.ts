export default interface Node {
    connection: {
        url: string,
        timeout: number
    },
    trace: {
        silent: boolean,
        silentRpc: boolean
    },
    chainId: string,
    name: string,
    airDrop: string,
    kyc: {
        provider: string,
        issuer: string,
        middleware: string
    },
    alias: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string
    },
    fungibleToken: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string,
    },
    nonFungibleToken: {
        provider: string,
        issuer: string,
        middleware: string,
        feeCollector: string,
    },
};