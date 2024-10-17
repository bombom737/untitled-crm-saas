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

export async function swapItems(model, item1, item2) {
    try {
      // Find the two items by their ids
      const itemToMoveFrom = await model.findOne({ id: item1.id });
      const itemToMoveTo = await model.findOne({ id: item2.id });
  
      if (!itemToMoveFrom || !itemToMoveTo) {
        throw new Error('One or both of the items were not found');
      }
  
      // Dynamically swap all fields except for _id
      const temp = { ...itemToMoveFrom.toObject(), _id: undefined };
  
      for (let key in temp) {
        if (key !== '_id') {
          itemToMoveFrom[key] = itemToMoveTo[key];
          itemToMoveTo[key] = temp[key];
        }
      }
  
      // Save the updated items back to the database
      await itemToMoveFrom.save();
      await itemToMoveTo.save();
  
    } catch (error) {
      console.error('Error swapping items:', error);
    }
  }
  