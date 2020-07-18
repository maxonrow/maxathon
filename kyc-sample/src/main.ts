import { nodeProvider } from "./node/node";
import { mxw } from "mxw-sdk-js/dist/index";
import KycData from "./kyc/data";
import KycProvider from "./kyc/provider";
import KycIssuer from "./kyc/issuer";
import KycValidator from "./kyc/validator";
import KycWhitelistor from "./kyc/whitelistor";

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;

/**
 * KYC initialization
 */
providerConnection = new mxw.providers.JsonRpcProvider(
  nodeProvider.connection,
  nodeProvider
)
  .on("rpc", function (args) {
    if ("response" == args.action) {
      if (silentRpc) {
        console.log("request", JSON.stringify(args.request));
        console.log("response", JSON.stringify(args.response));
      }
    }
  })
  .on("responseLog", function (args) {
    if (silentRpc) {
      console.log(
        "responseLog",
        JSON.stringify({ info: args.info, response: args.response })
      );
    }
  });

provider = mxw.Wallet.fromMnemonic(nodeProvider.kyc.provider).connect(
  providerConnection
);

// mxw1ngx32epz5v5gyunepkarfh4lt0g6mqr79aq3ex
issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(
  providerConnection
);

// mxw1mklypleqjhemrlt6z625rzqa0jl6namdmmqnx4
middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(
  providerConnection
);


const run = async () => {

  let wallets: Array<String> = new Array();
  const value = Number(process.argv[2]);
  const numberOfWallet: number = (Number.isInteger(value)) ? Number(process.argv[2]):0;

  console.log(`creating ${numberOfWallet} wallets`);

  for (let i = 1; i < numberOfWallet + 1; i++) {

    let wallet = mxw.Wallet.createRandom().connect(providerConnection);

    /**
     * Sign KYC address
     */
    const kycData: mxw.KycData = await new KycData(wallet).signKycAddress();

    /**
     * Provider Sign KYC Data
     */
    const partialSignedTrx: mxw.KycTransaction = await new KycProvider(
      provider,
      kycData
    ).signTransaction();

    /**
     *  Issuer Sign KYC Data
     */
    const allSignedTrx: mxw.KycTransaction = await new KycIssuer(
      issuer,
      partialSignedTrx
    ).signTransaction();

    /**
     * Verify Transaction Signature
     */
    const isValidSignature: Boolean = await new KycValidator(
      allSignedTrx
    ).isValidSignature();

    /**
     * Whitelist a Wallet Address
     */
    const whitelistReceipt: mxw.providers.TransactionReceipt = await new KycWhitelistor(
      middleware,
      allSignedTrx
    ).whitelist();
    
    wallets.push(wallet.address);

    console.log("Wallet Address", "-", wallet.address);
    console.log("Wallet Mnemonic", "-", wallet.mnemonic);
    console.log("Receipt Hash", "-", whitelistReceipt.hash);

    const green = '\x1b[32m';
    const red = '\x1b[31m';
    let result: String = (await (isValidSignature && wallet.isWhitelisted()))
      ? `${green}wallet number ${i} creation & whitelist success!`
      : `${red}wallet number ${i} creation & whitelist failed!`;

    console.log("\x1b[33m%s\x1b[0m", result); //yellow

  }

  console.log('List of wallet:')
  wallets.forEach((address) => {
    console.log(`${address}`)
  }
);


const yellow = '\x1b[33m';
  console.log(`${yellow}KYC process completed!`)
  process.exit();

  //http://localhost:26657/is_whitelisted?address=%22mxw1xrqwfukpg8eehqyyza3lz0k6vlhq5r0ldk3zdx%22
  //http://localhost:26657/decoded_tx?hash=0xd9cbc37adef8950b045af5e5ec89fd2ebf4dc1286fc88ce5843819c47ed1786a
};

run();
