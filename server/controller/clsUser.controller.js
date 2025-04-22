const clsUser = require('../model/clsUser.model');


    const getUser = async (req, res, body) => {
        try {
            const { email, password } = JSON.parse(body);
        
            const user = await clsUser.findUserByEmailPassword(email, password);
        
            // console.log( 'user : ', user);

            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getCountries = async (req, res)=>{
        try {
            const countries = await clsUser.getAllCountries();
            
            if (countries) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(countries));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getCurrencies = async (req, res)=>{
        try {
            const countries = await clsUser.getAllCurrencies();
            
            if (countries) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(countries));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }


    const getCategories = async (req, res)=>{
        try {
            const categories = await clsUser.getAllCategories();
            
            if (categories) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(categories));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const insertUser = async (req, res, body)=>{
        try {
            const user = JSON.parse(body);

            const rowsAffected = await clsUser.insertUser(user);
            
            if (rowsAffected) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Added Successfully :)' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

module.exports = {getUser, getCountries, getCurrencies, getCategories, insertUser};