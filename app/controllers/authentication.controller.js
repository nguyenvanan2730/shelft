import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";

dotenv.config();

export const users = [{
    username: 'admin',
    email: 'admin@admin.com',
    password: '$2b$05$v9UUJRYfgHaJnzy1luOJUe3dd78E6tmBPS4sQK51fBy.e4E/vtqMm'
}]

async function login(req, res){
    console.log(req.body);
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
        res.status(400).send({status: 'error', message: 'Invalid body'});
        return;
    }
    const userToCheck = users.find(user => user.email === email);
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
    console.log(req.body);
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

    const newUser = {
        username: username,
        email: email,
        password: hash
    }
    console.log(newUser);
    users.push(newUser);
    res.status(201).send({status: 'ok', message: `User ${newUser.username} created`, redirect:'/'});


}

export const methods = {
    login,
    register
}