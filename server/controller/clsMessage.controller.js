const clsMessage = require('../model/clsMessage.model');


const getContacts = async (req, res, userId)=>{

    try {

        const result = await clsMessage.getContacts(userId);
        
        // console.log( 'Fetching Contacts : ', result);

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
}

const createContact = async (req, res, userId, contactId)=>{

    try {

        const result = await clsMessage.createContact(userId, contactId);
    
        console.log( 'Create contact : ', result);

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
}

const sendMessage = async (req, res, data)=>{

    console.log('data : ', data);
    
    try {

        const result = await clsMessage.sendMessage(JSON.parse(data));
    
        console.log( 'send message : ', result);

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
        } catch (error) {
            console.log('Login Error : ) ' + error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
}

const replyMessage = async (req, res, data)=>{

    try {

        const result = await clsMessage.replyMessage(JSON.parse(data));
        
        console.log( 'send reply message : ', result);

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

}

const deleteMessage = async (req, res, messageId, userId)=>{

    try {

        const result = await clsMessage.deleteMessage(messageId, userId);
        
        console.log( 'delete message : ', result);

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
}

const getMessageHistory = async (req, res, senderId, receiverId)=>{

    try {

        const result = await clsMessage.getMessageHistory(senderId, receiverId);
        
        // console.log( 'fetching messages : ', result);

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
}

module.exports = {
    getContacts,
    createContact,
    sendMessage,
    replyMessage,
    deleteMessage,
    getMessageHistory
};

