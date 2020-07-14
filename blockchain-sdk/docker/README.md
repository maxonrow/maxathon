# Maxonrow docker

This dockerfile is useful for running maxonrow locally and testing purpose. It has some kyc accounts. Some fee settings are set and also maintenance group are defined.

This docker file has pre defined [genesis](../tests/config/genesis.json) file and [config](../tests/config/config.toml) file. 

Accounts including private keys are define [here](../tests/config/keys.json)

To build the docker run `docker build . --tag maxonrow`

To start the container, run `docker run -p 26656:26656 -p 26657:26657 --name maxonrow -d maxonrow`

To stop container, run `docker stop maxonrow`

Check rpc endpoint: http://localhost:26657
