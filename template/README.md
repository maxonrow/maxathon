# ![https://maxonrow.com](https://raw.githubusercontent.com/maxonrow/docs/master/logo.png)

## **Team Details**
| Kits | More Info |
| ------------- | ------------- |
|Team Name| e.g. MaxonrowChain2020 |
|Challenge| e.g. Challenge #1 Physical Distancing|
|Project Short Description| e.g. Model that monitors and sends out alerts upon identification of lockdown violators.|
|Team Members FullName| e.g. 1)Mark Zuckerberg, 2)Elon Musk|
|Team Members Github| e.g. https://github.com/mark, https://github.com/elon-musk|

<br>

## **Project Idea & Explanation**
- use your own way to ellaborate as much as you can.


## **How to run code**
  
### Step 1 - Initial
- Provide steps by steps how to run you code, example as below

### Step 2 - Build & Run
- go to directory `/maxathon/kyc-sample/` you should see `package.json` & `tsconfig.json`
- execute `$ npm install`
- execute `$ npm run build`
- execute `$ npm run start <number of wallet you want to create>`
- example `$ npm run start 3` will create 3 whitelisted wallets.
- you should see `$ KYC process completed!` output generated in your terminal

### Step 3 - Verify Account
- check the account whitelisted `http://localhost:26657/is_whitelisted?address="{Address}"`
 
