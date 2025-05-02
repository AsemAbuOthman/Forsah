const http = require('http');
const url = require('url'); 
const path = require('path');
const getRawBody = require('raw-body')
const { getUser, 
        getCountries, 
        getCurrencies, 
        getCategories, 
        insertUser, 
        getProfile, 
        getPortfolios, 
        getCertifications, 
        getEducations, 
        getExperiences, 
        getSkills, 
        updateProfile, 
        createPortfolio, 
        getAllCategoriesWithSkills,
        createCertification,
        updateCertification,
        deleteCertification,
        createExperience,
        updateExperience,
        deleteExperience,
        createEducation,
        updateEducation,
        deleteEducation} = require('./controller/clsUser.controller');

const { create } = require('domain');


const server = http.createServer(async (req, res)=>{

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    const parsedUrl = url.parse(req.url, true);
    const pathUrl = parsedUrl.pathname;    
    const query = parsedUrl.query;
    
    
    if(pathUrl === '/api'){

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'This is from node js api :) '}))
        return; 
    }
    
    if (pathUrl === '/api/login' && req.method === 'POST')  {

        let body = await getRawBody(req);

        console.log('Posting to api/user ... body => ', body.toString());
        return getUser(req, res, body.toString());
    }


    if(pathUrl === '/api/countries'){

        console.log('Fetching to api/countries ... body => ');
        return getCountries(req, res);
    }

    if(pathUrl === '/api/currencies'){

        console.log('Fetching to api/currencies ... body => ');
        return getCurrencies(req, res);
    }

    if(pathUrl === '/api/categories'){

        console.log('Fetching to api/categories ... body => ');
        return getCategories(req, res);
    }

    if(pathUrl === '/api/categoriesWithSkills'){

        console.log('Fetching to api/categoriesWithSkills ... body => ');
        return getAllCategoriesWithSkills(req, res);
    }

    if (pathUrl === '/api/signup' && req.method === 'POST')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/inserting New User ... body => ', body.toString());
        return insertUser(req, res, body.toString());
    }

    if (pathUrl === '/api/certification' && req.method === 'POST')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/inserting New certifications ... body => ', body.toString());
        return createCertification(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/skills')) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', userId);

        return getSkills(req, res, userId);
    }

    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/portfolios')) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', userId);

        return getPortfolios(req, res, userId);
    }

    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/certifications')) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', userId);

        return getCertifications(req, res, userId);
    }

    if (pathUrl.startsWith('/api/certification/') && req.method === 'PATCH') {

        const strCertificationId = pathUrl.split('/api/certification/')[1];
        const certificationId = parseInt(strCertificationId, 10);
    
        if (isNaN(certificationId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed certificationId from URL =>', certificationId);
        let body = await getRawBody(req);

        return updateCertification(req, res,certificationId, body.toString());
    }

    if (pathUrl.startsWith('/api/certification/') && req.method === 'DELETE') {

        const strCertificationId = pathUrl.split('/api/certification/')[1];
        const certificationId = parseInt(strCertificationId, 10);
    
        if (isNaN(certificationId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', certificationId);

        return deleteCertification(req, res, certificationId);
    }

    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/experiences')) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', userId);

        return getExperiences(req, res, userId);
    }

    if (pathUrl === '/api/experience' && req.method === 'POST')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/inserting New experience ... body => ', body.toString());
        return createExperience(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/experience/') && req.method === 'PATCH') {

        const strExperienceId = pathUrl.split('/api/experience/')[1];
        const experienceId = parseInt(strExperienceId, 10);
    
        if (isNaN(experienceId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed experienceId from URL =>', experienceId);
        let body = await getRawBody(req);

        return updateExperience(req, res, experienceId, body.toString());
    }

    if (pathUrl.startsWith('/api/experience/') && req.method === 'DELETE') {

        const strExperienceId = pathUrl.split('/api/experience/')[1];
        const experienceId = parseInt(strExperienceId, 10);
    
        if (isNaN(experienceId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', experienceId);

        return deleteExperience(req, res, experienceId);
    }

    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/educations')) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', userId);

        return getEducations(req, res, userId);
    }
    
    if (pathUrl === '/api/education' && req.method === 'POST')  {

        let body = await getRawBody(req);
        
        console.log('Posting to api/inserting New education ... body => ', body.toString());
        return createEducation(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/education/') && req.method === 'PATCH') {

        const strEducationId = pathUrl.split('/api/education/')[1];
        const educationId = parseInt(strEducationId, 10);
    
        if (isNaN(educationId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed educationId from URL =>', educationId);
        let body = await getRawBody(req);

        return updateEducation(req, res, educationId, body.toString());
    }

    if (pathUrl.startsWith('/api/education/') && req.method === 'DELETE') {

        const strEducationId = pathUrl.split('/api/education/')[1];
        const educationId = parseInt(strEducationId, 10);
    
        if (isNaN(educationId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL =>', educationId);

        return deleteEducation(req, res, educationId);
    }

    if (pathUrl.startsWith('/api/users/') &&  req.method === 'POST' && pathUrl.includes('/portfolios') ) {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL => Portfolio ', userId);
        
        const body = await getRawBody(req);
        return createPortfolio(req, res, userId, body.toString());
    }

    if (pathUrl.startsWith('/api/users/') && req.method === 'PATCH') {
        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }
    
        const body = await getRawBody(req);
        return updateProfile(req, res, userId, body.toString());
    }

    if (pathUrl.startsWith('/api/users/')) {
        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = parseInt(userIdStr, 10);

        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }
    
        console.log('Parsed userId from URL =>', userId);
        return getProfile(req, res, userId);
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Error', message: 'Not Found' }));
    return;
})

const port = 3000;
server.listen(port, (err)=>{

    console.log('Server is listening on port : ', port);

    if(err){

        console.log(err);
    }
})