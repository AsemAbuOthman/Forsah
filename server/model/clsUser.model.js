const sql = require('mssql');
const {connString} = require('../config/clsConfig');
const clsConfig = require('../config/clsConfig');
const { log, error } = require('console');


class clsUser{

    static async findUserByEmailPassword(email, password){

        let result = null;

        try {
            
            await sql.connect(connString).catch(err => console.error('Database connection failed:', err));
            console.log('db connecting');

            result = await sql.query`
                SELECT *
                FROM USERS 
                WHERE email = ${email} 
                AND password = ${password}
                `;

            result = result.recordset[0];
        } catch (err) {
            
            console.log('User : ' + err);
            result = null;
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
                            INSERT INTO USER_SKILLS (userId, skillId)
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

}

module.exports = clsUser;