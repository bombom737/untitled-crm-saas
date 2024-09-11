import { useState, useEffect, useRef } from 'react';
import { Customer } from '../interfaces/interfaces';
import { addToDatabase, removeFromDatabase, updateDatabase, getUser,  getDatabaseModel } from '../services/db-requests';
import { generateUniqueID } from '../services/helpers'
import Table from '../components/Table';
import { validateEmail } from "../services/helpers.tsx"

export default function Customers() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    leadStatus: false,
    jobTitle: false,
    industry: false
  })
  const [currentLeadStatus, setCurrentLeadStatus] = useState<string>("");
  const [leadStatusList] = useState<Array<string>>([
    'New',
    'Open',
    'In Progress',
    'Open Deal',
    'Unqualified',
    'Attempted To Contact',
    'Connected',
  ]);

  const [customerArray, setCustomerArray] = useState<Customer[]>([]);

  // Load customers from database on component mount 
  useEffect(() => {
      async function fetchData() {
          const data = await getDatabaseModel('customerModel');  
          setCustomerArray(data); 
      }
      fetchData();
  }, []);
  
  const validateInput = (value: string, validationFn: (value: string) => boolean) => {
    return validationFn(value);
  };

  const conditions = {
    name: (value: string) => value !== "",
    phoneNumber: (value: string) => value.length > 7,
    leadStatus: (value: string) => value !== "",
    jobTitle: (value: string) => value !== "",
    industry: (value: string) => value !== "",
  };

  // Perform all validations and return a boolean if all fields are valid
  const handleValidation = () => {
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
    const addCustomer = async (newCustomer: Customer) => {
      setCustomerArray(prevArray => [...prevArray, newCustomer]);  
      await addToDatabase('customerModel', newCustomer);  
    };
  
    // Remove customer locally and then update the database
    const removeCustomer = async (customerId: number) => {
      setCustomerArray(prevArray => prevArray.filter(customer => customer.customerId !== customerId));  
      await removeFromDatabase('customer', { customerId }); 
    };
  
    // Handle form submission to create a new customer
    const createCustomer = async (e: any) => {
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
            dateCreated: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
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
            <Table data={customerArray} removeFn={(rowData) => removeCustomer(rowData.customerId)} />
          </div>
        ) : (
          <div>No customers saved. Start by creating a customer!</div>
        )}
  </div>
  );
}
