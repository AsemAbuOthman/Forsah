const { getConnection, closeConnection } = require("../config/clsConfig");

class clsProposal{

    static async getProposals(projectId){

        let result = null;
        console.log('projectId : ', projectId);

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
            
                SELECT 
                proposals.proposalId,
                proposals.projectId,
                proposals.userId,
                proposals.proposalAmount,
                proposals.proposalDeadline,
                proposals.proposalDescription,
                proposals.createdAt,
                proposals.proposalStateId,
                users.username,
                users.firstName,
                users.lastName,
                users.city,
                proposals.createdAt[0],
                users.createdAt as joinedDate,
                languages.language,
                countries.countryName,
                images.imageUrl


                FROM proposals
                INNER JOIN projects ON proposals.projectId = projects.projectId
                INNER JOIN users ON users.userId = proposals.userId
                INNER JOIN countries ON countries.countryId = users.countryId
                INNER JOIN languages ON languages.languageId = users.languageId
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
            const pool = await getConnection();
    
            const queryResult = await pool.request().query`
                SELECT TOP 1 1 AS isExist
                FROM proposals
                WHERE projectId = ${projectId} AND userId = ${freelancerId}
            `;

            result.hasSubmitted =  queryResult.recordset.length > 0 ;
        } catch (error) {

            console.error('Error checking proposal:', error);
        }
    
        return result;
    }

    static async createProposal(proposalData){

        let result =  null;
        console.log('proposalData : ', proposalData);
        
        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
            
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

// (async () => {

//     try {
        
//         const result = await clsProposal.checkProposal(1074, 2026);
//         console.log('result : ', result);
//     } catch (error) {
        
//         console.log(error);
//     }
    
// })();


module.exports = clsProposal;