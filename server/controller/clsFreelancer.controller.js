const { log } = require('node:console');
const clsFreelancer = require('../model/clsFreelancer.model');

const getFreelancers = async (req, res, userId, page, filters) => {

    try {
    
        const freelancers = await clsFreelancer.getFreelancers(userId, page, filters);

        console.log('freelancers : ', freelancers);
        

        if (freelancers) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(freelancers));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
        } catch (error) {
            console.log('Login Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};

const getFavouriteFreelancers = async (req, res, userId, page, filters) => {

    try {
    
        const freelancers = await clsFreelancer.getFavouriteFreelancers(userId, page, filters);

        console.log('freelancers : ', freelancers);
        

        if (freelancers) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(freelancers));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
        } catch (error) {
            console.log('Login Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
    }

    
};

const addFavourite = async (req, res, userId, favUserId) => {


    try {
    
        const result = await clsFreelancer.addFavourite(userId, favUserId);

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
        } catch (error) {
            console.log('Login Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
    }

    
};

const deleteFavourite = async (req, res, userId, favUserId) => {

    try {
    
        const result = await clsFreelancer.deleteFavourite(userId, favUserId);

        console.log('result : ', result);
        

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
        } catch (error) {
            console.log('Login Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
    }

    
};

module.exports = {

    getFreelancers,
    getFavouriteFreelancers,
    addFavourite,
    deleteFavourite
}