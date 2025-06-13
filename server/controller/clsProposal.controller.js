const clsProposal = require('../model/clsProposal.model');


    const getProposals =  async (req, res, projectId)=>{

        try {
            
            console.log('ProjectId -> : ', projectId);
            

            const proposals = await clsProposal.getProposals(JSON.parse(projectId));

            if (proposals) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(proposals));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }
        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getRecommendedProposals =  async (req, res, userId)=>{

        try {
            
            const proposals = await clsProposal.getRecommendedProposals(userId);

            if (proposals) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(proposals));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }
        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getMyProposals =  async (req, res, userId)=>{

        try {
            
            const proposals = await clsProposal.getMyProposals(userId);

            if (proposals) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(proposals));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }
        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const checkProposals =  async (req, res, projectId, freelancerId)=>{

        try {
            
            console.log('ProjectId : ', projectId);
            

            const result = await clsProposal.checkProposal(projectId, freelancerId);

            if (result) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }
        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const createProposal = async (req, res, newData) => {

        console.log('proposal data : ', newData);

        try {
            
            const proposal = await clsProposal.createProposal(JSON.parse(newData));

            console.log("???????? ", proposal);

            if(proposal){

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(proposal));
            }else{

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error !!' }));
        }
    }

    const updateProposal = async (req, res, proposalId, proposalData) => {

        try {
            
            const result = await clsProposal.updateProposal(proposalId, JSON.parse(proposalData));

            if(result){

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }else{

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error !!' }));
        }
    }

    const deleteProposal = async (req, res, proposalId) => {

        try {
            
            const result = await clsProposal.deleteProposal(proposalId);

            if(result){

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }else{

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error !!' }));
        }
    }


module.exports = {

    getProposals,
    getRecommendedProposals,
    getMyProposals,
    createProposal,
    checkProposals,
    updateProposal,
    deleteProposal
}