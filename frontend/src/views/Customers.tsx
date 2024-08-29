import { useState, useEffect, useRef } from 'react';
import { Customer } from '../interfaces/interfaces';
import { addToDatabase, removeFromDatabase, getDatabaseArray } from '../db-like/localDb';
import CustomerCard from '../components/CustomerCard';
import { generateUniqueID } from '../services/helpers'

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
  const [possibleLeadStatus] = useState<Array<string>>([
    'New',
    'Open',
    'In Progress',
    'Open Deal',
    'Unqualified',
    'Attempted To Contact',
    'Connected',
  ]);

  // State to store customer array
  const [customerArray, setCustomerArray] = useState<Customer[]>([]);

  // Load customers from localStorage on component mount
  useEffect(() => {
    setCustomerArray(getDatabaseArray('customerArray'));
  }, []);

  const validateInput = (value: string, validationFn: (value: string) => boolean) => {
    return validationFn(value);
  };

  const conditions = {
    name: (value: string) => value !== "",
    email: (value: string) => value !== "",
    phoneNumber: (value: string) => value !== "",
    leadStatus: (value: string) => value !== "",
    jobTitle: (value: string) => value !== "",
    industry: (value: string) => value !== "",
  };

  // Perform all validations and return a boolean if all fields are valid
  const handleValidation = () => {
    const newErrors = {
      name: !validateInput(nameRef.current?.value || "", conditions.name),
      email: !validateInput(emailRef.current?.value || "", conditions.email),
      phoneNumber: !validateInput(phoneNumberRef.current?.value || "", conditions.phoneNumber),
      leadStatus: !validateInput(currentLeadStatus || "", conditions.leadStatus),
      jobTitle: !validateInput(jobTitleRef.current?.value || "", conditions.jobTitle),
      industry: !validateInput(industryRef.current?.value || "", conditions.industry)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  function toggleCheckbox(status: string) {
    setCurrentLeadStatus(prevStatus => {
      const newStatus = prevStatus === status ? "" : status;
      return newStatus;
    });
  }

  function createCustomer(e: any) {
    e.preventDefault();
    if (handleValidation()) {
      let date = new Date();

      let id:number | undefined = generateUniqueID(customerArray, 100000, 999999)
      //Ensure that all customers have unique IDs, quit if no free IDs are available
      if (typeof id === undefined){
        alert('Unable to create customer, all possible IDs are taken');
      } else {
        const newCustomer: Customer = {
          name: nameRef.current?.value || "",
          email: emailRef.current?.value || "",
          phoneNumber: phoneNumberRef.current?.value || "",
          leadStatus: currentLeadStatus,
          dateCreated: `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getFullYear()}`,
          jobTitle: jobTitleRef.current?.value || "",
          industry: industryRef.current?.value || "",
          customerId: id,
        };  
        alert('Successfully created customer! ' + JSON.stringify(newCustomer));
        addToDatabase(newCustomer, 'customerArray');
        setCustomerArray(getDatabaseArray('customerArray'));
      }
    } else {
      alert('Error creating customer,' + JSON.stringify(errors));
    }
  }
  
  function handleremoveFromDatabase(customer: Customer) {
    removeFromDatabase(customer, 'customerArray');
    setCustomerArray(getDatabaseArray('customerArray'));
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
        <input type="text" placeholder="Enter customer email" ref={emailRef} />
        {errors.email && <div style={{ color: 'red' }}>Please enter an email</div>}
      </div>

      <div>
        <input type="text" placeholder="Enter customer phone number" ref={phoneNumberRef} />
        {errors.phoneNumber && <div style={{ color: 'red' }}>Please enter a phone number</div>}
      </div>

      <label>Lead Status</label>
      <div>
        {possibleLeadStatus.map((status) => (
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
          {customerArray.map((customer, index) => (
            <div key={index}>
              <CustomerCard customer={customer} />
              <button onClick={() => handleremoveFromDatabase(customer)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <div>No customers saved. Start by creating a customer!</div>
      )}
</div>

  );
}
