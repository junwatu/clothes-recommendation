# Installation

This app tested on Apple M2 machine.

## Prerequisite

This app need a GridDB server.

Make sure to check out this [blog](https://griddb.net/en/blog/griddb-on-arm-with-docker/) for instructions on how to install GridDB using Docker on ARM machines.

## Build

Clone this repository and build the app with docker.

```shell
docker build -t node-griddb-arm .
```

## Running the code

```shell
docker run --name griddb-node --network griddb-net -e GRIDDB_CLUSTER_NAME=myCluster -e GRIDDB_USERNAME=admin -e GRIDDB_PASSWORD=admin -e IP_NOTIFICATION_MEMBER=griddb-server:10001 node-griddb-arm
```
