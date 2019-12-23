## Getting Started

1. Make sure you have Docker installed
   - docker -v should return output
1. Clone GIT repo
2. cd into cloned repo
3. Startup Couchbase container
   - Make sure the following script you run is executable
   - For v. 6.5 Beta run ./scripts/start-couchbase-65
   - For v. 6.0.3 run ./scripts/start-couchbase-603
4. Run docker-compose up -d
   - after the containers are running, verify you have the following:
     - run docker-compose ps
     - should see 6 containers:  api-java-27, api-java-30b, api-node-26, api-python-25, sdk-demo-nginx, web
5. The demo should be running: go to http://localhost:80
6. When finished run docker-compose down
