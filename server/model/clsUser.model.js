const { log, error } = require('console');
const {getConnection, closeConnection} = require('../config/clsConfig')

class clsUser{

    static async singOut(){

        let result = null;

        try {
            let isClosed = await closeConnection();

            console.log('isClosed : ', isClosed);
            

            if(isClosed)
            {
                console.log('Connection closed successfully .' );
                result = {message : 'Connection closed successfully .'};
            }else if(global.pool === null){

                result = {message : 'Connection already closed .'};
            }
        } catch (err) {
            
            console.log('Connection closing failed ! ' + err);
        }finally{

            return result; 
        }

    }

    static async getProfile(id){

        let result = null;

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                SELECT * FROM users 
                    INNER JOIN languages ON languages.languageId = users.languageId
                    INNER JOIN currencies ON currencies.currencyId = users.currencyId
                    INNER JOIN countries ON countries.countryId = users.countryId
                    INNER JOIN roles ON roles.roleId = users.roleId
                    INNER JOIN profiles ON profiles.userId  = users.userId 
                    JOIN images ON images.imageableId = profiles.profileId AND images.imageableType = 'profile'
                    WHERE users.userId = ${id}
                `;

            result = {
                user: result.recordset[0], 
            };
                
            
        } catch (err) {
            
            console.log('User Profile : ' + err);
        }

        return result; 
    }

    static async updateProfile(id, newData){

        let result = null;

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`

                DECLARE @profileId INT;

                SELECT @profileId = profileId FROM profiles WHERE userId = ${id};

                UPDATE users SET 
                    firstName = ${newData.firstName}, lastName = ${newData.lastName}, professionalTitle = ${newData.professionalTitle}, hourlyRate = ${newData.hourlyRate}
                    WHERE userId = ${id} 

                UPDATE profiles SET 
                    profileDescription = ${newData.profileDescription}
                    WHERE userId = ${id} 

                UPDATE images SET 
                    imageUrl = ${newData.imageUrl}
                    WHERE imageableId = @profileId AND imageableType = 'profile';
            `

            if ( result.rowsAffected){

                result = await this.getProfile(id);
            }else{

                result = null;
            }
            
            return result;
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 


    static async getPortfolios(userId) {
        let result = null;
    
        try {
            const pool = await getConnection();
    
        // 1. Get basic project info
        const portfoliosResult = await pool.request().query`
            SELECT 
            p.portfolioId,
            p.userId,
            sp.sampleProjectId,
            sp.sampleProjectTitle,
            sp.sampleProjectDescription,
            sp.completionDate,
            sp.sampleProjectUrl
            FROM portfolios p
            INNER JOIN sampleProjects sp ON sp.portfolioId = p.portfolioId 
            WHERE p.userId = ${userId}
        `;
    
        const portfolios = portfoliosResult.recordset;
    
        if (!portfolios || portfolios.length === 0) {
            return { portfolios: [] };
        }
    
        const projectIds = portfolios.map(p => p.sampleProjectId);
    
        // 2. Get images
        const imagesResult = await pool.request().query`
            SELECT 
            i.imageId, 
            i.imageUrl, 
            i.imageableId
            FROM images i
            WHERE i.imageableId IN (${projectIds})
            AND i.imageableType = 'portfolio'
        `;
    
        const imagesMap = imagesResult.recordset.reduce((acc, image) => {
            if (!acc[image.imageableId]) acc[image.imageableId] = [];
            acc[image.imageableId].push({
            imageId: image.imageId,
            imageUrl: image.imageUrl,
            });
            return acc;
        }, {});
    
        // 3. Get skills (joined)
        const skillsResult = await pool.request().query`
            SELECT 
            sps.sampleProjectSkillId,
            sps.sampleProjectId,
            s.skillId,
            s.skillName
            FROM sampleProjectSkills sps
            INNER JOIN skills s ON sps.skillId = s.skillId
            WHERE sps.sampleProjectId IN (${projectIds})
        `;
    
        const skillsMap = skillsResult.recordset.reduce((acc, row) => {
            if (!acc[row.sampleProjectId]) acc[row.sampleProjectId] = [];
            acc[row.sampleProjectId].push({
            sampleProjectSkillId: row.sampleProjectSkillId,
            skillId: row.skillId,
            skillName: row.skillName
            });
            return acc;
        }, {});
    
        // 4. Final mapping to Portfolio interface
        const portfoliosWithData = portfolios.map(p => {
            const images = imagesMap[p.sampleProjectId] || [];
            const skills = skillsMap[p.sampleProjectId] || [];
    
            return {
            portfolioId: p.portfolioId,
            userId: p.userId,
            sampleProjectId: p.sampleProjectId,
            sampleProjectTitle: p.sampleProjectTitle,
            sampleProjectDescription: p.sampleProjectDescription,
            completionDate: p.completionDate,
            sampleProjectUrl: p.sampleProjectUrl,
            images: images,
            imageableId: images.map(img => img.imageId),
            imageableType: "portfolio",
            sampleProjectSkillId: skills.map(s => s.sampleProjectSkillId),
            skillId: skills.map(s => s.skillId),
            skillName: skills.map(s => s.skillName),
            categoryId: [], // Add if categories exist
            categoryName: [],
            projectUrl: p.sampleProjectUrl,
            };
        });
    
        result = { portfolios: portfoliosWithData };
    
        } catch (error) {
        console.error("Error getting portfolios:", error);
        throw new Error("Failed to retrieve portfolios");
        }
    
        return result;
    }

    static async getSkills(id){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting *');

            result = await pool.request().query`
                SELECT * FROM userSkills
                    INNER JOIN skills ON userSkills.skillId = skills.skillId
                    INNER JOIN categories ON categories.categoryId = skills.categoryId
                    WHERE userId = ${id}
                `;
                

                result ={
                    skills: result.recordset,
                };
                
        } catch (err) {
            
            console.log('userSkills : ' + err);
            result = null;
        }

        return result; 
    }

    static async getExperiences(id){

        let result = null;
        

        try {
            
            const pool = await getConnection();
            console.log('db connecting *');

            result= await pool.request().query`
                SELECT * FROM experiences WHERE userId = ${id}
                `;

                
                result ={
                    experiences: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Experiences : ' + err);
            result = null;
        }

        return result; 
    }

    static async getCertifications(id){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * ', id);

            result = await pool.request().query`
                SELECT * FROM certifications WHERE userId = ${id}
                `;
                
                result ={
                    certifications: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        } 

        return result; 
    }

    static async updateCertification(certificationId, newData){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * :::::::: ', certificationId, ' --- ',newData);

            result = await pool.request().query`
                UPDATE certifications 
                    SET certificationTitle = ${newData.certificationTitle},
                        certificationOrganization = ${newData.certificationOrganization},
                        startDate = ${newData.startDate},
                        endDate = ${newData.endDate},
                        certificationUrl = ${newData.certificationUrl}
                    WHERE certificationId = ${certificationId}

                    SELECT userId FROM certifications WHERE certificationId = ${certificationId}
                `;
                
                if (result.recordset.length > 0) {
                    userId = result.recordset[0].userId;
                    
                    result = await this.getCertifications(userId);
                }
                
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        }

        return result; 
    }

    static async deleteCertification(id){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * ', id);

            result = await pool.request().query`

                DELETE FROM certifications 
                    OUTPUT DELETED.userId
                WHERE certificationId = ${id}
                `;
                
                result = await this.getCertifications(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        }

        return result; 
    }

    
    static async getEducations(id){

        let result = null;


        try {
            
            const pool = await getConnection();
            console.log('db connecting *');


            result = await pool.request().query`
                SELECT * FROM educations WHERE userId = ${id}
                `;
                
                result ={
                    educations: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Educations : ' + err);
            result = null;
        }

        return result; 
    }

    
    static async findUserByEmailPassword(email, password){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting', );

            result = await pool.request().query`
                SELECT userId
                FROM USERS 
                WHERE email = ${email} 
                AND password = ${password}
                `;
            
            result = await this.getProfile(result.recordset[0].userId);

        } catch (err) {
            
            console.log('User : ' + err);
        }

        return result; 
    }


    static async getAllCountries(){
        let result = null;


        try {
            const pool = await getConnection();

            result = await pool.request().query`SELECT countryId as value, countryName as label, ISO as code FROM COUNTRIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }

