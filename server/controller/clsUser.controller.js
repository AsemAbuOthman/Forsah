const clsUser = require('../model/clsUser.model');
const {getConnection} = require('../config/clsConfig')
const nodemailer  = require( 'nodemailer');
const { randomInt }  = require( 'crypto');
const { parse }  = require('url');


    const  isEmailExist = async (req, res, email) => {
        try {
            
            const isEmailExist = await clsUser.isEmailExist(email);
        
            if (isEmailExist) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(isEmailExist));
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

    const  getUserByGoogle = async (req, res, googleAccount) => {
        try {
            
            const user = await clsUser.findUserByGoogle(googleAccount);
        
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
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

    const  getUser = async (req, res, body) => {
        try {
            const { email, password } = JSON.parse(body);
            
            const user = await clsUser.findUserByEmailPassword(email, password);
        
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
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

    const signOut = async (req, res) => {
        try {
            
            const result = await clsUser.singOut();
            
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
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
                res.end(JSON.stringify({ message: 'Error with inserting user into DB' }));
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

    const deletePortfolio = async (req, res, id) => {
        try {
        
            const result = await clsUser.deletePortfolio(id);
        
            console.log( 'Result : ', result);

            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
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

    const createSkills = async (req, res, body)=>{
        try {

            const skills = await clsUser.createSkills(JSON.parse(body));
            
            if (skills) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(skills));
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

            console.log( 'certifications : ', certifications);

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

    const updatePortfolio= async (req, res, id, newData) => {
        try {

            const portfolio = await clsUser.updatePortfolio(id, JSON.parse(newData));
        
            console.log( 'update portfolio : ', portfolio);

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

    const updateRole = async (req, res, userId, newData) => {
        try {

            const updatedData = await clsUser.updateRole(userId, JSON.parse(newData));
        
            console.log( 'isUpdated password : ', updatedData);

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
    
    const updateAccountActivation = async (req, res, userId,  newData) => {
        try {

            const updatedData = await clsUser.updateAccountActivation(userId, JSON.parse(newData));
        
            console.log( 'isUpdated password : ', updatedData);

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

    const deleteAccount = async (req, res, userId) => {
        try {

                const isDeleted = await clsUser.deleteAccount(userId);
            
                console.log( 'isDeleted password : ', isDeleted);

                if (isDeleted) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(isDeleted));
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

    const forgetPassword = async (req, res, body) => {

        const otpStore = new Map(); // In-memory OTP store

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'forsah444@gmail.com',         // Replace with your email
            pass: 'jzoj hwgw xoid hdof',       // Use Gmail App Password Forsah444@444
        },
        });

        try {
            const { email } = JSON.parse(body);
        

            // Generate OTP
            const otp = randomInt(100000, 999999).toString();
            otpStore.set(email, otp);
        

            const mailOptions = {
                from: 'forsah444@gmail.com',
                to: email,
                subject: 'Your Password Reset OTP',
                html: `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>OTP Verification</title>
                            </head>
                            <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: Arial, sans-serif;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f7; padding: 40px 0;">
                                <tr>
                                <td align="center">
                                    <table width="100%" max-width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                                    <tr>
                                        <td style="background: linear-gradient(to right, #7c3aed, #4f46e5); padding: 24px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Verify Your Email</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 32px;">
                                        <p style="margin: 0 0 16px; font-size: 16px; color: #333333;">
                                            Hello <strong>${email}</strong>,
                                        </p>
                                        <p style="margin: 0 0 24px; font-size: 16px; color: #333333;">
                                            We received a request to reset your password. Use the OTP below to complete the verification:
                                        </p>

                                        <div style="margin: 24px 0; text-align: center;">
                                            <p style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 8px;">
                                            ${otp}
                                            </p>
                                        </div>

                                        <p style="margin: 0 0 16px; font-size: 14px; color: #666666;">
                                            If you didn’t request this, you can ignore this email. This OTP is valid for the next 10 minutes.
                                        </p>

                                        <p style="margin: 32px 0 0; font-size: 14px; color: #666666;">
                                            Best regards,<br />
                                            The Support Team
                                        </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="background-color: #f0f0f0; padding: 16px; text-align: center;">
                                        <p style="margin: 0; font-size: 12px; color: #999999;">
                                            &copy; {${Date.now()}} Your Company. All rights reserved.
                                        </p>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>
                            </table>
                            </body>
                            </html>
                            `,
            };
        
            await transporter.sendMail(mailOptions);
        
            res.statusCode = 200;
            res.end(JSON.stringify({code: otp, message: 'OTP sent successfully'}));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }

    const updatePasswordByEmail = async (req, res, newData) => {
        try {

            const updatedData = await clsUser.updatePasswordByEmail(JSON.parse(newData));
        
            console.log( 'isUpdated password : ', updatedData);

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

    const updatePassword= async (req, res, id, newData) => {
        try {

            const updatedData = await clsUser.updatePassword(id, JSON.parse(newData));
        
            console.log( 'isUpdated password : ', updatedData);

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

    
    const updateProfileImage = async (req, res, id, newData) => {
        try {

            const updatedData = await clsUser.updateProfileImage(id, JSON.parse(newData));
        
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
    signOut};