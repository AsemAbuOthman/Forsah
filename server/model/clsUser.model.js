const sql = require('mssql');
const {connString} = require('../config/clsConfig');
const clsConfig = require('../config/clsConfig');
const { log, error } = require('console');
const { findUser, createPortfolio } = require('../controller/clsUser.controller');


class clsUser{

    static async getProfile(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`
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
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async updateProfile(id, newData){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            

            result = await sql.query`
                UPDATE users SET 
                    firstName = ${newData.firstName}, lastName = ${newData.lastName}, professionalTitle = ${newData.professionalTitle}
                    WHERE userId = ${id} 

                UPDATE profiles SET 
                    profileDescription = ${newData.profileDescription}
                    WHERE userId = ${id} 
            `

            if ( result.rowsAffected){

                result = await this.getProfile(id);
            }else{

                result = null;
            }
            
            return result;
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    } 

    static async getPortfolios(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`
                SELECT * FROM portfolios 
                    INNER JOIN sampleProjects ON sampleProjects.portfolioId = portfolios.portfolioId 
                    INNER JOIN images ON images.imageableId = sampleProjects.sampleProjectId AND images.imageableType = 'portfolio'

                    WHERE userId = ${id} 
                `;

                // INNER JOIN sampleProjectSkills ON sampleProjects.sampleProjectId = sampleProjectSkills.sampleProjectId 

                // INNER JOIN skills ON skills.skillId = sampleProjectSkills.sampleProjectSkillId
                // INNER JOIN categories ON categories.categoryId = skills.categoryId
                
                result ={
                    portfolios: result.recordset,
                };
                
        } catch (err) {
            
            console.log('user Portfolios : ' + err);
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async getSkills(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting *');

            result = await sql.query`
                SELECT * FROM userSkills
                    INNER JOIN skills ON userSkills.skillId = skills.skillId
                    INNER JOIN categories ON categories.categoryId = skills.categoryId
                    WHERE userId = ${id}
                `;
                

                result ={
                    skills: result.recordset,
                };
                
                console.log('Here skills: ', result);
        } catch (err) {
            
            console.log('userSkills : ' + err);
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async getExperiences(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting *');



            result= await sql.query`
                SELECT * FROM experiences WHERE userId = ${id}
                `;

                
                result ={
                    experiences: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Experiences : ' + err);
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async getCertifications(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * ', id);

            result = await sql.query`
                SELECT * FROM certifications WHERE userId = ${id}
                `;
                
                result ={
                    certifications: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async updateCertification(certificationId, newData){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * :::::::: ', certificationId, ' --- ',newData);

            result = await sql.query`
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
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async deleteCertification(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * ', id);

            result = await sql.query`

                DELETE FROM certifications 
                    OUTPUT DELETED.userId
                WHERE certificationId = ${id}
                `;
                
                result = await this.getCertifications(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    
    static async getEducations(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting *');



            result = await sql.query`
                SELECT * FROM educations WHERE userId = ${id}
                `;
                
                result ={
                    educations: result.recordset,
                };
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Educations : ' + err);
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    
    static async findUserByEmailPassword(email, password){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting', );


            result = await sql.query`
                SELECT userId
                FROM USERS 
                WHERE email = ${email} 
                AND password = ${password}
                `;

            
            result = await this.getProfile(result.recordset[0].userId);

        } catch (err) {
            
            console.log('User : ' + err);
            result = null;
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }


    static async getAllCountries(){
        let result = null;

        try {
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`SELECT countryId as value, countryName as label, ISO as code FROM COUNTRIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        // console.log('result : ', result);

        return result;
    }

    static async getAllCategories(){
        let result = null;

        try {
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`SELECT categoryId as value, categoryName as label FROM CATEGORIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        // console.log('result : ', result);

        return result;
    }

    static async getAllCategoriesWithSkills(){
        let result = null;

        try {
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`SELECT skillId, skillName, categoryName, skills.categoryId 
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
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        // console.log('result : ', result);

        return result;
    }


    static async getAllCurrencies(){
        let result = null;

        try {
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await sql.query`SELECT currencyId as value, code as label, symbol FROM CURRENCIES`;

            result = result.recordsets;
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        // console.log('result : ', result);

        return result;
    }

    static async insertUser(user){

        let result = null;

        try {
            
            const pool = await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            
            result = await pool.query`

            DECLARE @newUserId INT;

            INSERT INTO USERS
            (email, password, username, firstname, lastname, roleId, countryId, phone, currencyId)
            VALUES(${user.email}, ${user.password},${user.username},${user.firstName},${user.lastName}, ${1},${user.country.value},${user.phone},${user.currency.value});

            Set @newUserId = SCOPE_IDENTITY();
            
            INSERT INTO PROFILES 
            (profileDescription, userId)
            VALUES(${user.description}, @newUserId)

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
                    const skillResult = await pool.query`
                        SELECT skillId FROM SKILLS WHERE categoryId = ${interest.value}
                    `;
            
                    // Step 2: Map skills to insert values
                    const skillValues = skillResult.recordset
                        .map(skill => `(${newUserId}, ${skill.skillId})`)
                        .join(', ');
            
                    // Step 3: Insert skills into USER_SKILLS
                    if (skillValues) {
                        await pool.query(`
                            INSERT INTO USERSKILLS (userId, skillId)
                            VALUES ${skillValues}
                        `);
                    }
                }
            }
            
            return result.rowsAffected;
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    }

    // sampleProjectId	portfolioId	sampleProjectTitle	sampleProjectDescription	completionDate	sampleProjectUrl
    static async createPortfolio(id, newData){

        let result =  null;

        console.log('Portfolio Data : ', newData);

        try {
            
            const pool = await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await pool.query`
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

                    const imagesUrlValues = newData.imageUrl
                        .map(singleImageUrl => `('${singleImageUrl}', ${sampleProjectId}, 'portfolio')`)
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
                    const skillResult = await pool.query`
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
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    } 


    static async createCertification( newData){

        let result =  null;

        console.log('Certification Data : ', newData);

        try {
            
            const pool = await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await pool.query`
                INSERT INTO certifications 
                    (userId, certificationTitle, certificationOrganization, startDate, endDate, certificationUrl)
                VALUES(${newData.userId},${newData.certificationTitle},${newData.certificationOrganization},${newData.startDate},${newData.endDate},${newData.certificationUrl})
            `

            result = await this.getCertifications(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    } 

    static async createExperience( newData){

        let result =  null;

        console.log('Experience Data : ', newData);

        try {
            
            const pool = await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await pool.query`
                INSERT INTO experiences 
                    (userId, experienceTitle, experienceDescription, experienceCompanyName, startDate, endDate)
                VALUES(${newData.userId},${newData.experienceTitle},${newData.experienceDescription},${newData.experienceCompanyName},${newData.startDate},${newData.endDate})
            `

            result = await this.getExperiences(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    } 

    static async updateExperience(experienceId, newData){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * :::::::: ', experienceId, ' --- ', newData);

            result = await sql.query`
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
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async deleteExperience(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * ', id);

            result = await sql.query`

                DELETE FROM experiences 
                    OUTPUT DELETED.userId
                WHERE experienceId = ${id}
                `;
                
                result = await this.getExperiences(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Certifications : ' + err);
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }


    static async createEducation( newData){

        let result =  null;

        console.log('Education Data : ', newData);

        try {
            
            const pool = await sql.connect(connString).catch(err => console.error('Database connection failed:', err));

            result = await pool.query`
                INSERT INTO educations 
                    (userId, educationDegree, educationOrganization, startDate, endDate, educationDescription)
                VALUES(${newData.userId},${newData.educationDegree},${newData.educationOrganization},${newData.startDate},${newData.endDate}, ${educationDescription})
            `

            result = await this.getEducations(newData.userId);
            
        } catch (error) {
            
            console.log(error);
        }finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result;
    } 

    static async updateEducation(educationId, newData){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * :::::::: ', educationId, ' --- ', newData);

            result = await sql.query`
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
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }

    static async deleteEducation(id){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting * ', id);

            result = await sql.query`

                DELETE FROM educations 
                    OUTPUT DELETED.userId
                WHERE educationId = ${id}
                `;
                
                result = await this.getEducations(result.recordset[0]?.userId);
                
                console.log('Here : ', result);
        } catch (err) {
            
            console.log('user Educations : ' + err);
        } finally {
            if (sql) {
                try {
                    await sql.close();
                    console.log('Connection closed');
                } catch (closeErr) {
                    console.error('Failed to close connection:', closeErr);
                }
            }
        }

        return result; 
    }
}




console.log(clsUser.getExperiences(2026));

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