# Closeness Centrality

This project aim is to calculate closeness centrality over a graph set. Under the lib folder there is a closeness module that given a list of edges separate by line calculates and ranks users by their closeness centrality. Edges.txt is an example file, each line has a connection between two users

## Using

First install pm2 globally
```
npm install -g pm2
```

Clone this project
```
git clone https://github.com/renanosf/closeness-centrality
```

Install dependencies
```
cd closeness-centrality
npm install
```

Run pm2
```
pm2 start server.js --name Closeness --watch
```

Go to your browser and access http://localhost:3000. Click login with facebook and enter the user test
```
joao_lrhvhtx_da_silva@tfbnw.net
Closeness
```

You'll see a list of users ordered by closeness centrality. Similarly you can calculate closeness centrality by providing a file direct to edges.js
```
node edges.js --file edges.txt
```
