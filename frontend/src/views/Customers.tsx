import { useState, useEffect, useRef } from 'react';
import { Customer } from '../interfaces/interfaces';
import { addToDatabase, removeFromDatabase, updateDatabase, getDatabaseArray } from '../services/db-requests';
import { generateUniqueID } from '../services/helpers'
import Table from '../components/Table';

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

  const [customerArray, setCustomerArray] = useState<Customer[]>([]);

  // Load customers from database on component mount / change
  useEffect(() => {
      async function fetchData() {
          const data = await getDatabaseArray('customerArray');  // Await the async function
          setCustomerArray(data);  // Set state with fetched data
      }
      fetchData();
  }, [customerArray]);

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

  async function createCustomer(e: any) {
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
          dateCreated: `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getFullYear()}`, // Get date in DD-MM-YYYY format
          jobTitle: jobTitleRef.current?.value || "",
          industry: industryRef.current?.value || "",
          customerId: id,
        };  
        alert('Successfully created customer! ' + JSON.stringify(newCustomer));
        addToDatabase('customerArray', newCustomer);
        const updatedCustomerArray = await getDatabaseArray('customerArray');
        setCustomerArray(updatedCustomerArray);
      }
    } else {
      alert('Error creating customer,' + JSON.stringify(errors));
    }
  }
  
  async function handleRemoveFromDatabase(customer: Customer) {
    removeFromDatabase('customerArray', customer);
    const updatedCustomerArray = await getDatabaseArray('customerArray');
    setCustomerArray(updatedCustomerArray); 
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
          <Table data={customerArray} removeFn={handleRemoveFromDatabase}/>
        </div>
      ) : (
        <div>No customers saved. Start by creating a customer!</div>
      )}
</div>

  );
}
