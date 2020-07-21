FROM alpine:3.12.0

ENV WORKING_DIR /

RUN apk add --no-cache bash libgcc


ENV GOPATH /go
ENV PATH "$PATH:/go/bin"
RUN apk add --no-cache curl git go build-base openssl-dev && \
    mkdir -p /go/src/github.com/maxonrow/maxonrow-go/ && \
    cd /go/src/github.com/maxonrow/maxonrow-go/ && \
    git clone https://github.com/maxonrow/maxonrow-go/ . && \
    git checkout develop && \
    make deps install test && \
    cp /go/bin/mxwd /usr/bin && \
    cp /go/bin/mxwcli /usr/bin && \
    cp -R /tmp/maxonrow /maxonrow && \
    apk del curl git go build-base openssl-dev && \
    rm -rf /go

EXPOSE 26657:26657
EXPOSE 26656:26656

WORKDIR $WORKING_DIR

CMD sh -c 'mxwd start --home /maxonrow'