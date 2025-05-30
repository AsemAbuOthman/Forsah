const http = require('http');
var https = require('https');
const { Server } = require('socket.io');
const url = require('url'); 
const path = require('path');
const querystring = require('querystring');
const getRawBody = require('raw-body');
// const stripe = require('stripe')('ska_test_51RNvo0PD2ZfT0veAYBYuNgQPFMaEfh6KumEjPtElMhNnrxYsfMkoL3nU1DgSMZwtoiZei11cZEjEgBhcbxJ3SApD00aTqvb9d1');


const { 
        isEmailExist,
        getUserByGoogle,
        getUser, 
        getCountries, 
        getCurrencies, 
        getCategories, 
        insertUser, 
        getProfile, 
        getPortfolios,
        updatePortfolio,
        deletePortfolio,
        getCertifications, 
        getEducations, 
        getExperiences, 
        getSkills,
        createSkills, 
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
        deleteEducation,
        updateProfileImage,
        updatePassword,
        forgetPassword,
        updatePasswordByEmail,
        updateRole,
        updateAccountActivation,
        deleteAccount,
        signOut} = require('./controller/clsUser.controller');

const {

    createProject,
    getProjects,
    getMyProjects,
    updateProject,
    deleteProject
} = require('./controller/clsProject.controller');

const{

    getFreelancers,
    getFavouriteFreelancers,
    addFavourite,
    deleteFavourite
} = require('./controller/clsFreelancer.controller');


const{

    getProposals,
    getRecommendedProposals,
    getMyProposals,
    createProposal,
    checkProposals,
    updateProposal,
    deleteProposal
} = require('./controller/clsProposal.controller');


const{

    createContact,
    getContacts,
    sendMessage,
    replyMessage,
    getMessageHistory,
    deleteMessage
} = require('./controller/clsMessage.controller');


const {

    addPayment,
    getPayments
} = require('./controller/clsPayment.controller');


const { default: axios } = require('axios');
const { userInfo } = require('os');

