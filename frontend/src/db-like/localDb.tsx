export function addToDatabase(item:any, key:string): boolean {
    const data = localStorage.getItem(key);
    const parsedArray: any[] = data ? JSON.parse(data) : [];

    if(parsedArray.push(item) === 0) {
        return false;
    }
    localStorage.setItem(key, JSON.stringify(parsedArray));
    return true;
}

export function removeFromDatabase(item:any, key:string): boolean {
    
    const data = localStorage.getItem(key);
    const parsedArray: [] = data ? JSON.parse(data) : [];
    
    if (parsedArray.length === 0) {
        return false;
    }

    const itemIndex = parsedArray.findIndex(
        (storedItem:any) => storedItem.id === item.id);

    if (itemIndex !== -1) {
        parsedArray.splice(itemIndex, 1);
        localStorage.setItem(key, JSON.stringify(parsedArray));
        return true;
    }
    return false;
}


export function getDatabaseArray(key:string): Array<any> {
    const data = localStorage.getItem(key);
    if(!data){
        return []
    }
    const parsedArray: [] = data ? JSON.parse(data) : [];
    return parsedArray
}