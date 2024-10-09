import React, { useState, useEffect, useRef } from 'react';
import { Sale, SaleCard } from '../interfaces/interfaces';
import { generateUniqueID } from '../services/helpers';
import './SaleForm.css';

interface Props {
  saleCards: Array<SaleCard>;  
  saleToEdit?: Sale; 
  onSaleValidated: (sale: Sale) => void;
  onCancel: () => void;
  onDeleteSale: (id: number) => void;
}

export default function SaleForm({ saleCards, saleToEdit, onSaleValidated, onCancel, onDeleteSale } : Props) {
  
  const [sale, setSale] = useState<Sale | undefined>(undefined);

  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    saleType: false,
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const dealStageRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const closeDateRef = useRef<HTMLInputElement>(null);
  const saleTypeRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLInputElement>(null);
  const associatedWithRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSale(saleToEdit?.dealName ? saleToEdit : undefined);
  }, [saleToEdit]);

  
  // Conditions for valid sales
  const conditions = {
    name: (value: string) => value !== "", // Only validate strings
    amount: (value: number) => value !== 0 && value < 100000000000000, // Only validate numbers
    saleType: (value: string) => value !== "", // Only validate strings
  };
  
  // Validation helper function that validates based on the value type
  function validateInput(value: string | number, validationFn: (value: any) => boolean) {
    // Use type guards to validate correctly based on the type
    if (typeof value === "string") {
      return validationFn(value);
    } else if (typeof value === "number") {
      return validationFn(value);
    }
    return false; // Invalid type
  }
  
  // Perform all validations and return a boolean if all fields are valid
  function handleValidation() {
    const newErrors = {
      name: !validateInput(nameRef.current?.value || "", conditions.name), 
      amount: !validateInput(Number(amountRef.current?.value) || 0, conditions.amount), 
      saleType: !validateInput(saleTypeRef.current?.value || "", conditions.saleType)
    };
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }
  
  

  // Pass customer info to Customer page 
  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const saleToSave: Sale = {
        ...sale,
        dealName: nameRef.current?.value || "",
        dealStage: dealStageRef.current?.value || "",
        amount: Number(amountRef.current?.value) || 0,
        closeDate: closeDateRef.current?.value || "",
        saleType: saleTypeRef.current?.value || "",
        priority: priorityRef.current?.value || "",
        associatedWith: associatedWithRef.current?.value || "",
        saleId: sale?.saleId ?? generateUniqueID(saleCards, 100000, 999999) // Ensure saleId exists
      };

      onSaleValidated(saleToSave); // Pass sale 
    } else {
      console.log('Validation failed, check errors');
    }
    
  };

  function deleteSaleCard(){
    const id = saleToEdit ? saleToEdit.saleId : undefined;
    console.log(saleToEdit);
    console.log(saleToEdit ? saleToEdit.saleId : undefined);
    
    
    if (!id) throw new Error("Sale not found.");
    onDeleteSale(id); // Pass id for deletion
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
            ref={nameRef}
          />
          {errors.name && <div style={{ color: 'red' }}>Please enter a name</div>}
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
          {/* {errors.dealStage && <div style={{ color: 'red' }}>Please enter a valid email</div>} */}
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
          {/* {errors.closeDate && <div style={{ color: 'red' }}>Please enter a date</div>} */}
        </div>

        <div>
          <label>Sale Type</label>
          <input
            type="text"
            name="saleType"
            defaultValue={sale ? sale.saleType : ""}
            placeholder="Enter sale type"
            ref={saleTypeRef}
          />
          {errors.saleType && <div style={{ color: 'red' }}>Please enter a sale type</div>}
        </div>

        <div>
          <label>Priority</label>
          <input
            type="text"
            name="priority"
            defaultValue={sale ? sale.priority : ""}
            placeholder="Make this a dropdown"
            ref={priorityRef}
          />
          {/* {errors.priority && <div style={{ color: 'red' }}>Please enter priority</div>} */}
        </div>

        <button id='save-sale' type='submit'>Save Sale</button>
        <button id='cancel' type="button" onClick={onCancel}>Cancel</button>
        {sale && <button id='delete' type='button' onClick={deleteSaleCard}>Delete</button>}
      </div>
    </form>
  );
}
