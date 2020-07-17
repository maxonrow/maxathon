import { nodeProvider } from "./node/node";
import { mxw, token } from "mxw-sdk-js/dist";
import { bigNumberify, hexlify, randomBytes, BigNumber } from "mxw-sdk-js/dist/utils";
import Creator from "./ft/creator";
import Query from "./ft/query";
import Approver from "./ft/approver";
import Minter from "./ft/minter";
import Wallet from "./ft/wallet";

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
  let fungibleToken: mxw.token.FungibleToken = await new Creator(issuer,fungibleTokenProperties).createFixFT();

  
  /**
   * Approve Fungible Token
   */
  console.log("\x1b[1m%s\x1b[0m","Approving Fungible Token...")
  var approveReceipt = await new Approver(fungibleTokenProperties,token.FungibleToken.approveFungibleToken,issuer,provider,middleware).Approve();
  /**
   * Query Fungible Token
   */
  fungibleToken= await new Query(fungibleTokenProperties,issuer,issuer).QueryToken();
  let fixWallet = new Wallet(issuer,middleware,fungibleToken);
  /**
   * Check Fungible Token Balance
   */
  await fixWallet.GetBalance();

  /**
   * Burn all Fungible Token
   */
  console.log("\x1b[1m%s\x1b[0m","Burning Token...");
  await fixWallet.BurnAll();
  console.log("\x1b[32m%s\x1b[0m","Burned All Token")
  await fixWallet.GetBalance();
  
  /**
   * Create Dynamic Fungible Token
   */
  let dynFungibleToken: mxw.token.FungibleToken = await new Creator(issuer,dynFungibleTokenProperties).createDynFT();
  
  /**
   * Approve Dynamic Fungible Token
   */
  console.log("\x1b[1m%s\x1b[0m","Approving Fungible Token...")
  var approveReceipt = await new Approver(dynFungibleTokenProperties,token.FungibleToken.approveFungibleToken,issuer,provider,middleware).Approve();
  
  /**
   * Query Fungible Token
   */
  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();
  let wallet = new Wallet(issuer,middleware,dynFungibleToken);

  /**
   * Mint
   */
  await new Minter(dynFungibleToken, issuer, 1234).Mint();
  await wallet.GetBalance();
  /**
   * Freeze
   */
  console.log("\x1b[1m%s\x1b[0m","Freezing Fungible Token...");
  var approveReceipt = await new Approver(dynFungibleTokenProperties,token.FungibleToken.freezeFungibleToken,issuer,provider,middleware).Approve();

  console.log("\x1b[32m%s\x1b[0m","Token is frozen!");
  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();

  /**
   * Unfreeze
   */
  console.log("\x1b[1m%s\x1b[0m","Unfreezing Fungible Token...");
  var approveReceipt = await new Approver(dynFungibleTokenProperties,token.FungibleToken.unfreezeFungibleToken,issuer,provider,middleware).Approve();
  console.log("\x1b[32m%s\x1b[0m","Token is unfrozen.");

  dynFungibleToken = await new Query(dynFungibleTokenProperties,issuer,issuer).QueryToken();

  /**
   * Transfer
   */
  console.log("\x1b[1m%s\x1b[0m",'Transfering...');
  await wallet.TransferAll();
  console.log("\x1b[32m%s\x1b[0m",'Transfered');
  await wallet.GetBalance();
  /**
   * Burn
   */

  process.exit();
};

run();
