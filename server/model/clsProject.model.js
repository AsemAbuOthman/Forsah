const { log, error } = require('console');
const {getConnection, closeConnection} = require('../config/clsConfig')

class clsProject {

    static async createProject(project){

        let result =  null;
        console.log('Project : ', project);
        
        try {
            
            const pool = await getConnection();

            result = await pool.request().query`
                DECLARE @projectId INT;
                
                INSERT INTO projects (projectTitle, projectDescription, minBudget, maxBudget, userId, projectDeadline, projectStateId)
                    VALUES(${project.projectTitle}, ${project.projectDescription}, ${project.minBudget}, ${project.maxBudget}, ${project.userId}, ${project.projectDeadline}, ${1});
            
                Set @projectId = SCOPE_IDENTITY();
            
                SELECT @projectId AS projectId;
            `
            if (result.rowsAffected) {
                const projectId = await result.recordset[0].projectId;
                console.log('New project ID:', projectId);


                    // Step 2: Map skills to insert values
                    const skillValues = project.projectSkills
                        .map(skill => `(${projectId}, ${parseInt(skill)})`)
                        .join(', ');
            
                    // Step 3: Insert skills into USER_SKILLS
                    if (skillValues) {
                        await pool.query(`
                            INSERT INTO projectSkills (projectId, skillId)
                                VALUES ${skillValues}
                        `);
                    }

                    if(result.rowsAffected[0] > 0){

                        result = await this.getProjects(1);
                    }

            }
            
        } catch (error) {
            
            console.log(error);
        }

        return result;
    } 

    static async getProjects(page = 1, filters = {}) {
        let result;
        try {
            const pool = await getConnection();
            const pageSize = 11;
            const offset = (page - 1) * pageSize;
    
            // Base query
            let query = `
                SELECT 
                    projects.projectId, projects.projectTitle, projects.projectDeadline,
                    projects.minBudget, projects.maxBudget, projects.projectStateId, projectStates.projectStateType,
                    users.userId, currencies.code, currencies.symbol, countries.countryName,
                    projects.projectDescription, languages.language, projects.createdAt  
                FROM projects 
                INNER JOIN users ON users.userId = projects.userId
                INNER JOIN currencies ON currencies.currencyId = users.currencyId
                INNER JOIN countries ON countries.countryId = users.countryId
                INNER JOIN languages ON languages.languageId = users.languageId
                INNER JOIN projectStates ON projectStates.projectStateId = projects.projectStateId
            `;
    
            // Add WHERE clauses based on filters
            const whereClauses = [];
            const params = [];
    
            if (filters.search) {
                whereClauses.push(`(projects.projectTitle LIKE '%' + @search + '%' OR projects.projectDescription LIKE '%' + @search + '%')`);
                params.push({ name: 'search', value: filters.search });
            }
    
            if (filters.countries && filters.countries.length > 0) {
                whereClauses.push(`countries.countryName IN (${filters.countries.map((_, i) => `@country${i}`).join(',')})`);
                filters.countries.forEach((country, i) => {
                    params.push({ name: `country${i}`, value: country });
                });
            }
    
            if (filters.languages && filters.languages.length > 0) {
                whereClauses.push(`languages.language IN (${filters.languages.map((_, i) => `@language${i}`).join(',')})`);
                filters.languages.forEach((language, i) => {
                    params.push({ name: `language${i}`, value: language });
                });
            }
    
            if (filters.currencies && filters.currencies.length > 0) {
                whereClauses.push(`currencies.code IN (${filters.currencies.map((_, i) => `@currency${i}`).join(',')})`);
                filters.currencies.forEach((currency, i) => {
                    params.push({ name: `currency${i}`, value: currency });
                });
            }
    
            if (filters.projectStates && filters.projectStates.length > 0) {
                whereClauses.push(`projectStates.projectStateType IN (${filters.projectStates.map((_, i) => `@state${i}`).join(',')})`);
                filters.projectStates.forEach((state, i) => {
                    params.push({ name: `state${i}`, value: state });
                });
            }
    
            if (filters.minBudget) {
                whereClauses.push(`projects.maxBudget >= @minBudget`);
                params.push({ name: 'minBudget', value: parseFloat(filters.minBudget) });
            }
    
            if (filters.maxBudget) {
                whereClauses.push(`projects.minBudget <= @maxBudget`);
                params.push({ name: 'maxBudget', value: parseFloat(filters.maxBudget) });
            }
    
            // Add WHERE clause if filters exist
            if (whereClauses.length > 0) {
                query += ` WHERE ${whereClauses.join(' AND ')}`;
            }
    
            // Add sorting
            query += ` ORDER BY projects.createdAt DESC`;
    
            // Add pagination
            query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`;
    
            // Execute main query
            const request = pool.request();
            params.forEach(param => {
                request.input(param.name, param.value);
            });
    
            const projectResult = await request.query(query);
            const projects = projectResult.recordset;
    
            // Get skills for the projects
            const projectIds = projects?.map(p => p.projectId);
            const skillsMap = {};
            
            if (projectIds.length > 0) {

                // Handle skill filtering if needed
                let skillQuery = `
                        SELECT 
                            projectSkills.projectId, projectSkills.skillId, skills.skillName 
                        FROM projectSkills 
                        INNER JOIN skills ON skills.skillId = projectSkills.skillId
                        WHERE projectSkills.projectId IN (${projectIds.map((_, i) => `@projectId${i}`).join(',')})
                    `;

                    // Create request and add parameters
                    const skillRequest = pool.request();
                    projectIds.forEach((id, i) => {
                        skillRequest.input(`projectId${i}`, id);
                    });

                    // Add skill filters if they exist
                    if (filters.skills && filters.skills.length > 0) {
                        skillQuery += ` AND skills.skillName IN (${filters.skills.map((_, i) => `@skill${i}`).join(',')})`;
                        filters.skills.forEach((skill, i) => {
                            skillRequest.input(`skill${i}`, skill);
                        });
                }
    
                const skillResult = await skillRequest.query(skillQuery);
                skillResult.recordset.forEach(row => {
                    if (!skillsMap[row.projectId]) {
                        skillsMap[row.projectId] = [];
                    }
                    skillsMap[row.projectId].push({
                        skillId: row.skillId,
                        skillName: row.skillName
                    });
                });
            }
    
            // Get total count with the same filters
            let countQuery = `SELECT COUNT(*) AS total FROM projects 
                                INNER JOIN users ON users.userId = projects.userId
                                INNER JOIN currencies ON currencies.currencyId = users.currencyId
                                INNER JOIN countries ON countries.countryId = users.countryId
                                INNER JOIN languages ON languages.languageId = users.languageId
                                INNER JOIN projectStates ON projectStates.projectStateId = projects.projectStateId`;
            
            if (whereClauses.length > 0) {
                countQuery += ` WHERE ${whereClauses.join(' AND ')}`;
            }
    
            const countRequest = pool.request();
            params.forEach(param => {
                countRequest.input(param.name, param.value);
            });
    
            const totalResult = await countRequest.query(countQuery);
            const totalProjects = totalResult.recordset[0].total;
    
            // Combine projects with their skills
            const projectsWithSkills = projects.map(project => ({
                ...project,
                skills: skillsMap[project.projectId] || []
            }));
    
            result = {
                projects: projectsWithSkills,
                totalProjects: totalProjects
            };
    
        } catch (err) {
            console.log('Error getting projects:', err);
            return null;
        }
    
        return result;
    }

}


module.exports = clsProject;