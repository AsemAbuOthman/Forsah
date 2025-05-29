const { log, error } = require('console');
const {getConnection} = require('../config/clsConfig');
const { deleteFavourite } = require('../controller/clsFreelancer.controller');

class clsFreelancer {

    static async getFreelancers(userId, page = 1, filters = {}) { 
        let result;
        try {
            const pool = await getConnection();
            const pageSize = 10;
            const offset = (page - 1) * pageSize;
    
            // Step 1: Get paginated users
            const userQuery = `
                SELECT 
                    u.[userId], u.[username], u.[password], u.[email], u.[firstName],
                    u.[lastName], u.[companyName], u.[languageId], u.[phone],
                    u.[locationUrl], u.[currencyId], u.[countryId], u.[zipCode],
                    u.[city], u.[dateOfBirth], u.[isActive], u.[roleId], u.[createdAt],
                    u.[professionalTitle], u.[hourlyRate]
                FROM [Forsah].[dbo].[users] AS u
                WHERE u.[roleId] = 1
                ORDER BY u.createdAt DESC
                OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
            `;
    
            const userRequest = pool.request();
            userRequest.input("offset", offset);
            userRequest.input("pageSize", pageSize);
    
            const userResult = await userRequest.query(userQuery);
            const users = userResult.recordset;
    
            if (!users || users.length === 0) return { users: [], totalUsers: 0 };
    
            const userIds = users.map(u => u.userId);
    
            // Step 2: Get user profiles
            const profileQuery = `
                SELECT [profileId], [profileDescription], [userId]
                FROM [Forsah].[dbo].[profiles]
                WHERE [userId] IN (${userIds.map((_, i) => `@uid${i}`).join(",")})
            `;
    
            const profileRequest = pool.request();
            userIds.forEach((id, i) => profileRequest.input(`uid${i}`, id));
    
            const profileResult = await profileRequest.query(profileQuery);
            const profiles = profileResult.recordset;
    
            const profileMap = {};
            const profileIds = [];
            profiles.forEach(p => {
                profileMap[p.userId] = p;
                profileIds.push(p.profileId);
            });
    
            // Step 3: Get profile images
            let imageMap = {};
            if (profileIds.length > 0) {
                const imageQuery = `
                    WITH RankedImages AS (
                        SELECT 
                            [imageId], [imageUrl], [imageableId], [createdAt],
                            ROW_NUMBER() OVER (PARTITION BY [imageableId] ORDER BY [createdAt] DESC) AS rn
                        FROM [Forsah].[dbo].[images]
                        WHERE [imageableType] = 'profile' AND [imageableId] IN (${profileIds.map((_, i) => `@pid${i}`).join(",")})
                    )
                    SELECT * FROM RankedImages WHERE rn = 1;
                `;
    
                const imageRequest = pool.request();
                profileIds.forEach((id, i) => imageRequest.input(`pid${i}`, id));
    
                const imageResult = await imageRequest.query(imageQuery);
                imageResult.recordset.forEach(img => {
                    imageMap[img.imageableId] = img;
                });
            }
    
            // Step 4: Get user skills
            const skillQuery = `
                SELECT us.userId, s.skillId, s.skillName
                FROM [Forsah].[dbo].[userSkills] us
                INNER JOIN [Forsah].[dbo].[skills] s ON s.skillId = us.skillId
                WHERE us.userId IN (${userIds.map((_, i) => `@sid${i}`).join(",")})
            `;
    
            const skillRequest = pool.request();
            userIds.forEach((id, i) => skillRequest.input(`sid${i}`, id));
    
            const skillResult = await skillRequest.query(skillQuery);
            const skillsMap = {};
            skillResult.recordset.forEach(row => {
                if (!skillsMap[row.userId]) skillsMap[row.userId] = [];
                skillsMap[row.userId].push({ skillId: row.skillId, skillName: row.skillName });
            });
    
            // Step 5: Get favorite freelancers for current user
            const favoriteQuery = `
                SELECT favouriteId
                FROM favouriteUsers
                WHERE userId = @currentUserId AND favouriteId IN (${userIds.map((id, i) => `${id}`).join(",")})
            `;
    
            const favoriteRequest = pool.request();
            favoriteRequest.input("currentUserId", userId);
    
            const favoriteResult = await favoriteRequest.query(favoriteQuery);
            const favoriteSet = new Set(favoriteResult.recordset.map(row => row.favouriteId));
    
            // Step 6: Get total users for pagination
            const countResult = await pool.request().query(`
                SELECT COUNT(*) AS totalUsers FROM [Forsah].[dbo].[users] WHERE [roleId] = 1
            `);
    
            const totalUsers = countResult.recordset[0].totalUsers;
    
            // Step 7: Combine all data
            const usersWithData = users.map(user => {
                const profile = profileMap[user.userId] || null;
                const profileImage = profile ? imageMap[profile.profileId] || null : null;
                return {
                    ...user,
                    profile,
                    profileImage,
                    skills: skillsMap[user.userId] || [],
                    isFavourite: favoriteSet.has(user.userId)
                };
            });
    
            result = {
                users: usersWithData,
                totalUsers
            };
    
        } catch (err) {
            console.error("Error fetching freelancers:", err);
            return null;
        }
    
        return result;
    }
    

