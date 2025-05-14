const  clsProject = require("../model/clsProject.model");

    const createProject = async (req, res, newData) => {
        try {

            const project = await clsProject.createProject(JSON.parse(newData));
        
            console.log( 'create project : ', project);

            if (project) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(project));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getProjects = async (req, res, page, filters) => {
        
        let result = null;

        try {

            // Get projects from your model
            result = await clsProject.getProjects(page, filters);
            
            if (result) {
            // Send successful response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }else {
                // Handle other routes or methods
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            console.error('Error fetching projects:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server error' }));
        }

        return result;
    };


module.exports = {createProject, getProjects};