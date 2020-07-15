<a href="https://maxonrow.com"><img src="https://maxonrow.com/images/maxonrow_gold.png" title="MAXONROW" alt="MAXONROW"></a>


## Setup <a href="https://github.com/maxonrow/mxw-sdk-js" target="_blank">Maxonrow SDK</a> on Local Environment

### Step 1 - Install Docker
- install docker <a href="https://docs.docker.com/engine/install/" target="_blank">click here</a> (skip if you have this preinstalled)

### Step 2 - Install Node.js
- install Node.js via package manager <a href="https://nodejs.org/en/download/package-manager/" target="_blank">click here</a> (skip if you have this preinstalled)

### Step 3 - Install TypeScript
- install TypeScript <a href="https://www.typescriptlang.org/index.html#download-links" target="_blank">click here</a> (skip if you have this preinstalled)

### Step 4 - Clone Startup Kit
- clone startup kit <a href="https://github.com/phua-gingsheng/maxathon/tree/hackathon-1.0" target="_blank">click here</a>
- ```bash 
  git clone -b hackathon-1.0 https://github.com/phua-gingsheng/maxathon.git
  ```

### Step 5 - Startup Blockchain
- go to directory `/maxathon/blockchain-sdk/docker/` you should see a `DockerFile`
- start your local blockchain following the steps below
- build docker image `docker build . --tag maxonrow`
- start container `docker run -p 26656:26656 -p 26657:26657 --name maxonrow -d maxonrow`
- check your RPC service `http://localhost:26657`

### Step 6 - Build & Run
- go to directory `/maxathon/blockchain-sdk/` you should see a `package.json`
- execute `npm install`
- execute `npm run build`
- execute `npm run start`
- you should see an output message `KYC Process Completed !!` in your terminal
- congratulation, your machine now is blockchain ready! You have just successfully completed a KYC process.
- for more detail how to design KYC (<-- this will be a link to git source code) using Maxonrow SDK <a href="https://medium.com/" target="_blank">click here</a>
- for more detail how to design NFT (<-- this will be a link to git source code) using Maxonrow SDK <a href="https://medium.com/" target="_blank">click here</a>
- for more detail how to design FT  (<-- this will be a link to git source code) using Maxonrow SDK <a href="https://medium.com/" target="_blank">click here</a>

### Step 7 - Stop & Restart Docker Container
- stop docker container `docker stop maxonrow`
- restart when you need it `docker run -p 26656:26656 -p 26657:26657 -d maxonrow`