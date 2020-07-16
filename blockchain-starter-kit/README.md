# ![https://maxonrow.com](https://maxonrow.com/images/maxonrow_gold.png)

## Setup [Maxonrow SDK](https://github.com/maxonrow/mxw-sdk-js) on Local Environment

### Step 1 - Install Docker

- install docker [click here](https://docs.docker.com/engine/install/) (skip if you have this preinstalled)

### Step 2 - Clone Startup Kit

- clone startup kit `$ git clone -b hackathon-1.0 https://github.com/phua-gingsheng/maxathon.git`

### Step 3 - Startup Blockchain

- go to directory `/maxathon/blockchain-starter-kit/docker/` you should see a `DockerFile`
- start your local blockchain following the steps below
- build docker image `docker build . --tag maxonrow`
- start container `docker run -p 26656:26656 -p 26657:26657 --name maxonrow -d maxonrow`

### Step 4 - Test Blockchain

- check your RPC service `http://localhost:26657`
- execute `curl http://localhost:26657/version`
- you should see an output message `{"jsonrpc":"2.0","id":"","result":{"Maxonrow":"1.3.1-84bd0079","Tendermint":"0.32.8"}}` in your terminal
- congratulation, your machine now is blockchain ready !

### Step 5 - Stop & Restart Docker Container

- stop docker container `docker stop maxonrow`
- restart when you need it `docker run -p 26656:26656 -p 26657:26657 -d maxonrow`

### Step 6 - Checkout Article

- checkout our [cookbook](https://medium.com/) on how to design & implement KYC.
- please! remember to claps, follow & share. we will mint you something! You will find out soon!
