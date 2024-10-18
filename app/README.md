# Installation

This app tested on Apple M2 machine.

## Prerequisite

This app need a GridDB server.

Make sure to check out this [blog](https://griddb.net/en/blog/griddb-on-arm-with-docker/) for instructions on how to install GridDB using Docker on ARM machines.

## Build

1. Clone this repository and build the app.

```shell
git clone https://github.com/junwatu/clothes-recommendation.git
cd app
npm run build
```

2. Dockerize.

```shell
docker build -t nodejs-clothes-recommendation .
```

## Running the code

```shell
docker run --name clothes-rag-griddb --network griddb-net -e GRIDDB_CLUSTER_NAME=myCluster -e GRIDDB_USERNAME=admin -e GRIDDB_PASSWORD=admin -e IP_NOTIFICATION_MEMBER=griddb-server:10001 -p 3000:3000 nodejs-clothes-recommendation
```
