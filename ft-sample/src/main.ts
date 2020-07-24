import { nodeProvider } from "./node/node";
import { mxw, token } from "mxw-sdk-js/dist";
import { bigNumberify, hexlify, randomBytes, BigNumber } from "mxw-sdk-js/dist/utils";
import Creator from "./ft/creator";
import Query from "./ft/query";
import Authorize from "./ft/authorize";
import Minter from "./ft/minter";
import Wallet from "./ft/wallet";
import Logger from "./ft/logger";

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;

/**
 * Fix Fungible Token Properties
 */
let symbol = "Fix" + hexlify(randomBytes(4)).substring(2);
let fungibleTokenProperties: token.FungibleTokenProperties;
fungibleTokenProperties = {
  name: "MY " + symbol,
  symbol: symbol,
  decimals: 18,
  fixedSupply: true,
  maxSupply: bigNumberify("10000000000000"),
  fee: {
    to: nodeProvider.fungibleToken.feeCollector,
    value: bigNumberify("0"),
  },
  metadata: "",
};

/**
 * Dynamic Fungible Token Properties
 */
let dynSymbol = "Dynamic" + hexlify(randomBytes(4)).substring(2);
let dynFungibleTokenProperties: token.FungibleTokenProperties;
dynFungibleTokenProperties = {
  name: "MY " + dynSymbol,
  symbol: dynSymbol,
  decimals: 18,
  fixedSupply: false,
  maxSupply: bigNumberify("100000000000000000000000000"),
  fee: {
    to: nodeProvider.fungibleToken.feeCollector,
    value: bigNumberify("0"),
  },
  metadata: "",
};

/**
 * initialization
 */
console.log("\x1b[4m%s\x1b[0m","Fungible Token Sample")
providerConnection = new mxw.providers.JsonRpcProvider(nodeProvider.connection,nodeProvider)
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
  
  provider = mxw.Wallet.fromMnemonic(nodeProvider.fungibleToken.provider).connect(providerConnection);
  
  issuer = mxw.Wallet.fromMnemonic(nodeProvider.fungibleToken.issuer).connect(providerConnection);
  
  middleware = mxw.Wallet.fromMnemonic(nodeProvider.fungibleToken.middleware).connect(providerConnection);
  
  const run = async () => {
    /**
     * Create Fixed Fungible Token
     */
  Logger.white("------------------------------------------");
  let fungibleToken: mxw.token.FungibleToken = await new Creator(issuer,fungibleTokenProperties).createFixFT();
  
  
  /**
   * Approve Fungible Token
   */
  Logger.white("------------------------------------------");
  Logger.bold("Approving Fungible Token...");
  var approveReceipt = await new Authorize(fungibleTokenProperties,token.FungibleToken.approveFungibleToken,issuer,provider,middleware).approve();
  /**
   * Query Fungible Token
   */
  Logger.white("------------------------------------------");
  fungibleToken= await new Query(fungibleTokenProperties,issuer,issuer).QueryToken();
  let wallet = new Wallet(issuer,middleware,fungibleToken);
  /**
   * Check Fungible Token Balance
   */
  await wallet.getBalance();

  /**
   * Burn all Fungible Token
   */
  Logger.white("------------------------------------------");
  Logger.bold("Burning Token...");
  await wallet.burnAll();
  Logger.green("Burned All Token");
  await wallet.getBalance();
  
  /**
   * Create Dynamic Fungible Token
   */
  Logger.white("------------------------------------------");
  let dynFungibleToken: mxw.token.FungibleToken = await new Creator(issuer,dynFungibleTokenProperties).createDynFT();
  
  /**
   * Approve Dynamic Fungible Token
   */
  Logger.white("------------------------------------------");
  Logger.bold("Approving Fungible Token...")
  approveReceipt = await new Authorize(dynFungibleTokenProperties,token.FungibleToken.approveFungibleToken,issuer,provider,middleware).approve();
  
  /**
   * Query Fungible Token
   */
  Logger.white("------------------------------------------");
  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();
  let dynWallet = new Wallet(issuer,middleware,dynFungibleToken);
  
  
  
  /**
   * Mint
   */
  Logger.white("------------------------------------------");
  await new Minter(dynFungibleToken, issuer, 1234).mint();
  await dynWallet.getBalance();
  /**
   * Freeze
   */
  Logger.white("------------------------------------------");
  Logger.bold("Freezing Fungible Token...");
  var freezeReceipt = await new Authorize(dynFungibleTokenProperties,token.FungibleToken.freezeFungibleToken,issuer,provider,middleware).approve();
  if(freezeReceipt.status ==1)
    Logger.green("Token is frozen!");
  else
    Logger.red("Failed to freeze!");
  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();

  /**
   * Unfreeze
   */
  Logger.white("------------------------------------------");
  Logger.bold("Unfreezing Fungible Token...");
  var unfreezeReceipt = await new Authorize(dynFungibleTokenProperties,token.FungibleToken.unfreezeFungibleToken,issuer,provider,middleware).approve();
  if(unfreezeReceipt.status ==1)
    Logger.green("Token is unfrozen!");
  else
    Logger.red("Failed to unfreeze!");

  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();


  Logger.white("------------------------------------------");
  /**
   * Transfer
   */
  Logger.bold('Transfering...');
  await dynWallet.transferAll();
  Logger.green('Transfered');
  await dynWallet.getBalance();
  
  
  Logger.white("------------------------------------------");
  Logger.green("FT Operation Successfully Completed!");
  Logger.white("------------------------------------------");
  process.exit();
};

run();
