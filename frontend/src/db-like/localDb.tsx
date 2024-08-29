import { Customer } from "../interfaces/interfaces";

export function addToDatabase(customer: Customer, key:string): boolean {
    const data = localStorage.getItem(key);
    const parsedArray: Customer[] = data ? JSON.parse(data) : [];

    if(parsedArray.push(customer) === 0) {
        return false;
    }
    localStorage.setItem(key, JSON.stringify(parsedArray));
    return true;
}

export function removeFromDatabase(customer: Customer, key:string): boolean {
    
    const data = localStorage.getItem(key);
    const parsedArray: Customer[] = data ? JSON.parse(data) : [];
    
    if (parsedArray.length === 0) {
        return false;
    }

    const customerIndex = parsedArray.findIndex(
        (storedCustomer) =>
            storedCustomer.name === customer.name &&
            storedCustomer.email === customer.email &&
            storedCustomer.phoneNumber === customer.phoneNumber
    );

    if (customerIndex !== -1) {
        parsedArray.splice(customerIndex, 1);
        localStorage.setItem(key, JSON.stringify(parsedArray));
        return true;
    }
    return false;
}


export function getDatabaseArray(key:string): Array<Customer> {
    const data = localStorage.getItem(key);
    if(!data){
        return []
    }
    const parsedArray: Customer[] = data ? JSON.parse(data) : [];
    return parsedArray
}