        static async getFavouriteFreelancers(userId, page = 1, filters = {}) {
            let result;
            try {
                const pool = await getConnection();
                const pageSize = 10;
                const offset = (page - 1) * pageSize;
        
                // Step 1: Get favorite users for the current user
                const favoriteQuery = `
                    SELECT favouriteId
                    FROM favouriteUsers
                    WHERE userId = @userId
                    ORDER BY favouriteId DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
                `;
        
                const favoriteRequest = pool.request();
                favoriteRequest.input("userId", userId);
                favoriteRequest.input("offset", offset);
                favoriteRequest.input("pageSize", pageSize);
        
                const favoriteResult = await favoriteRequest.query(favoriteQuery);

                const favorites = favoriteResult.recordset;
        
                if (!favorites || favorites.length === 0) return { users: [], totalUsers: 0 };
        
                const favoriteUserIds = favorites.map(f => f.favouriteId);
        
                
                // Step 2: Get paginated users data for the favorite users
                const userQuery = `
                    SELECT 
                        u.[userId], u.[username], u.[password], u.[email], u.[firstName],
                        u.[lastName], u.[companyName], u.[languageId], u.[phone],
                        u.[locationUrl], u.[currencyId], u.[countryId], u.[zipCode],
                        u.[city], u.[dateOfBirth], u.[isActive], u.[roleId], u.[createdAt],
                        u.[professionalTitle], u.[hourlyRate]
                    FROM [Forsah].[dbo].[users] AS u
                    WHERE u.[userId] IN (${favoriteUserIds.map((id, i) => `${id}`).join(",")})
                    ORDER BY u.createdAt DESC;
                `;
                
                const userRequest = pool.request();
        
                const userResult = await userRequest.query(userQuery);
                const users = userResult.recordset;
        
                console.log("userQuery : ", userQuery);
                

                if (!users || users.length === 0) return { users: [], totalUsers: 0 };
        
                // Step 3: Get user profiles
                const profileQuery = `
                    SELECT [profileId], [profileDescription], [userId]
                    FROM [Forsah].[dbo].[profiles]  -- Fixed typo: was 'profiles'
                    WHERE [userId] IN (${favoriteUserIds.map((_, i) => `@uid${i}`).join(",")})
                `;
        
                const profileRequest = pool.request();
                favoriteUserIds.forEach((id, i) => profileRequest.input(`uid${i}`, id));
        
                const profileResult = await profileRequest.query(profileQuery);
                const profiles = profileResult.recordset;
        
                const profileMap = {};
                const profileIds = [];
                profiles.forEach(p => {
                    profileMap[p.userId] = p;
                    profileIds.push(p.profileId);
                });
        
                // Step 4: Get profile images
                let imageMap = {};
                if (profileIds.length > 0) {
                    const imageQuery = `
                        WITH RankedImages AS (
                            SELECT 
                                [imageId], [imageUrl], [imageableId], [createdAt],
                                ROW_NUMBER() OVER (PARTITION BY [imageableId] ORDER BY [createdAt] DESC) AS rn
                            FROM [Forsah].[dbo].[images]
                            WHERE [imageableType] = 'profile' AND [imageableId] IN (${profileIds.map((_, i) => `@pid${i}`).join(",")})
                        )
                        SELECT * FROM RankedImages WHERE rn = 1;
                    `;
        
                    const imageRequest = pool.request();
                    profileIds.forEach((id, i) => imageRequest.input(`pid${i}`, id));
        
                    const imageResult = await imageRequest.query(imageQuery);
                    imageResult.recordset.forEach(img => {
                        imageMap[img.imageableId] = img;
                    });
                }
        
                // Step 5: Get user skills
                const skillQuery = `
                    SELECT us.userId, s.skillId, s.skillName
                    FROM [Forsah].[dbo].[userSkills] us
                    INNER JOIN [Forsah].[dbo].[skills] s ON s.skillId = us.skillId
                    WHERE us.userId IN (${favoriteUserIds.map((_, i) => `@sid${i}`).join(",")})
                `;
        
                const skillRequest = pool.request();
                favoriteUserIds.forEach((id, i) => skillRequest.input(`sid${i}`, id));
        
                const skillResult = await skillRequest.query(skillQuery);
                const skillsMap = {};
                skillResult.recordset.forEach(row => {
                    if (!skillsMap[row.userId]) skillsMap[row.userId] = [];
                    skillsMap[row.userId].push({ skillId: row.skillId, skillName: row.skillName });
                });
        
                // Step 6: Get total favorite users count for pagination
                const countResult = await pool.request()
                    .input("userId", userId)
                    .query(`
                        SELECT COUNT(*) AS totalUsers 
                        FROM favouriteUsers
                        WHERE userId = @userId
                    `);
        
                const totalUsers = countResult.recordset[0].totalUsers;
        
                // Step 7: Combine all data and mark as favorite
                const usersWithData = users.map(user => {
                    const profile = profileMap[user.userId] || null;
                    const profileImage = profile ? imageMap[profile.profileId] || null : null;
                    return {
                        ...user,
                        profile,
                        profileImage: profileImage ? { imageUrl: profileImage.imageUrl } : null,
                        skills: skillsMap[user.userId] || [],
                        isFavorite: true // Since these are all favorites
                    };
                });
        
                result = {
                    users: usersWithData,
                    totalUsers
                };
        
            } catch (err) {
                console.error("Error fetching favorite freelancers:", err);
                throw err; // Better to throw the error so it can be handled by the caller
            }
        
            return result || { users: [], totalUsers: 0 }; // Ensure we always return something
        }

