# ![https://maxonrow.com](https://raw.githubusercontent.com/maxonrow/docs/master/logo.png)

## How to Implement KYC using MAXONROW SDK

### Step 1 - Install Node.js

- install Node.js via package manager [click here](https://nodejs.org/en/download/package-manager/) (skip if you have this preinstalled)

### Step 2 - Install TypeScript

- install TypeScript [click here](https://www.typescriptlang.org/index.html#download-links) (skip if you have this preinstalled)

### Step 3 - Clone Startup Kit

- clone project `$ git clone -b hackathon-1.0 https://github.com/maxonrow/maxathon.git`

### Step 4 - Build & Run

- go to directory `/maxathon/kyc-sample/` you should see `package.json` & `tsconfig.json`
- execute `$ npm install`
- execute `$ npm run build`
- execute `$ npm run start <number of wallet you want to create>`
- example `$ npm run start 3` will create 3 whitelisted wallets.
- you should see `$ KYC process completed!` output generated in your terminal

### Step 5 - Verify Account 
 
- check the account whitelisted `http://localhost:26657/is_whitelisted?address="{Address}"`
- check the account details     `http://localhost:26657/account?address="{Address}"`

### Step 6 - Checkout Article

- checkout our [cookbook](https://medium.com/maxonrow/kyc-in-the-maxonrow-blockchain-3c70d84159ee) on detailed explanation of the code & how to design & implement KYC.
- please! remember to claps, follow & share. we will mint you something! You will find out soon!
