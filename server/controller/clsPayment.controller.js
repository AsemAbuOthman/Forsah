const clsPayment = require('../model/clsPayment.model');


const addPayment = async (req, res, paymentData) => {


    try {
    
        const result = await clsPayment.addPayment(JSON.parse(paymentData));

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

const getPayments = async (req, res, userId) => {

    try {
    
        const result = await clsPayment.getPayments(userId);

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

    addPayment,
    getPayments
};