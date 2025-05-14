const { getConnection, closeConnection } = require("../config/clsConfig");
const {getSkills} = require("../model/clsUser.model");

class clsProposal{

    static async getProposals(projectId){

        let result = null;
        console.log('projectId : ', projectId);

        try {
            
            pool = await getConnection();

            result = await pool.query`
            
                SELECT 
                proposals.proposalId,
                proposals.projectId,
                proposals.userId,
                proposals.proposalAmount,
                proposals.proposalDeadline,
                proposals.proposalDescription,
                proposals.createdAt,
                proposals.proposalStateId,
                users.firstName,
                users.lastName,
                countries.countryName,
                images.imageUrl


                FROM proposals
                INNER JOIN projects ON proposals.projectId = projects.projectId
                INNER JOIN users ON users.userId = proposals.userId
                INNER JOIN countries ON countries.countryId = users.countryId
                INNER JOIN profiles ON profiles.userId = proposals.userId
                INNER JOIN images ON profiles.profileId = images.imageableId AND images.imageableType = 'profile'

                WHERE proposals.projectId = ${projectId}
                ORDER BY createdAt DESC

            `  

            const proposalsResult = result.recordset;
    
            result = {

                proposals: proposalsResult
            }

        } catch (error) {

            console.log(error);
        }

        return result;
    }

    static async checkProposal(projectId, freelancerId) {
        
        let result = { hasSubmitted : false};

        try {
            pool = await getConnection();
    
            result = await pool.query`
                SELECT TOP 1 1 AS isExist
                FROM proposals
                WHERE projectId = ${projectId} AND userId = ${freelancerId}
            `;
    
            let hasSubmitted = result.recordset.length > 0;
    
            result =  { hasSubmitted };
        } catch (error) {

            console.error('Error checking proposal:', error);
        }
    
        return result;
    }

    static async createProposal(proposalData){

        let result =  null;
        console.log('proposalData : ', proposalData);
        
        try {
            
            pool = await getConnection();

            result = await pool.query`
            
                INSERT INTO proposals 
                    (proposalAmount, proposalDescription, proposalDeadline, userId, projectId)
                    VALUES(${proposalData.proposalAmount}, ${proposalData.proposalDescription}, ${proposalData.proposalDeadline}, ${proposalData.userId}, ${proposalData.projectId});
            `;

            result = await this.getProposals(parseInt(proposalData.projectId));
            
        } catch (error) {

            console.log(error);
        }

        return result;
    }   

}

(async () => {

    try {
        
        const result = await clsProposal.checkProposal(1073, 2026);
        console.log('result : ', result.hasSubmitted);
    } catch (error) {
        
        console.log(error);
    }
    
})();

module.exports = clsProposal;