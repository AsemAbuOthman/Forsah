const clsFreelancer = require('../model/clsFreelancer.model');

const getFreelancers = async (req, res, page, filters) => {

    try {
    
        const freelancers = await clsFreelancer.getFreelancers(page, filters);

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

module.exports = {

    getFreelancers
}