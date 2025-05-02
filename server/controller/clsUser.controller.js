const clsUser = require('../model/clsUser.model');


    const getUser = async (req, res, body) => {
        try {
            const { email, password } = JSON.parse(body);
        
            const user = await clsUser.findUserByEmailPassword(email, password);
        
            // console.log( 'user : ', user);

            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getCountries = async (req, res)=>{
        try {
            const countries = await clsUser.getAllCountries();
            
            if (countries) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(countries));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getCurrencies = async (req, res)=>{
        try {
            const countries = await clsUser.getAllCurrencies();
            
            if (countries) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(countries));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }


    const getCategories = async (req, res)=>{
        try {
            const categories = await clsUser.getAllCategories();
            
            if (categories) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(categories));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getAllCategoriesWithSkills = async (req, res)=>{
        try {
            const categories = await clsUser.getAllCategoriesWithSkills();
            
            if (categories) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(categories));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching getAllCategoriesWithSkills from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const insertUser = async (req, res, body)=>{
        try {
            const user = JSON.parse(body);

            const rowsAffected = await clsUser.insertUser(user);
            
            if (rowsAffected) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Added Successfully :)' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const createCertification = async (req, res, body)=>{
        try {

            const certification = await clsUser.createCertification(JSON.parse(body));
            
            if (certification) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(certification));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const getProfile= async (req, res, id) => {
        try {
        
            const profile = await clsUser.getProfile(id);
        
            console.log( 'user : ', profile);

            if (profile) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(profile));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getPortfolios= async (req, res, id) => {
        try {
        
            const portfolios = await clsUser.getPortfolios(id);
        
            console.log( 'user : ', portfolios);

            if (portfolios) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(portfolios));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getSkills= async (req, res, id) => {
        try {
        
            const skills = await clsUser.getSkills(id);
        
            console.log( 'user : ', skills);

            if (skills) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(skills));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getExperiences= async (req, res, id) => {
        try {
        
            const experiences = await clsUser.getExperiences(id);
        
            console.log( 'user : ', experiences);

            if (experiences) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(experiences));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const createExperience = async (req, res, body)=>{
        try {

            const experience = await clsUser.createExperience(JSON.parse(body));
            
            if (experience) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(experience));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const updateExperience= async (req, res, experienceId, newData) => {
        try {
        
            const experiences = await clsUser.updateExperience(experienceId, JSON.parse(newData));
        
            console.log( 'user : ', experiences);

            if (experiences) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(experiences));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const deleteExperience= async (req, res, id) => {
        try {
        
            const experiences = await clsUser.deleteExperience(id);
        
            console.log( 'user : ', experiences);

            if (experiences) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(experiences));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getEducations= async (req, res, id) => {
        try {
        
            const educations = await clsUser.getEducations(id);
        
            console.log( 'user : ', educations);

            if (educations) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(educations));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const createEducation = async (req, res, body)=>{
        try {

            const education = await clsUser.createEducation(JSON.parse(body));
            
            if (education) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(education));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error with fetching countries from DB' }));
            }
        } catch (error) {
            console.log('Fetching Error:)' + error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }

    const updateEducation= async (req, res, educationId, newData) => {
        try {
        
            const education = await clsUser.updateEducation(educationId, JSON.parse(newData));
        
            console.log( 'user : ', education);

            if (education) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(education));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const deleteEducation= async (req, res, id) => {
        try {
        
            const education = await clsUser.deleteEducation(id);
        
            console.log( 'user : ', education);

            if (education) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(education));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const getCertifications= async (req, res, id) => {
        try {
        
            const certifications = await clsUser.getCertifications(id);
        
            console.log( 'user : ', certifications);

            if (certifications) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(certifications));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const updateCertification= async (req, res, certificationId, newData) => {
        try {
        
            const certifications = await clsUser.updateCertification(certificationId, JSON.parse(newData));
        
            console.log( 'user : ', certifications);

            if (certifications) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(certifications));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const deleteCertification= async (req, res, id) => {
        try {
        
            const certifications = await clsUser.deleteCertification(id);
        
            console.log( 'user : ', certifications);

            if (certifications) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(certifications));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const createPortfolio= async (req, res, id, newData) => {
        try {

            const portfolio = await clsUser.createPortfolio(id, JSON.parse(newData));
        
            console.log( 'create portfolio : ', portfolio);

            if (portfolio) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(portfolio));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };

    const updateProfile= async (req, res, id, newData) => {
        try {

            const updatedData = await clsUser.updateProfile(id, JSON.parse(newData));
        
            console.log( 'isUpdated profile : ', updatedData);

            if (updatedData) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedData));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
            } catch (error) {
                console.log('Login Error:)' + error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    };


module.exports = {
    getUser, 
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
    deleteEducation};