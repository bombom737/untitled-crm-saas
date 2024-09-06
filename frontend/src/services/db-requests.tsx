import { apiFetch, apiPost } from './axios-api.tsx'

export function addToDatabase(arrayType:string, item:any) {
    
    apiPost('/user/add-item', {
        arrayType: arrayType,
        item: item
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item added successfully! ${item}`);
        }
    })
    .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error('User not found');
        } else if (error.response && error.response.status === 400){
            console.error('Error fetching data: ' + error);
        } else {
            console.error('Internal server error: ' + error);
        }
    });
}

export function removeFromDatabase(arrayType:string, item:any) {
    
    console.log(`${arrayType} ${JSON.stringify(item)}`)
    apiPost('/user/remove-item', {
        arrayType: arrayType,
        item: item
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item removed successfully! ${JSON.stringify(item)}`);
        }
    })
    .catch((error) => {
        if (error.response && error.response.status === 404) {
            console.error('User not found');
        } else if (error.response && error.response.status === 400){
            console.error('Error fetching data: ' + error);
        } else {
            console.error('Internal server error: ' + error);
        }
    });
}

export function updateDatabase(arrayType:string, item:any) {
    
    apiPost('/user/update-item', {
        arrayType: arrayType,
        item: item
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item updated successfully! ${item}`);
        }
    })
    .catch((error) => {
        if (error.response && error.response.status === 404) {
            console.error('User not found');
        } else if (error.response && error.response.status === 400){
            console.error('Error fetching data: ' + error);
        } else {
            console.error('Internal server error: ' + error);
        }
    });
}

export function getDatabaseArray(arrayType: string): Promise<Array<any>> {
    return apiFetch('/user/get-array', { arrayType: arrayType })
        .then(response => {
            const arrayFromDatabase = response.data;
            return arrayFromDatabase;
        })
        .catch(error => {
            console.error(error);
            return [];
        });
}