        // console.log('result : ', result);

        return result;
    }

    static async getAllCategories(){
        let result = null;

        try {
            const pool = await getConnection();

            result = await pool.request().query`SELECT categoryId as value, categoryName as label FROM CATEGORIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }

        // console.log('result : ', result);

        return result;
    }

    static async getAllCategoriesWithSkills(){
        let result = null;

        try {
            const pool = await getConnection();

            result = await pool.request().query`SELECT skillId, skillName, categoryName, skills.categoryId 
                                        FROM categories 
                                        INNER JOIN skills ON skills.categoryId = categories.categoryId
                                        ORDER BY categories.categoryId, skillName`;

            const categoriesMap = new Map();
        
            // Group skills by category
            result.recordset.forEach(row => {
                if (!categoriesMap.has(row.categoryName)) {
                    categoriesMap.set(row.categoryName, {
                        name: row.categoryName,
                        options: []
                    });
                }
                
                categoriesMap.get(row.categoryName).options.push({
                    value: row.skillId.toString(), // or row.skillName if you prefer
                    label: row.skillName
                });
            });

            // Convert the Map to an array
            const categoriesArray = Array.from(categoriesMap.values());
            
            return {data: categoriesArray}


        } catch (error) {
            
            console.log(error);
        }

        // console.log('result : ', result);

        return result;
    }


    static async getAllCurrencies(){
        let result = null;

        try {
            const pool = await getConnection();

            result = await pool.request().query`SELECT currencyId as value, code as label, symbol FROM CURRENCIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }

        // console.log('result : ', result);

        return result;
    }

    static async insertUser(user){

        let result = null;

        console.log('User : ', user);
        

        try {
            
            const pool = await getConnection();
            
            result = await pool.request().query`

            DECLARE @newUserId INT;

            INSERT INTO USERS
            (email, password, username, firstname, lastname, roleId, countryId, phone, currencyId, professionalTitle, hourlyRate, languageId, city, zipCode)
            VALUES(${user.email}, ${user.password},${user.username},${user.firstName},${user.lastName}, ${user.roleId}, ${user.countryId.value},${user.phone},${user.currencyId.value},${user.professionalTitle}, ${parseInt(user.hourlyRate)}, ${user.languageId.value},${user.city},${user.zipCode});

            Set @newUserId = SCOPE_IDENTITY();
            
            INSERT INTO PROFILES 
            (profileDescription, userId)
            VALUES(${user.profileDescription}, @newUserId)

            DECLARE @newProfileId INT;

            Set @newProfileId = SCOPE_IDENTITY();

            INSERT INTO IMAGES 
            (imageUrl, imageableType, imageableId)
            VALUES(${user.imageUrl}, 'profile', @newProfileId)

            SELECT @newUserId AS newUserId;
            `
            if ( result.rowsAffected) {
                const newUserId = result.recordset[0].newUserId;
                console.log('New User ID:', newUserId);
            
                for (const interest of user.interests) {
                    // Step 1: Get all skills for that category
                    const skillResult = await pool.request().query`
                        SELECT skillId FROM SKILLS WHERE categoryId = ${interest.value}
                    `;
            
                    // Step 2: Map skills to insert values
                    const skillValues = skillResult.recordset
                        .map(skill => `(${newUserId}, ${skill.skillId})`)
                        .join(', ');
            
                    // Step 3: Insert skills into USER_SKILLS
                    if (skillValues) {
                        await pool.request().query(`
                            INSERT INTO USERSKILLS (userId, skillId)
                            VALUES ${skillValues}
                        `);
                    }
                }
            }
            
            return result.rowsAffected;
        } catch (error) {
            
            console.log(error);
        }

        return result;
    }

    // sampleProjectId	portfolioId	sampleProjectTitle	sampleProjectDescription	completionDate	sampleProjectUrl
    static async createPortfolio(id, newData){

        let result =  null;

        // console.log('Portfolio Data : ', newData);

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                DECLARE @newPortfolioId INT;
                
                INSERT INTO portfolios (userId)
                    VALUES(${id});

                Set @newPortfolioId = SCOPE_IDENTITY();

                DECLARE @sampleProjectId INT;
                
                INSERT INTO sampleProjects (portfolioId, sampleProjectTitle, sampleProjectDescription, completionDate, sampleProjectUrl)
                    VALUES(@newPortfolioId , ${newData.sampleProjectTitle}, ${newData.sampleProjectDescription}, ${newData.completionDate}, ${newData.sampleProjectUrl});
            
                Set @sampleProjectId = SCOPE_IDENTITY();
            
                SELECT @sampleProjectId AS sampleProjectId;
            `
            if (result.rowsAffected) {
                const sampleProjectId = await result.recordset[0].sampleProjectId;
                console.log('New SamplePorject ID:', sampleProjectId);

                    const imagesUrlValues = newData.images
                        .map(singleImageUrl => `('${singleImageUrl.imageUrl}', ${sampleProjectId}, 'portfolio')`)
                        .join(', ');
            
                        console.log('imagesUrlValues : ', imagesUrlValues);

                    if (imagesUrlValues) {
                        await pool.query(`
                            INSERT INTO images (imageUrl, imageableId, imageableType)
                                VALUES ${imagesUrlValues};
                        `);
                    }


                for (const interest of newData.skillId) {
                    // Step 1: Get all skills for that category
                    const skillResult = await pool.request().query`
                        SELECT skillId FROM SKILLS WHERE categoryId = ${interest.value}
                    `;          
            
                    // Step 2: Map skills to insert values
                    const skillValues = skillResult.recordset
                        .map(skill => `(${newUserId}, ${skill.skillId})`)
                        .join(', ');
            
                    // Step 3: Insert skills into USER_SKILLS
                    if (skillValues) {
                        await pool.query(`
                            INSERT INTO sampleProjectSkills (sampleProjectId, skillId)
                                VALUES(@sampleProjectId); ${skillValues}
                        `);
                    }
                }

                result = await this.getPortfolios(id);
            }
            
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 


    static async createCertification( newData){

        let result =  null;

        // console.log('Certification Data : ', newData);

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                INSERT INTO certifications 
                    (userId, certificationTitle, certificationOrganization, startDate, endDate, certificationUrl)
                VALUES(${newData.userId},${newData.certificationTitle},${newData.certificationOrganization},${newData.startDate},${newData.endDate},${newData.certificationUrl})
            `

            result = await this.getCertifications(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 

    static async createExperience( newData){

        let result =  null;

        // console.log('Experience Data : ', newData);

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                INSERT INTO experiences 
                    (userId, experienceTitle, experienceDescription, experienceCompanyName, startDate, endDate)
                VALUES(${newData.userId},${newData.experienceTitle},${newData.experienceDescription},${newData.experienceCompanyName},${newData.startDate},${newData.endDate})
            `

            result = await this.getExperiences(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 

    static async updateExperience(experienceId, newData){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * :::::::: ', experienceId, ' --- ', newData);

            result = await pool.request().query`
                UPDATE experiences 
                    SET experienceTitle = ${newData.experienceTitle},
                        experienceDescription = ${newData.experienceDescription},
                        startDate = ${newData.startDate},
                        endDate = ${newData.endDate},
                        experienceCompanyName = ${newData.experienceCompanyName}
                    WHERE experienceId = ${experienceId}

                    SELECT userId FROM experiences WHERE experienceId = ${experienceId}
                `;
                
                if (result.recordset.length > 0) {
                    userId = result.recordset[0].userId;
                    
                    result = await this.getExperiences(userId);
                }
                
        } catch (err) {
            
            console.log('user Experiences : ' + err);
        } 

        return result; 
    }

    static async deleteExperience(id){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * ', id);

            result = await pool.request().query`

                DELETE FROM experiences 
                    OUTPUT DELETED.userId
                WHERE experienceId = ${id}
                `;
                
                result = await this.getExperiences(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        }

        return result; 
    }


    static async createEducation( newData){

        let result =  null;

        // console.log('Education Data : ', newData);

        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                INSERT INTO educations 
                    (userId, educationDegree, educationOrganization, startDate, endDate, educationDescription)
                VALUES(${newData.userId},${newData.educationDegree},${newData.educationOrganization},${newData.startDate},${newData.endDate}, ${newData.educationDescription})
            `

            result = await this.getEducations(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 

    static async updateEducation(educationId, newData){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * :::::::: ', educationId, ' --- ', newData);

            result = await pool.request().query`
                UPDATE educations 
                    SET educationDegree = ${newData.educationDegree},
                        educationOrganization = ${newData.educationOrganization},
                        educationDescription = ${newData.educationDescription},
                        startDate = ${newData.startDate},
                        endDate = ${newData.endDate}
                    WHERE educationId = ${educationId}

                    SELECT userId FROM educations WHERE educationId = ${educationId}
                `;
                
                if (result.recordset.length > 0) {
                    userId = result.recordset[0].userId;
                    
                    result = await this.getEducations(userId);
                }
                
        } catch (err) {
            
            console.log('user Education : ' + err);
        } 

        return result; 
    }

    static async deleteEducation(id){

        let result = null;

        try {
            
            const pool = await getConnection();
            console.log('db connecting * ', id);

            result = await pool.request().query`

                DELETE FROM educations 
                    OUTPUT DELETED.userId
                WHERE educationId = ${id}
                `;
                
                result = await this.getEducations(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Educations : ' + err);
        } 

        return result; 
    }
}


// console.log(clsUser.getExperiences(2026));

// console.log(

//     clsUser.createPortfolio(2026, {
//     "sampleProjectTitle": "Coffee-POS",
//     "sampleProjectDescription": "CalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljsCalljdfskjfljs",
//     "imageUrl": [
//         "https://images.unsplash.com/photo-1552581234-26160f608093",
//         "https://firebasestorage.googleapis.com/v0/b/forsah-3fad5.firebasestorage.app/o/portfolio-images%2F9ef1f735-b32d-4ccb-8fe7-0eedec635462.png?alt=media&token=02482170-92e7-4125-8179-04eb5adb8bbf"
//     ],
//     "completionDate": "2025-05-01T14:15:05.309Z",
//     "sampleProjectUrl": "",
//     "sampleProjectSkillId": [],
//     "skillId": [],
//     "skillName": [],
//     "categoryId": [],
//     "categoryName": [],
//     "imageableId": [],
//     "imageableType": "portfolio",
//     "technologies": [],
//     "userId": 2026
//     })
// )

module.exports = clsUser;