const server = http.createServer(async (req, res)=>{

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    
    const parsedUrl = url.parse(req.url, true);
    const pathUrl = parsedUrl.pathname;    
    const query = parsedUrl.query;
    
    if (req.method === 'OPTIONS') {
        res.writeHead(201);
        res.end();
        return;
    }
    
    if(pathUrl === '/api'){

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'This is from node js api :) '}))
        return; 
    }

    if (pathUrl === '/api/logout')  {

        return signOut(req, res);
    }
    
    if (pathUrl === '/api/login' && req.method === 'POST')  {

        let body = await getRawBody(req);

        console.log('Posting to api/user ... body => ', body.toString());
        return getUser(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/login/google') && req.method === 'POST')  {

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const {
            ip,
            email,
            name,
            picture,
            sub,
            locale,
            given_name,
            family_name,
            country_name,
            country_code,
            city,
            region,
            timezone,
            postal_code,
            language,
            currency
        } = queryParams;

        let googleAccount = {
            email: email || null,
            name: name || null,
            picture: picture || null,
            sub: sub || null,
            locale: locale || null,
            given_name: given_name || null,
            family_name: family_name || null,
            country_name: null,
            country_code: null,
            city: null,
            region: null,
            timezone: null,
            postal_code: null,
            language: null,
            currency: null
        };

        console.log('Before :  ', googleAccount);


        // Wrap the IP API call in a promise
        const fetchGeoData = () => {
            return new Promise((resolve, reject) => {
                const options = {
                    path: `/${ip}/json/`,
                    host: 'ipapi.co',
                    port: 443,
                    headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
                };

                https.get(options, (resp) => {
                    let body = '';

                    resp.on('data', (chunk) => {
                        body += chunk;
                    });

                    resp.on('end', () => {
                        try {
                            const loc = JSON.parse(body);
                            resolve(loc);
                        } catch (err) {
                            reject('Failed to parse IP geolocation data.');
                        }
                    });

                    resp.on('error', (err) => {
                        reject('IP API error: ' + err.message);
                    });
                });
            });
        };

        const loc = await fetchGeoData();

        googleAccount.country_name = loc.country_name || null;
        googleAccount.country_code = loc.country_code || null;
        googleAccount.city = loc.city || null;
        googleAccount.region = loc.region || null;
        googleAccount.timezone = loc.timezone || null;
        googleAccount.postal_code = loc.postal || null;
        googleAccount.language = loc.languages ? loc.languages.split(',')[0] : null;
        googleAccount.currency = loc.currency || null;

        console.log('After IP API:', googleAccount);

        return getUserByGoogle(req, res, googleAccount);
    }


    if (pathUrl.startsWith('/api/create-payment-intent') && req.method === 'POST') {
        try {
            const rawBody = await getRawBody(req);
            const { amount, currency, metadata } = JSON.parse(rawBody.toString());
        
            // Validate input
            if (!amount || isNaN(amount)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid amount' }));
            }
        
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount),
            currency: currency || 'usd',
            metadata: metadata || {},
            payment_method_types: ['card'],
            capture_method: 'automatic',
        });
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        }));
        
    
        } catch (err) {
        console.error('Stripe error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' }); // ✅ Fix: correct header
        return res.end(JSON.stringify({
            error: 'Failed to create payment intent',
            details: err.message,
        }));
        }
    }

    if(pathUrl.startsWith('/api/recommended/')){

        const userIdStr = pathUrl.split('/api/recommended/')[1];
        const userId = parseInt(userIdStr, 10);
    
        console.log('Parsed userId from URL =>', userId);
        
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }

        return getRecommendedProposals(req, res, userId);
    }

    if(pathUrl.startsWith('/api/payment/') && req.method === 'POST'){


        const body = await getRawBody(req);

        return addPayment(req, res, body.toString());
    }

    if(pathUrl.startsWith('/api/payments/')){

        const userIdStr = pathUrl.split('/api/payments/')[1];
        const userId = parseInt(userIdStr, 10);
    
        console.log('Parsed userId from URL =>', userId);
        
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }

        return getPayments(req, res, userId);
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

    if(pathUrl.startsWith('/api/users/role/') && req.method === 'POST'){

        const userIdStr = pathUrl.split('/api/users/role/')[1];
        const userId = parseInt(userIdStr, 10);
    
        console.log('Parsed userId from URL =>', userId);
        
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }

        const body = await getRawBody(req);

        console.log('Role ... : ', body.toString());

        return updateRole(req, res, userId, body.toString());
    }

    if(pathUrl.startsWith('/api/users/deactivate/') && req.method === 'POST'){

        const userIdStr = pathUrl.split('/api/users/deactivate/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }

        const body = await getRawBody(req);

        console.log('Deactivate ... : ', body.toString());

        return updateAccountActivation(req, res, userId, body.toString());
    }

    if(pathUrl.startsWith('/api/users/delete/') && req.method === 'DELETE'){

        const userIdStr = pathUrl.split('/api/users/delete/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }

        return deleteAccount(req, res, userId);
    }

    if(pathUrl === '/api/email' && req.method === 'GET'){
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const email = queryParams.email;

        if (!email) {
            res.statusCode = 400;
            return res.end('Email is required');
        }

        console.log('Checking email availability ... : ', email);

        return isEmailExist(req, res, email);
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


    if (pathUrl.startsWith('/api/skills/') && req.method === 'POST')  {  

        let body = await getRawBody(req);

        return createSkills(req, res, body.toString());
    }

    // export const createSkill = async (skillData: Omit<Skill, 'id'>): Promise<Skill> => {
    //     const response = await api.post('/skills/', skillData);
    //     return response.data;
    // };
    
    // export const updateSkill = async (skillId: number, skillData: Partial<Skill>): Promise<Skill> => {
    //     const response = await api.patch(`/skills/${skillId}`, skillData);
    //     return response.data;
    // };
    
    // export const deleteSkill = async (skillId: number): Promise<void> => {
    //     await api.delete(`/skills/${skillId}`);
    // };
    
    if (pathUrl.startsWith('/api/users/') && pathUrl.includes('/portfolios')  &&  req.method === 'POST') {

        const userIdStr = pathUrl.split('/api/users/')[1];
        const userId = userIdStr.match(/\d+/)[0];
        const userIdNum = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        console.log('Parsed userId from URL => Portfolio ', userIdNum);
        const body = await getRawBody(req);

        console.log('Posting  New Portfolio ... body => ', body.toString());
        
        return createPortfolio(req, res, userIdNum, body.toString());
    }

    if (pathUrl.startsWith('/api/portfolios') && req.method === 'PATCH') {

        const portfolioIdStr = pathUrl.split('/api/portfolios/')[1];
        const portfolioId = portfolioIdStr.match(/\d+/)[0];
        const portfolioIdNum = parseInt(portfolioId, 10);
    
        if (isNaN(portfolioId)) {
            return res.status(400).send('Invalid Portfolio ID');
        }

        console.log('Parsed portfolioId from URL => Portfolio ', portfolioIdNum);
        const body = await getRawBody(req);

        console.log('Patching  pdate Portfolio ... body => ', body.toString());
        
        return updatePortfolio(req, res, portfolioIdNum, body.toString());
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

    if (pathUrl.startsWith('/api/portfolios/')) {

        const idStr = pathUrl.split('/api/portfolios/')[1];
        const id = parseInt(idStr, 10);
    
        if (isNaN(id)) {
            return res.status(400).send('Invalid  ID');
        }

        console.log('Parsed userId from URL =>', id);

        return deletePortfolio(req, res, id);
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


    if (pathUrl.startsWith('/api/favourite/') && req.method === 'POST') {
        const pathParts = pathUrl.replace('/api/favourite/', '').split('/');
    
        const userId = parseInt(pathParts[0], 10);
        const favUserId = parseInt(pathParts[1], 10);
    
        console.log(userId, favUserId);
        

        if (isNaN(userId) || isNaN(favUserId)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid userId or favUserId' }));
        }
    
        return addFavourite(req, res, userId, favUserId);
    }

    if (pathUrl.startsWith('/api/favourite/') && req.method === 'DELETE') {
        const pathParts = pathUrl.replace('/api/favourite/', '').split('/');
    
        const userId = parseInt(pathParts[0], 10);
        const favUserId = parseInt(pathParts[1], 10);
    
        if (isNaN(userId) || isNaN(favUserId)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid userId or favUserId' }));
        }
    
        return deleteFavourite(req, res, userId, favUserId);
    }
    
    if (pathUrl.startsWith('/api/users/favourite/')) {

        const userIdStr = pathUrl.split('/api/users/favourite/')[1];
        const userId = parseInt(userIdStr, 10);


        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid userId ' }));
        }

        // Parse URL and query parameters
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        
        // Extract parameters with defaults
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const {
        search,
        skills,
        countries,
        languages,
        currencies,
        projectStates,
        minBudget,
        maxBudget,
        sort
        } = queryParams;

        // Prepare filters object
        const filters = {
            search,
            skills: skills ? skills.split(',') : [],
            countries: countries ? countries.split(',') : [],
            languages: languages ? languages.split(',') : [],
            currencies: currencies ? currencies.split(',') : [],
            projectStates: projectStates ? projectStates.split(',') : [],
            minBudget,
            maxBudget
        }

        return getFavouriteFreelancers(req, res, userId, page, {});
    }

    if (pathUrl.startsWith('/api/users/image/') && req.method === 'PATCH') {
        const idStr = pathUrl.split('/api/users/image/')[1];
        const id = parseInt(idStr, 10);
    
        console.log('Parsed userId from URL =>', id);

        if (isNaN(id)) {
            res.statusCode = 400;
            return res.end('Invalid  ID');
        }
    
        const body = await getRawBody(req);
        return updateProfileImage(req, res, id, body.toString());
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

    if (pathUrl.startsWith('/api/projects/')) {

        // Parse URL and query parameters
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        
        // Extract parameters with defaults
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const {
        search,
        skills,
        countries,
        languages,
        currencies,
        projectStates,
        minBudget,
        maxBudget,
        sort
        } = queryParams;

        // Prepare filters object
        const filters = {
            search,
            skills: skills ? skills.split(',') : [],
            countries: countries ? countries.split(',') : [],
            languages: languages ? languages.split(',') : [],
            currencies: currencies ? currencies.split(',') : [],
            projectStates: projectStates ? projectStates.split(',') : [],
            minBudget,
            maxBudget
        }

        return getProjects(req, res, page, filters);
    }


    if (pathUrl.startsWith('/api/user/projects')) {

        // Parse URL and query parameters
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        
        // Extract parameters with defaults
        const userId = parseInt(queryParams.userId);
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;

        const {
            search,
            skills,
            countries,
            languages,
            currencies,
            projectStates,
            minBudget,
            maxBudget,
            sort
        } = queryParams;

        // Prepare filters object
        const filters = {
            search,
            skills: skills ? skills.split(',') : [],
            countries: countries ? countries.split(',') : [],
            languages: languages ? languages.split(',') : [],
            currencies: currencies ? currencies.split(',') : [],
            projectStates: projectStates ? projectStates.split(',') : [],
            minBudget,
            maxBudget
        }

        return getMyProjects(req, res, userId, page, filters);
    }

    if (pathUrl.startsWith('/api/project/') && req.method === 'PATCH') {

        const projectIdStr = pathUrl.split('/api/project/')[1];
        const projectId = parseInt(projectIdStr, 10);

        const body = await getRawBody(req);

        return updateProject(req, res, projectId, body.toString());
    }


    if (pathUrl.startsWith('/api/project/') && req.method === 'DELETE') {

        const segments = pathUrl.split('/'); 
    
        const projectId = parseInt(segments[3], 10); 
        const userId = parseInt(segments[4], 10);    
    
        console.log('Parsed userId from URL =>', userId);
        console.log('Parsed projectId from URL =>', projectId);
    
        return deleteProject(req, res, projectId, userId);
    }

    if (pathUrl.startsWith('/api/freelancers/')) {

        const userIdStr = pathUrl.split('/api/freelancers/')[1];
        const userId = parseInt(userIdStr, 10);

        // Parse URL and query parameters
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        
        // Extract parameters with defaults
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const {
        search,
        skills,
        countries,
        languages,
        currencies,
        projectStates,
        minBudget,
        maxBudget,
        sort
        } = queryParams;

        // Prepare filters object
        const filters = {
            search,
            skills: skills ? skills.split(',') : [],
            countries: countries ? countries.split(',') : [],
            languages: languages ? languages.split(',') : [],
            currencies: currencies ? currencies.split(',') : [],
            projectStates: projectStates ? projectStates.split(',') : [],
            minBudget,
            maxBudget
        }

        return getFreelancers(req, res, userId, page, {});
    }

    
    if (pathUrl.startsWith('/api/project/') && req.method === 'POST') {

        const body = await getRawBody(req);

        console.log(body);

        return createProject(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/proposals/check')) {

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const {

            freelancerId,
            projectId
            
        } = queryParams;

        if (isNaN(projectId) || isNaN(freelancerId)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid projectId or freelancerId' }));
        }

        return  checkProposals(req, res, projectId, freelancerId);
    }

    if (pathUrl.startsWith('/api/my_proposals/') && req.method === 'DELETE') {

        const proposalIdStr = pathUrl.split('/api/my_proposals/')[1];
        const proposalId = parseInt(proposalIdStr, 10);

        if (isNaN(proposalId) ) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid proposalId ' }));
        }
    
        console.log('Parsed proposalId from URL =>', proposalId);

        return  deleteProposal(req, res, proposalId);
    }

    if (pathUrl.startsWith('/api/my_proposals/') && req.method === 'PUT') {

        const proposalIdStr = pathUrl.split('/api/my_proposals/')[1];
        const proposalId = parseInt(proposalIdStr, 10);

        if (isNaN(proposalId) ) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid proposalId ' }));
        }

        const body = await getRawBody(req);

        return  updateProposal(req, res, proposalId, body.toString());
    }

    if (pathUrl.startsWith('/api/my_proposals/')) {

        const uesrIdStr = pathUrl.split('/api/my_proposals/')[1];
        const userId = parseInt(uesrIdStr, 10);

        if (isNaN(userId) ) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid userId ' }));
        }
    
        console.log('Parsed userId from URL =>', userId);

        return  getMyProposals(req, res, userId);
    }



    if (pathUrl.startsWith('/api/proposals/')) {

        const projectIdStr = pathUrl.split('/api/proposals/')[1];
        const projectId = parseInt(projectIdStr, 10);

        if (isNaN(projectId) ) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid projectId ' }));
        }
    
        console.log('Parsed proposalId from URL =>', projectId);

        return  getProposals(req, res, projectId);
    }


    if (pathUrl.startsWith('/api/proposals') && req.method === 'POST') {

        const body = await getRawBody(req);

        console.log('My new proposal data : ', body.toString());

        return createProposal(req, res, body.toString());
    }

    if(pathUrl === '/api/contact' && req.method === 'POST'){

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const {

            senderId,
            recevierId
        } = queryParams;

        console.log('Contact messages request ... : ');

        return createContact(req, res, senderId, recevierId);
    }

    if(pathUrl.startsWith('/api/contacts/')){

        const userIdStr = pathUrl.split('/api/contacts/')[1];
        const userId = parseInt(userIdStr, 10);

        if (isNaN(userId) ) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid projectId ' }));
        }
    
        console.log('Parsed userId from URL =>', userId);

        return getContacts(req, res, userId);
    }

    if(pathUrl === '/api/send' && req.method === 'POST'){

        const body = await getRawBody(req);

        console.log('Send message request ... : ', body.toString());

        return sendMessage(req, res, body.toString());
    }

    if(pathUrl === '/api/reply' && req.method === 'POST'){

        const body = await getRawBody(req);

        console.log('Reply message request ... : ', body.toString());

        return replyMessage(req, res, body.toString());
    }

    if(pathUrl === '/api/messages'){

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const senderId = queryParams.userId;
        const receiverId = queryParams.contactId;

        console.log('Fetching messages request ... : ', senderId + ' ' + receiverId );

        return getMessageHistory(req, res, senderId, receiverId);
    }

    if(pathUrl === '/api/message' && req.method === 'DELETE'){

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const {

            messageId,
            userId

        } = queryParams;

        console.log('Deleteing message request ... : ');

        return deleteMessage(req, res, messageId, userId);
    }

    if (pathUrl.startsWith('/api/password/') && req.method === 'PATCH') {
        const userIdStr = pathUrl.split('/api/password/')[1];
        const userId = parseInt(userIdStr, 10);
    
        if (isNaN(userId)) {
            res.statusCode = 400;
            return res.end('Invalid user ID');
        }
    
        const body = await getRawBody(req);
        return updatePassword(req, res, userId, body.toString());
    }

    if (pathUrl.startsWith('/api/password/') && req.method === 'POST') {
    
        const body = await getRawBody(req);
        return updatePasswordByEmail(req, res, body.toString());
    }

    if (pathUrl.startsWith('/api/forget_password') && req.method === 'POST') {
    
        const body = await getRawBody(req);
        return forgetPassword(req, res, body.toString());
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Error', message: 'Not Found' }));
    return;
})


    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "DELETE"]
        },
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });
    
    // In-memory storage (replace with a database in production)
    const userSockets = new Map(); // userId -> socketId
    const socketUsers = new Map(); // socketId -> userId
    const activeRooms = new Map(); // userId -> Set of roomIds
    const messages = new Map(); // conversationId -> Array of messages
    
    // Helper function to generate conversation ID
    const getConversationId = (user1, user2) => [user1, user2].sort().join('_');
    
    // Socket.IO connection handler
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);
    
        // Authenticate user
        socket.on('authenticate', ({ userId, token }) => {
        if (!userId) {
            socket.emit('authentication_error', { message: 'Invalid user ID' });
            return;
        }
    
        // Track user connection
        userSockets.set(userId, socket.id);
        socketUsers.set(socket.id, userId);
    
        // Join user's personal room
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated`);
    
        // Notify others this user is online
        socket.broadcast.emit('user_online', { userId });
            socket.emit('authenticated', { userId });
        });
    
        // Handle sending messages
        socket.on('send_message', async (messageData, callback) => {
            try {
            const { senderId, receiverId, messageContent } = messageData;
            const conversationId = getConversationId(senderId, receiverId);
        
            console.log('Sending message : ', messageData);

            const savedMessage = (await axios.post('http://localhost:3000/api/send', messageData)).data;
            if (!savedMessage) {
                throw new Error('Failed to save message');
            }

            console.log('savedMessage : ', savedMessage);

            const newMessage = {
                id: savedMessage.messageId,
                senderId: savedMessage.senderId,
                receiverId: savedMessage.receiverId,
                messageContent: savedMessage.messageContent,
                timestamp: savedMessage.sentAt,
                status: 'sent',
            };
            
            messages.set(conversationId, [...messages.get(conversationId) || [], newMessage]);
        
            // Emit to conversation room
            io.to(`conversation_${conversationId}`).emit('new_message', newMessage);
        
            callback({ 
                status: 'success', 
                message: { 
                ...newMessage,
                messageId: newMessage.id // Ensure messageId is present
                } 
            });
            } catch (error) {
            callback({ status: 'error', message: error.message });
            }
        });

        socket.on("send_reply", async (replyData, callback) => {
            try {
            const { messageId, replierId, replyContent, receiverId } = replyData;
        
            console.log("Sending reply:", replyData);
        
            const savedReply = (await axios.post("http://localhost:3000/api/reply", replyData)).data;
        
            if (!savedReply) {
                throw new Error("Failed to save reply");
            }
        
            const newReply = {
                id: savedReply.replyId,
                messageId: savedReply.messageId,
                replierId: savedReply.replierId,
                replyContent: savedReply.replyContent,
                timestamp: savedReply.repliedAt,
            };
        
            // Optionally emit to the conversation or specific user
            const receiverSocketId = userSockets.get(savedReply.originalMessageOwnerId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new_reply", newReply);
            }
        
            callback({ status: "success", reply: newReply });
        
            } catch (error) {
            console.error("Reply error:", error.message);
            callback({ status: "error", message: error.message });
            }
        });
        
        
        // Add join_conversation handler
        socket.on('join_conversation', ({ userId, contactId }) => {
            const conversationId = getConversationId(userId, contactId);
            socket.join(`conversation_${conversationId}`);
        });
        

        socket.on('typing', ({ receiverId, isTyping }) => {
            const senderId = socketUsers.get(socket.id);
            if (!senderId) return;
        
            const recipientSocketId = userSockets.get(receiverId);
            if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing', { senderId, isTyping });
            }
        });

        socket.on('mark_read', ({ messageId, senderId, receiverId }) => {
            const conversationId = getConversationId(senderId, receiverId);
            const conversationMessages = messages.get(conversationId) || [];
            
            const updatedMessages = conversationMessages.map(msg => {
                if (msg.id === messageId && msg.senderId === receiverId) {
                    return { ...msg, status: 'read' };
                }
                return msg;
            });
            
            messages.set(conversationId, updatedMessages);
            
            // Notify sender that their message was read
            const senderSocketId = userSockets.get(receiverId); // receiverId is actually the sender here
            if (senderSocketId) {
            io.to(senderSocketId).emit('message_read', { messageId });
            }
        });
        
        // Handle message deletion
        socket.on('delete_message', ({ messageId, senderId, receiverId }) => {
            const conversationId = getConversationId(senderId, receiverId);
            const conversationMessages = messages.get(conversationId) || [];
            
            const updatedMessages = conversationMessages.filter(msg => msg.id !== messageId);
            messages.set(conversationId, updatedMessages);
            
            // Notify other participant
            io.to(`conversation_${conversationId}`).emit('message_deleted', { messageId });
        });
        
        // Handle online status requests
        socket.on('get_online_status', ({ userId }, callback) => {
            const isOnline = userSockets.has(userId);
            callback({ isOnline });
        });
    
        // Handle message delivery status
        socket.on('message_delivered', ({ messageId, receiverId }) => {
        const senderId = socketUsers.get(socket.id);
        if (!senderId) return;
    
        const recipientSocketId = userSockets.get(receiverId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('message_delivered', { messageId });
        }
        });
    
        // Handle disconnection
        socket.on('disconnect', () => {
        const userId = socketUsers.get(socket.id);
        if (!userId) return;
    
        console.log(`User ${userId} disconnected`);
    
        // Clean up user tracking
        userSockets.delete(userId);
        socketUsers.delete(socket.id);
    
        // Notify others this user went offline
        socket.broadcast.emit('user_offline', { userId });
        });
    
        // Error handling
        socket.on('error', (error) => {
        console.error(`Socket error (${socket.id}):`, error);
        });
    });




const port = 3000;
server.listen(port, (err)=>{

    console.log('Server is listening on port : ', port);

    if(err){

        console.log(err);
    }
});


