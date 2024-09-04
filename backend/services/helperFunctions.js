import UserModel from "../models/userModel.js";

export function getRandomId(min, max) {
    //Returns an ID
    return Math.trunc(Math.random() * (max - min) + min);
}

export async function generateUniqueID(min, max) {
    
    let attempts = 0;
    let id = getRandomId(min, max);
    
    const existingUser = await UserModel.findOne({id: id})
    if (!existingUser){
        return id
    }
  
    while (existingUser.id) {
      id = getRandomId(min, max);
      attempts++;
    }
  
    return id;
}