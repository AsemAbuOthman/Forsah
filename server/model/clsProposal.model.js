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
                images.imageUrl,
                projects.projectTitle


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

    static async getMyProposals(userId) {
        let result = null;
        console.log('userId : ', userId);
    
        try {
            const pool = await getConnection();
    
            const queryResult = await pool.request().query`
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
                    users.createdAt AS joinedDate,
    
                    languages.language,
                    countries.countryName,
                    images.imageUrl,
    
                    projects.projectId AS proj_projectId,
                    projects.projectTitle,
                    projects.projectDeadline,
                    projects.minBudget,
                    projects.maxBudget,
                    projects.projectDescription,
                    projects.projectStateId
    
                FROM proposals
                INNER JOIN projects ON proposals.projectId = projects.projectId
                INNER JOIN users ON users.userId = proposals.userId
                INNER JOIN countries ON countries.countryId = users.countryId
                INNER JOIN languages ON languages.languageId = users.languageId
                INNER JOIN profiles ON profiles.userId = proposals.userId
                INNER JOIN images ON profiles.profileId = images.imageableId AND images.imageableType = 'profile'
                INNER JOIN proposalStates ON proposalStates.proposalStateId = proposals.proposalStateId
    
                WHERE proposals.userId = ${userId}
                ORDER BY proposals.createdAt DESC
            `;
    
            const proposalsResult = queryResult.recordset;
    
            // Group and format result
            const proposals = proposalsResult.map(row => ({
                proposalId: row.proposalId,
                projectId: row.projectId,
                userId: row.userId,
                proposalAmount: row.proposalAmount,
                proposalDeadline: row.proposalDeadline,
                proposalDescription: row.proposalDescription,
                createdAt: row.createdAt,
                proposalStateId: row.proposalStateId,
    
                user: {
                    username: row.username,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    city: row.city,
                    joinedDate: row.joinedDate,
                    countryName: row.countryName,
                    language: row.language,
                    profileImage: row.imageUrl
                },
    
                project: {
                    projectId: row.proj_projectId,
                    projectTitle: row.projectTitle,
                    projectDeadline: row.projectDeadline,
                    minBudget: row.minBudget,
                    maxBudget: row.maxBudget,
                    projectDescription: row.projectDescription,
                    projectStateId: row.projectStateId
                }
            }));
    
            result = { proposals };
    
        } catch (error) {
            console.error("Error in getMyProposals:", error);
        }
    
        return result;
    }
    

    static async getRecommendedProposals(userId) {
        let result = null;
    
        try {
            const pool = await getConnection();
    
            result = await pool.request().query`
                WITH RankedProposals AS (
                    SELECT 
                        p.proposalId,
                        p.projectId,
                        p.userId,
                        p.proposalAmount,
                        p.proposalDeadline,
                        p.proposalDescription,
                        p.createdAt,
                        p.proposalStateId,
                        u.username,
                        u.firstName,
                        u.lastName,
                        u.city,
                        u.createdAt as joinedDate,
                        l.language,
                        c.countryName,
                        img.imageUrl,
                        pr.projectTitle,
                        ROW_NUMBER() OVER (PARTITION BY p.projectId ORDER BY p.createdAt DESC) as rn
                    FROM 
                        proposals p
                    INNER JOIN 
                        projects pr ON p.projectId = pr.projectId
                    INNER JOIN 
                        users u ON u.userId = p.userId
                    INNER JOIN 
                        countries c ON c.countryId = u.countryId
                    INNER JOIN 
                        languages l ON l.languageId = u.languageId
                    INNER JOIN 
                        profiles pf ON pf.userId = p.userId
                    INNER JOIN 
                        images img ON pf.profileId = img.imageableId AND img.imageableType = 'profile'
                    WHERE 
                        pr.userId = ${userId} 
                        AND p.proposalStateId = 1
                )
                SELECT * FROM RankedProposals WHERE rn <= 3
                ORDER BY createdAt DESC;
            `;
    
            const proposalsResult = result.recordset;
    
            result = {
                success: true,
                proposals: proposalsResult
            };
    
        } catch (error) {
            console.error("Error getting recommended proposals:", error);
            result = {
                success: false,
                error: error.message
            };
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
                    (proposalAmount, proposalDescription, proposalDeadline, userId, projectId, proposalStateId)
                    VALUES(${proposalData.proposalAmount}, ${proposalData.proposalDescription}, ${proposalData.proposalDeadline}, ${proposalData.userId}, ${proposalData.projectId}, 1);
            `;

            result = await this.getProposals(parseInt(proposalData.projectId));
            
        } catch (error) {

            console.log(error);
        }

        return result;
    }   

    static async updateProposal(proposalId, proposalData){

        let result =  null;
        
        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
            
                UPDATE  proposals 
                    SET proposalAmount = ${proposalData.proposalAmount}, proposalDescription = ${proposalData.proposalDescription}, proposalDeadline = ${proposalData.proposalDeadline}
                WHERE proposalId = ${proposalId};
            `;

            if(result.rowsAffected[0] > 0){

                result = {success: true}
            }else{

                result = {success: false}
            }
            
        } catch (error) {

            console.log(error);
        }

        return result;
    }   

    static async deleteProposal(proposalId){

        let result =  null;

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
            
                DELETE FROM proposals
                    WHERE proposalId = ${proposalId};
            `;

            if(result.rowsAffected[0] > 0){

                result = {success: true}
            }else{

                result = {success: false}
            }

        } catch (error) {

            console.log(error);
        }

        return result;
    }   

}

// (async () => {

//     try {
        
//         const result = await clsProposal.getMyProposals(2079);
//         console.log('result : ', result);
//     } catch (error) {
        
//         console.log(error);
//     }
    
// })();


module.exports = clsProposal;