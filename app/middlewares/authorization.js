import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import {users} from '../controllers/authentication.controller.js';

dotenv.config();

function onlyPublic(req, res, next){
    console.log("Dentro de only public");
    const logged = checkCookie(req);
    if(!logged) return next();
    return res.redirect('/');
}

function onlyRegistered(req, res, next){
    console.log("Dentro de only registered");
    const logged = checkCookie(req);
    console.log(logged)
    if(logged){
        console.log("Dentro de logged");
        return next();
    } 
    console.log("Dentro de no logged");
    return res.redirect('/');
}

function checkCookie(req){
    try{
        const cookieJWT = req.headers.cookie.split(';').find(cookie => cookie.startsWith('jwt=')).slice(4);
        const decodedCookie = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        const userToCheck = users.find(user => user.email === decodedCookie.email);
        if(!userToCheck) return false;
        return true;
    }
    catch{
        return false;
    }
}


export const methods = {
    onlyRegistered,
    onlyPublic
}