        static async addFavourite(userId, favUserId){

            let result = null;


            try {
                
                const pool = await getConnection();
    
                result = await pool.request().query`
    
                    INSERT INTO  favouriteUsers 
                        (userId, favouriteId)
                    VALUES(${userId}, ${favUserId});
                    `;
                    
                    if(result.rowsAffected[0] > 0){

                        result = {success: true};
                    }else{

                        result = {success: false};
                    }
                    
                    console.log('Here : ', result);
            } catch (err) {
                
                console.log(' favouriteUsers : ' + err);
            }
    
            return result; 
        }

        static async deleteFavourite(userId, favUserId){

            let result = null;

            try {
                
                const pool = await getConnection();
    
                result = await pool.request().query`
    
                    DELETE FROM favouriteUsers 
                        WHERE userId = ${userId} AND favouriteId = ${favUserId};
                    `;
                    
                    if(result.rowsAffected[0] > 0){

                        result = {success: true};
                    }else{

                        result = {success: false};
                    }
                    
                    console.log('Here : ', result);
            } catch (err) {
                
                console.log(' favouriteUsers : ' + err);
            }
    
            return result; 
        }
}


(async ()=>{

    console.log(await clsFreelancer.getFreelancers(2079));
    
})()

module.exports = clsFreelancer;