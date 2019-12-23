#!/bin/bash

#output commands (i.e. turn debug info on/off)
#set -x
#enable fg and bg commands
set -m

#run couchbase in the background so server can be configured
/entrypoint.sh couchbase-server &

sleep 15

CB_URL=$CB_HOST:$CB_PORT

# Setup data and index memory quota
echo "initializing cluster..."
couchbase-cli cluster-init -c $CB_URL \
--cluster-username $CB_USER  \
--cluster-password $CB_PASSWORD \
--cluster-ramsize 512 \
--cluster-fts-ramsize 512 \
--cluster-index-ramsize 512 \
--services data,index,query,fts

sleep 3

#check on server
couchbase-cli server-list -c $CB_HOST -u Administrator -p password
echo "cluster initialized. URL: $CB_URL"
sleep 3

#create bucket via couchbase-cli
echo "creating bucket..."
couchbase-cli bucket-create -c $CB_URL --username Administrator --password password \
--bucket $CB_BUCKET --bucket-type couchbase --bucket-ramsize 256 --enable-flush 1
sleep 3

#load sample bucket via couchbase-cli
echo "loading sample data..."
/opt/couchbase/bin/cbdocloader -c $CB_URL -u Administrator -p password -b $CB_BUCKET \
-m 1024 -d /opt/couchbase/samples/$CB_BUCKET.zip

#this is used so that container doesn't stop
fg 1