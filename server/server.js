const http = require('http');
const url = require('url'); 
const path = require('path');
const getRawBody = require('raw-body')
const {getUser, getCountries, getCurrencies, getCategories, insertUser, findUser} = require('./controller/clsUser.controller');


const server = http.createServer(async (req, res)=>{

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    const parsedUrl = url.parse(req.url, true);
    const pathUrl = parsedUrl.pathname;    
    const query = parsedUrl.query;
    
    
    if(pathUrl === '/api'){

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'This is from node js api :) '}))
        return; 
    }
    
    if (pathUrl === '/api/login' && req.method === 'POST')  {

        let body = await getRawBody(req);

        console.log('Posting to api/user ... body => ', body.toString());
        return getUser(req, res, body.toString());
    }


    if(pathUrl === '/api/countries'){

        console.log('Fetching to api/countries ... body => ');
        return getCountries(req, res);
    }

    if(pathUrl === '/api/currencies'){

        console.log('Fetching to api/currencies ... body => ');
        return getCurrencies(req, res);
    }

    if(pathUrl === '/api/categories'){

        console.log('Fetching to api/categories ... body => ');
        return getCategories(req, res);
    }

    if (pathUrl === '/api/signup' && req.method === 'POST')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/inserting New User ... body => ', body.toString());
        return insertUser(req, res, body.toString());
    }

    if (pathUrl === '/api/users/:id')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/finding User using id ... body => ', body.toString());
        return findUser(req, res, body.id.toString());
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Error', message: 'Not Found' }));
    return;
})

const port = 3000;
server.listen(port, (err)=>{

    console.log('Server is listening on port : ', port);

    if(err){

        console.log(err);
    }
})