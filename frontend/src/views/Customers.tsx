import { useState, useEffect } from 'react';
import { Customer } from '../interfaces/interfaces';
import { addToDatabase, updateDatabase, removeFromDatabase, getDatabaseModel } from '../services/db-requests';
import { generateUniqueID } from '../services/helpers'
import Table from '../components/Table';
import SlidePane from '../components/SlidePane.tsx';
import CustomerForm from '../components/CustomerForm.tsx';
import "./Customers.css"

export default function Customers() {
  
  const [customerArray, setCustomerArray] = useState<Customer[]>([]);
 
  const [slidingPane, setSlidingPane] = useState<{visible: boolean, data?: any}>({visible: false});

  const [title, setTitle] = useState<string>("")
  
  const [customerToEdit, setCustomerToEdit] = useState<Customer>({
    name: "",
    email: "",
    phoneNumber: "",
    leadStatus: "",
    dateCreated: "",
    jobTitle: "",
    industry: "",
    customerId: 0,
  });

  
  // Load customers from database on component mount 
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDatabaseModel('customerModel');
        console.log('Data fetched:', data); // Check if data is being logged
        if (data) {
          setCustomerArray(data.customers); // Update state only if data is valid
        } else {
                console.error('No data returned');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
  }, []);

  function resetCustomerToEdit() {
    setCustomerToEdit({
      name: "",
      email: "",
      phoneNumber: "",
      leadStatus: "",
      dateCreated: "",
      jobTitle: "",
      industry: "",
      customerId: 0,
    });
  };

  function loadCustomerToEdit(customer: Customer) {
    
    const editCustomer: Customer ={
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      leadStatus: customer.leadStatus,
      dateCreated: customer.dateCreated,
      jobTitle: customer.jobTitle,
      industry: customer.industry,
      customerId: customer.customerId
    };

    console.log(customer.customerId)
    setCustomerToEdit(editCustomer);
    setTitle("Edit Customer")
    setSlidingPane({visible: true});
  };
  
    // Remove customer locally and then update the database
    async function removeCustomer (customerId: number) {
      setCustomerArray(prevArray => prevArray.filter(customer => customer.customerId !== customerId));  
      removeFromDatabase('customerModel', { customerId }); 
    };
  
    // Save customer changes or add customer to database
  function saveCustomer(customer: Customer) {
    const existingCustomer = customerArray.find((c) => c.customerId === customer.customerId);
    if (existingCustomer) {
      console.log(`Existing customer ID: ${existingCustomer.customerId}`)
      // Update customer locally and then update in the database
      updateDatabase("customerModel", customer);
      setCustomerArray(prevArray => 
        prevArray.map(c => c.customerId === customer.customerId ? customer : c)
      );
      closePane();
    } else {
      const date = new Date();
      const id = generateUniqueID(customerArray, 100000, 999999);
      if (!id) {
        alert('REPLACE THIS WITH A NON ALERT ERROR MESSAGE: \n Unable to create customer, all possible IDs are taken');
      } else {
        const newCustomer = {
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          leadStatus: customer.leadStatus,
          dateCreated: `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getFullYear()}`,
          jobTitle: customer.jobTitle,
          industry: customer.industry,
          customerId: id
        };
        // Add customer locally and then add to the database
        setCustomerArray(prevArray => [...prevArray, newCustomer]);
        addToDatabase('customerModel', newCustomer);
        closePane();
      }
    }
  };
  
    function openPane() {
      resetCustomerToEdit();
      setTitle("Add Customer")
      setSlidingPane({visible: true });
    };

    function closePane() {
      setSlidingPane( {visible: false });
    };
  
  return (
  <div>
    <button onClick={openPane}>Add Customer</button>
    {customerArray.length > 0 ? (
          <div>
            <Table data={customerArray} editFn={(rowData) => loadCustomerToEdit(rowData)} removeFn={(rowData) => removeCustomer(rowData.customerId)} />
          </div>
        ) : (
          <div>No customers saved. Start by creating a customer!</div>
        )}
        <div className="edit-pane">
          <SlidePane
          visible={slidingPane.visible}
          title={title}
          closePane={closePane}
          display={<CustomerForm customerToEdit={customerToEdit} onCustomerValidated={(customer) => saveCustomer(customer)} onCancel={closePane}/>}
          ></SlidePane>
        </div>
  </div>
  );
}
