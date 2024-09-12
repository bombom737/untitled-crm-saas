import { useState, useEffect, useRef } from 'react';
import { Customer } from '../interfaces/interfaces';
import { addToDatabase, updateDatabase, removeFromDatabase, getDatabaseModel } from '../services/db-requests';
import { generateUniqueID } from '../services/helpers'
import Table from '../components/Table';
import { validateEmail } from "../services/helpers.tsx"
import EditPane from '../components/EditPane.tsx';

export default function Customers() {
  
  const [customerArray, setCustomerArray] = useState<Customer[]>([]);
  const [currentLeadStatus, setCurrentLeadStatus] = useState<string>("");
  const [slidingPane, setSlidingPane] = useState<{visible: boolean, data?: any}>({visible: false});
  
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

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    leadStatus: false,
    jobTitle: false,
    industry: false
  })
  
  const [leadStatusList] = useState<Array<string>>([
    'New',
    'Open',
    'In Progress',
    'Open Deal',
    'Unqualified',
    'Attempted To Contact',
    'Connected',
  ]);
  

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);
  
  // Conditions for valid customers
  const conditions = {
    name: (value: string) => value !== "",
    phoneNumber: (value: string) => value.length > 7,
    leadStatus: (value: string) => value !== "",
    jobTitle: (value: string) => value !== "",
    industry: (value: string) => value !== "",
  };
  
  // Load customers from database on component mount 
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDatabaseModel('customerModel');
        console.log('Data fetched:', data); // Check if data is being logged
        if (data) {
          setCustomerArray(data); // Update state only if data is valid
        } else {
                console.error('No data returned');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
}, []);

  function validateInput(value: string, validationFn: (value: string) => boolean) {
    return validationFn(value);
  };

  // Perform all validations and return a boolean if all fields are valid
  function handleValidation() {
    const newErrors = {
      name: !validateInput(nameRef.current?.value || "", conditions.name),
      email: validateEmail(emailRef.current?.value || "") === null,
      phoneNumber: !validateInput(phoneNumberRef.current?.value || "", conditions.phoneNumber),
      leadStatus: !validateInput(currentLeadStatus || "", conditions.leadStatus),
      jobTitle: !validateInput(jobTitleRef.current?.value || "", conditions.jobTitle),
      industry: !validateInput(industryRef.current?.value || "", conditions.industry)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Checkbox toggle logic
  function toggleCheckbox(status: string) {
    setCurrentLeadStatus(prevStatus => {
      const newStatus = prevStatus === status ? "" : status;
      return newStatus;
    });
  }

    // Add customer locally and then update the database
    async function addCustomer (newCustomer: Customer) { 
      setCustomerArray(prevArray => [...prevArray, newCustomer]);  
      addToDatabase('customerModel', newCustomer);  
    };

    function editCustomer(customer: Customer) {
      setSlidingPane({visible: true});
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
      setCustomerToEdit(editCustomer)
      
      //// get customer from id
      //// get edited customer info
      //// update customer in array then pesist to database using updateDatabase
    }
  
    // Remove customer locally and then update the database
    async function removeCustomer (customerId: number) {
      setCustomerArray(prevArray => prevArray.filter(customer => customer.customerId !== customerId));  
      removeFromDatabase('customerModel', { customerId }); 
    };
  
    // Handle form submission to create a new customer
    async function createCustomer  (e: any) {
      e.preventDefault();
      if (handleValidation()) {
        const date = new Date();
        const id = generateUniqueID(customerArray, 100000, 999999);
  
        if (!id) {
          alert('REPLACE THIS WITH A NON ALERT ERROR MESSAGE: \n Unable to create customer, all possible IDs are taken')
        } else {
         const newCustomer: Customer = {
            name: nameRef.current?.value || "",
            email: emailRef.current?.value || "",
            phoneNumber: phoneNumberRef.current?.value || "",
            leadStatus: currentLeadStatus,
            dateCreated: `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-${date.getMonth() + 1 < 10 ? '0' + date.getMonth() : date.getMonth()}-${date.getFullYear()}`, // Add leading zero if necessary
            jobTitle: jobTitleRef.current?.value || "",
            industry: industryRef.current?.value || "",
            customerId: id,
          };
          await addCustomer(newCustomer);
        }
      }
      else{
        console.log('Error creating customer: ' + JSON.stringify(errors));
      }
    }

    function closePane(){
      setSlidingPane( {visible: false })
    }
  
  return (
  <div>
    <div>Customers</div>
    <form>
      <div className="createCustomer">
        <div>
          <input type="text" placeholder="Enter customer name" ref={nameRef} />
          {errors.name && <div style={{ color: 'red' }}>Please enter a name</div>}
        </div>

        <div>
          <input type="email" placeholder="Enter customer email" ref={emailRef} />
          {errors.email && <div style={{ color: 'red' }}>Please enter a vald email</div>}
        </div>

        <div>
          <input type="number" placeholder="Enter customer phone number" ref={phoneNumberRef} />
          {errors.phoneNumber && <div style={{ color: 'red' }}>Please enter a valid phone number</div>}
        </div>

        <label>Lead Status</label>
        <div>
          {leadStatusList.map((status) => (
            <div key={status}>
              <input
                type="checkbox"
                checked={currentLeadStatus === status}
                onChange={() => toggleCheckbox(status)}
              />
              <label>{status}</label>
            </div>
          ))}
          {errors.leadStatus && <div style={{ color: 'red' }}>Please select a lead status</div>}
        </div>

        <div>
          <input type="text" placeholder="Enter job title" ref={jobTitleRef} />
          {errors.jobTitle && <div style={{ color: 'red' }}>Please enter a job title</div>}
        </div>

        <div>
          <input type="text" placeholder="Enter industry" ref={industryRef} />
          {errors.industry && <div style={{ color: 'red' }}>Please enter industry</div>}
        </div>

        <button onClick={createCustomer}>Create Customer</button>
      </div>
    </form>
    {customerArray.length > 0 ? (
          <div>
            <Table data={customerArray} editFn={(rowData) => editCustomer(rowData)} removeFn={(rowData) => removeCustomer(rowData.customerId)} />
          </div>
        ) : (
          <div>No customers saved. Start by creating a customer!</div>
        )}
        <EditPane
        visible={slidingPane.visible}
        data={customerToEdit}
        closePane={closePane}
        ></EditPane>
  </div>
  );
}
