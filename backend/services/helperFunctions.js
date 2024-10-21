import UserModel from "../models/userModel.js";

export function getRandomId(min, max) {
    // Returns an ID
    return Math.trunc(Math.random() * (max - min) + min);
}

export async function generateUniqueID(min, max) {
    
    let attempts = 0;
    
    // Generate a random ID 
    let id = getRandomId(min, max);
    
    // Check if a user already exists with created ID
    const existingUser = await UserModel.findOne({id: id})
    // Return ID if it is free
    if (!existingUser){
        return id
    }
    
    // If ID is taken, keep creating new IDs until either an ID is found or no ID is available
    while (existingUser.id) {
        if (attempts === max){
            return null
        }
        id = getRandomId(min, max);
        existingUser = await UserModel.findOne({id: id})
        attempts++;
    }
  
    return id;
}

export async function swapItems (array, index1, index2) {
  
  if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length) {
      throw new Error('Invalid index for array swap');
  }

  // Perform the swap
  [array[index1], array[index2]] = [array[index2], array[index1]];

  return array;  // Return the modified array
};
  