import React, { useState, useEffect, useRef } from 'react';
import { Customer } from '../interfaces/interfaces';
import { validateEmail } from "../services/helpers.tsx"

export default function CustomerForm({ customerToEdit, onCustomerValidated, onCancel }: { customerToEdit: Customer, onCustomerValidated: (customer: Customer) => void , onCancel: () => void}) {
  
  const [tempCustomer, setTempCustomer] = useState(customerToEdit);

  const [leadStatusList] = useState<Array<string>>([
    'New',
    'Open',
    'In Progress',
    'Open Deal',
    'Unqualified',
    'Attempted To Contact',
    'Connected',
  ]);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    leadStatus: false,
    jobTitle: false,
    industry: false
  });

  const [currentLeadStatus, setCurrentLeadStatus] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempCustomer(customerToEdit); // Initialize tempCustomer with current customer info
    setCurrentLeadStatus(customerToEdit.leadStatus);
  }, [customerToEdit]);

  
  // Conditions for valid customers
  const conditions = {
    name: (value: string) => value !== "",
    phoneNumber: (value: string) => value.length > 7,
    leadStatus: (value: string) => value !== "",
    jobTitle: (value: string) => value !== "",
    industry: (value: string) => value !== "",
  };
  
  // Validation helper function
  function validateInput(value: string, validationFn: (value: string) => boolean) {
    return validationFn(value);
  }

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
  }

  // Checkbox toggle logic
  function toggleCheckbox(status: string) {
    setCurrentLeadStatus(prevStatus => {
      const newStatus = prevStatus === status ? "" : status;
      return newStatus;
    });
  }

  // Pass customer info to Customer page 
  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const customerToSave: Customer = {
        ...tempCustomer,
        name: nameRef.current?.value || "",
        email: emailRef.current?.value || "",
        phoneNumber: phoneNumberRef.current?.value || "",
        leadStatus: currentLeadStatus,
        jobTitle: jobTitleRef.current?.value || "",
        industry: industryRef.current?.value || "",
        dateCreated: tempCustomer.dateCreated,
        customerId: tempCustomer.customerId
      };

      console.log(JSON.stringify(customerToSave))
      onCustomerValidated(customerToSave); // Pass customer info
    } else {
      console.log('Validation failed, check errors');
    }
  };

  return (
    <form onSubmit={validate}>
      <div className="createCustomer">
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            defaultValue={tempCustomer.name}
            placeholder="Enter customer name"
            ref={nameRef}
          />
          {errors.name && <div style={{ color: 'red' }}>Please enter a name</div>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={tempCustomer.email}
            placeholder="Enter customer email"
            ref={emailRef}
          />
          {errors.email && <div style={{ color: 'red' }}>Please enter a valid email</div>}
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="number"
            name="phoneNumber"
            defaultValue={tempCustomer.phoneNumber}
            placeholder="Enter customer phone number"
            ref={phoneNumberRef}
          />
          {errors.phoneNumber && <div style={{ color: 'red' }}>Please enter a valid phone number</div>}
        </div>

        <div>
          <label>Lead Status</label>
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
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            defaultValue={tempCustomer.jobTitle}
            placeholder="Enter job title"
            ref={jobTitleRef}
          />
          {errors.jobTitle && <div style={{ color: 'red' }}>Please enter a job title</div>}
        </div>

        <div>
          <label>Industry</label>
          <input
            type="text"
            name="industry"
            defaultValue={tempCustomer.industry}
            placeholder="Enter industry"
            ref={industryRef}
          />
          {errors.industry && <div style={{ color: 'red' }}>Please enter industry</div>}
        </div>

        <button type='submit'>Save Customer</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
