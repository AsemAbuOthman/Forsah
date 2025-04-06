const http = require('http');
const url = require('url'); 
const path = require('path');
const {createReadStream} = require('fs');


const server = http.createServer((req, res)=>{

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    const parsedUrl = url.parse(req.url, true);
    const pathUrl = parsedUrl.pathname;    
    const query = parsedUrl.query;

    if(pathUrl === '/'){

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(`<p>Hello World!</p>`)
    }else if(pathUrl === '/api'){

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'This is from node js api :) '}))
    }
    
})

const port = 3000;
server.listen(port, (err)=>{

    console.log('Server is listening on port : ', port);

    if(err){

        console.log(err);
    }
})