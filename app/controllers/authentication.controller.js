import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
import { sendVerificationEmail } from "../services/mail.service.js";

dotenv.config();

export const users = [{
    username: 'peremb',
    email: 'perette93@gmail.com',
    password: '$2b$05$yBEg4g0h5d4xNDYA0T5Fs.mBzwjqNoiTZq7zc5NWWeg/I4x81HwS2',
    verified: false
}]

async function login(req, res){
    console.log(req.body);
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
        res.status(400).send({status: 'error', message: 'Invalid body'});
        return;
    }
    const userToCheck = users.find(user => user.email === email && user.verified);
    if (!userToCheck) {
        res.status(400).send({status: 'error', message: 'Errror Loging In'});
        return;
    }
    const loginCorrect = await bcryptjs.compare(password, userToCheck.password);
    if (!loginCorrect) {
        res.status(400).send({status: 'error', message: 'Errror Loging In'});
        return;
    }
    const token = jsonwebtoken.sign(
        {email: userToCheck.email}, 
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRES_IN});

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        path: '/'
    }
    res.cookie('jwt', token, cookieOptions);
    res.status(200).send({status: 'ok', message: 'Logged in', redirect: '/user'});

}

async function register(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (!username || !password || !email) {
        res.status(400).send({status: 'error', message: 'Invalid body'});
        return;
    }
    const userToCheck = users.find(user => user.username === username);
    if (userToCheck) {
        res.status(400).send({status: 'error', message: 'User already exists'});
        return;
    }
    const sal = await bcryptjs.genSalt(5);
    const hash = await bcryptjs.hash(password, sal);

    //Verify Email
    const tokenVerify = jsonwebtoken.sign(
        {email: email}, 
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRES_IN});
    const mail = await sendVerificationEmail(email, tokenVerify);
    console.log("Mail sended")
    if(mail.accepted === 0){
        return res.status(500).send({status: 'error', message: 'Error sending email'});
    }

    const newUser = {
        username: username,
        email: email,
        password: hash,
        verified: false
    }
    console.log(newUser);
    users.push(newUser);
    res.status(201).send({status: 'ok', message: `User ${newUser.username} created`, redirect:'/'});
    console.log("newUser created");
}

function verifyAccount(req, res){
    try{
        if (!req.params.token) {
            return res.redirect("/");
        }
        const decodedCookie = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET);
        if(!decodedCookie || !decodedCookie.email){
            return res.redirect("/").send({status: 'error', message: 'Invalid token'});
        }
        const token = jsonwebtoken.sign(
            {email: decodedCookie.email}, 
            process.env.JWT_SECRET, 
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );
    
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            path: '/'
        }

        const indexUserToUpdate = users.findIndex(user => user.email === decodedCookie.email);
        users[indexUserToUpdate].verified = true;
        console.log("User verified");
        console.log(decodedCookie);
        console.log(users[indexUser]);
        res.cookie('jwt', token, cookieOptions);
        res.redirect('/');
    }
    catch (err){
        res.status(500)
        res.redirect("/");
    }
}

export const methods = {
    login,
    register,
    verifyAccount
}