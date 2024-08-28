import { Customer } from "../interfaces/customerInterface";

export function addCustomer(customer:Customer): boolean {
    const storedCustomerArray = localStorage.getItem('customerArray');
    const customerArray: Customer[] = storedCustomerArray ? JSON.parse(storedCustomerArray) : [];

    if(customerArray.push(customer) === 0) {
        return false;
    }
    localStorage.setItem('customerArray', JSON.stringify(customerArray));
    return true;
}

export function removeCustomer(customer: Customer): boolean {
    
    const storedCustomerArray = localStorage.getItem('customerArray');
    const customerArray: Customer[] = storedCustomerArray ? JSON.parse(storedCustomerArray) : [];
    
    if (customerArray.length === 0) {
        return false;
    }

    const customerIndex = customerArray.findIndex(
        (storedCustomer) =>
            storedCustomer.name === customer.name &&
            storedCustomer.email === customer.email &&
            storedCustomer.phoneNumber === customer.phoneNumber
    );

    if (customerIndex !== -1) {
        customerArray.splice(customerIndex, 1);
        localStorage.setItem('customerArray', JSON.stringify(customerArray));
        return true;
    }
    return false;
}


export function getCustomerArray(): Array<Customer> {
    const storedCustomerArray = localStorage.getItem('customerArray');
    if(!storedCustomerArray){
        return []
    }
    const customerArray: Customer[] = storedCustomerArray ? JSON.parse(storedCustomerArray) : [];
    return customerArray
}