import React, { useState, useEffect, useRef } from 'react';
import { Sale, SaleCard } from '../interfaces/interfaces';
import { generateUniqueID } from '../services/helpers';

interface Props {
    saleCards: Array<SaleCard>;
    saleToEdit?: Sale; 
    onSaleValidated: (sale: Sale) => void;
    onCancel: () => void;
}

export default function SaleForm({ saleToEdit, onSaleValidated, onCancel, saleCards} : Props) {
  
  const initialSale = {
    dealName: "",
    dealStage: "",
    amount: 0,
    closeDate: "",
    saleType: "",
    priority: "",
    associatedWith: "",
    saleId: generateUniqueID(saleCards, 100000, 999999)
  };
  
  const [sale, setSale] = useState<Sale>(initialSale);

  const [errors, setErrors] = useState({
    dealName: false,
    dealStage: false,
    amount: false,
    closeDate: false,
    saleType: false,
    priority: false,
    associatedWith: false,
    saleId: false,
  });

  const dealNameRef = useRef<HTMLInputElement>(null);
  const dealStageRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const closeDateRef = useRef<HTMLInputElement>(null);
  const saleTypeRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLInputElement>(null);
  const associatedWithRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSale(saleToEdit || initialSale);
  }, [saleToEdit]);

  
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
    // const newErrors = {
    //   name: !validateInput(nameRef.current?.value || "", conditions.name),
    //   email: validateEmail(emailRef.current?.value || "") === null,
    //   phoneNumber: !validateInput(phoneNumberRef.current?.value || "", conditions.phoneNumber),
    //   leadStatus: !validateInput(currentLeadStatus || "", conditions.leadStatus),
    //   jobTitle: !validateInput(jobTitleRef.current?.value || "", conditions.jobTitle),
    //   industry: !validateInput(industryRef.current?.value || "", conditions.industry)
    // };

    // setErrors(newErrors);
    // return Object.values(newErrors).every((error) => !error);
    return true
  }

  // Pass customer info to Customer page 
  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const saleToSave: Sale = {
        ...sale,
        dealName: dealNameRef.current?.value || "",
        dealStage: dealStageRef.current?.value || "",
        amount: Number(amountRef.current?.value) || 0,
        closeDate: closeDateRef.current?.value || "",
        saleType: saleTypeRef.current?.value || "",
        priority: priorityRef.current?.value || "",
        associatedWith: associatedWithRef.current?.value || "",
        saleId: sale?.saleId
      };

      onSaleValidated(saleToSave); // Pass customer info
    } else {
      console.log('Validation failed, check errors');
    }
  };

  return (
    <form onSubmit={validate}>
      <div className="createCustomer">
        <div>
          <label>Name *</label>
          <input
            type="text"
            name="name"
            defaultValue={sale? sale.dealName : ""}
            ref={dealNameRef}
          />
          {errors.dealName && <div style={{ color: 'red' }}>Please enter a name</div>}
        </div>

        <div>
          <label>Deal Stage</label>
          <input
            type="text"
            name="email"
            defaultValue={sale? sale.dealStage : ""}
            placeholder="Enter customer email"
            ref={dealStageRef}
          />
          {errors.dealStage && <div style={{ color: 'red' }}>Please enter a valid email</div>}
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            defaultValue={sale? sale.amount : ""}
            ref={amountRef}
          />
          {errors.amount && <div style={{ color: 'red' }}>Please enter a valid amount</div>}
        </div>

        <div>
          <label>Close Date</label>
          <input
            type="date"
            name="date"
            defaultValue={sale? sale.amount : ""}
            placeholder="Make this a date select"
            ref={closeDateRef}
          />
          {errors.closeDate && <div style={{ color: 'red' }}>Please enter a date</div>}
        </div>

        <div>
          <label>Sale Type</label>
          <input
            type="text"
            name="saleType"
            defaultValue={sale ? sale.saleType : ""}
            placeholder="Enter job title"
            ref={saleTypeRef}
          />
          {errors.saleType && <div style={{ color: 'red' }}>Please enter a sale type</div>}
        </div>

        <div>
          <label>priority</label>
          <input
            type="text"
            name="priority"
            defaultValue={sale ? sale.priority : ""}
            placeholder="Enter industry"
            ref={priorityRef}
          />
          {errors.priority && <div style={{ color: 'red' }}>Please enter priority</div>}
        </div>

        <button type='submit'>Save Sale</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
