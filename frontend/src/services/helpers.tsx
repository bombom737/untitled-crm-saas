export function getRandomId(min:number, max:number): number{
    //Returns an ID
    return Math.trunc(Math.random() * (max - min) + min);
}

export function generateUniqueID(array: any, min:number, max:number) {
    // If all possible IDs are taken
    if (array.length >= max) {
      return undefined;
    }
  
    let attempts = 0;
    let id = getRandomId(min, max);
  
    while (findItemById(id, array) !== undefined) {
      if (attempts > max) {
        // Give up after too many unsuccessful attempts to find a free ID
        return undefined;
      }
      id = getRandomId(min, max);
      attempts++;
    }
  
    return id;
  }

export function findItemById(id:number, array:any) {
    return array.find((item: any) => item.id === id);
  }