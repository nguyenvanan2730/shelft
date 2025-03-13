import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import {users} from '../controllers/authentication.controller.js';

dotenv.config();

function onlyPublic(req, res, next){
    console.log("Dentro de only public");
    const user = checkCookie(req);
    if(!user) return next();
    return res.redirect('/');
}

function onlyRegistered(req, res, next){
    console.log("Dentro de only registered");
    const user = checkCookie(req);
    console.log(user)
    if(user){
        console.log("Dentro de logged");
        return next();
    } 
    console.log("Dentro de no logged");
    return res.redirect('/');

    
}

function checkCookie(req) {
    console.log("Cookie header:", req.headers.cookie); // <--- LOG
  
    try {
      const rawCookie = req.headers.cookie
        ?.split(';')
        .find(c => c.trim().startsWith('jwt='));
      console.log("Raw cookie part:", rawCookie); // <--- LOG
  
      if (!rawCookie) return null;
  
      const cookieJWT = rawCookie.slice(4);
      console.log("cookieJWT value:", cookieJWT); // <--- LOG
  
      const decodedCookie = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
      console.log("decodedCookie:", decodedCookie); // <--- LOG
  
      const userToCheck = users.find(u => u.email === decodedCookie.email);
      console.log("userToCheck:", userToCheck); // <--- LOG
  
      return userToCheck || null;
    } catch (error) {
      console.error("Error en checkCookie:", error);
      return null;
    }
  }
  


export const methods = {
    onlyRegistered,
    onlyPublic,
    checkCookie
}