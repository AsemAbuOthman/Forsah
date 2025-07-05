const { log } = require("node:console");
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

    
    const getMyProjects = async (req, res, userId, page, filters) => {
        
        let result = null;

        try {

            // Get projects from your model
            result = await clsProject.getMyProjects(userId, page, filters);
            
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

    const updateProject = async (req, res, projectId, newData) => {
        try {

            console.log( 'Update projectId : ', projectId);
            console.log( 'Update newData : ', newData);

            const project = await clsProject.updateProject(projectId, JSON.parse(newData));
        
            console.log( 'Update project : ', project);

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

    const deleteProject = async (req, res, projectId, userId) => {
        try {

            const project = await clsProject.deleteProject(projectId, userId);
        
            console.log( 'Delete project : ', project);

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


module.exports = {
    createProject,
    getProjects,
    getMyProjects,
    updateProject,
    deleteProject
};