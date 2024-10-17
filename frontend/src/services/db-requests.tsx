import { apiFetch, apiPost } from './axios-api.tsx'

export function addToDatabase(modelType:string, item:any) {
    
    apiPost('/user/add-item', {
        modelType: modelType,
        item: item
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item added successfully! ${JSON.stringify(item)}`);
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

export function removeFromDatabase(modelType:string, itemId:any) {

    apiPost('/user/remove-item', {
        modelType: modelType,
        item: itemId
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item removed successfully! ${JSON.stringify(itemId)}`);
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

export function updateDatabase(modelType:string, item:any) {
    
    apiPost('/user/update-item', {
        modelType: modelType,
        item: item
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Item updated successfully! ${JSON.stringify(item)}`);
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

export function moveDatabase(modelType:string, itemToMoveFrom:any, itemToMoveTo:any) {
    
    apiPost('/user/move-items', {
        modelType: modelType,
        itemToMoveFrom: itemToMoveFrom,
        itemToMoveTo: itemToMoveTo
    })
    .then((response) => {
        if (response.status === 200){
            console.log(`Successfully swapped ${JSON.stringify(itemToMoveFrom, null, 2)} and ${JSON.stringify(itemToMoveTo, null, 2)}`);
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

export async function getDatabaseModel(modelType: string): Promise<any> {
    return apiFetch('/user/get-model', { modelType: modelType })
        .then(response => {
            if (response && response.data) {
                const modelFromDatabase = response.data;
                console.log('Model from Database:', modelFromDatabase);
                return modelFromDatabase;
            } else {
                console.error('Response did not contain data.');
                return null;
            }
        })
        .catch(error => {
            console.error('Error in getDatabaseModel:', error);
            return null;
        });
}


export async function getUser(userId: number): Promise<any> {
    return apiFetch('/user/get-user', { id: userId })
        .then(response => {
            const user = response.data;
            return user;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
}