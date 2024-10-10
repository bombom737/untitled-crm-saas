import React, { useState, useEffect, useRef } from 'react';
import { Column, Sale, SaleCard } from '../interfaces/interfaces';
import { generateUniqueID } from '../services/helpers';
import './SaleForm.css';

interface Props {
  saleCards: Array<SaleCard>;  
  columns: Array<Column>;
  saleToEdit?: Sale; 
  onSaleValidated: (sale: Sale) => void;
  onCancel: () => void;
  onDeleteSale: (id: number) => void;
}

export default function SaleForm({ saleCards, columns, saleToEdit, onSaleValidated, onCancel, onDeleteSale } : Props) {
  
  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    saleType: false,
  });

  const dealNameRef = useRef<HTMLInputElement>(null);
  const dealStageRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const closeDateRef = useRef<HTMLInputElement>(null);
  const saleTypeRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLInputElement>(null);
  const associatedWithRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    if (saleToEdit) {
      if (dealNameRef.current) dealNameRef.current.value = saleToEdit.dealName || "";
      if (dealStageRef.current) dealStageRef.current.value = saleToEdit.dealStage || columns[0]?.title || "";
      if (amountRef.current) amountRef.current.value = saleToEdit.amount?.toString() || "0";
      if (closeDateRef.current) closeDateRef.current.value = saleToEdit.closeDate || "";
      if (saleTypeRef.current) saleTypeRef.current.value = saleToEdit.saleType || "";
      if (priorityRef.current) priorityRef.current.value = saleToEdit.priority || "";
      if (associatedWithRef.current) associatedWithRef.current.value = saleToEdit.associatedWith || "";
    }
  }, [saleToEdit, columns]);
  
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
      name: !validateInput(dealNameRef.current?.value || "", conditions.name),
      amount: !validateInput(Number(amountRef.current?.value) || 0, conditions.amount),
      saleType: !validateInput(saleTypeRef.current?.value || "", conditions.saleType),
    };
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }
  
  

  // Pass customer info to Customer page 
  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const saleToSave: Sale = {
        dealName: dealNameRef.current?.value || "",
        dealStage: dealStageRef.current?.value || columns[0]?.title || "",
        amount: Number(amountRef.current?.value) || 0,
        closeDate: closeDateRef.current?.value || "",
        saleType: saleTypeRef.current?.value || "",
        priority: priorityRef.current?.value || "",
        associatedWith: associatedWithRef.current?.value || "",
        saleId: saleToEdit?.saleId || generateUniqueID(saleCards, 100000, 999999),
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
            name="dealName"
            ref={dealNameRef}
          />
          {errors.name && <div style={{ color: 'red' }}>Please enter a name</div>}
        </div>

        <div>
          <label>Deal Stage</label>
          <select
            name="dealStage"
            ref={dealStageRef}
          >
          {columns.map((column) => (
            <option key={column.id} value={column.title}>
              {column.title}
            </option>
          ))}
          </select>
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            ref={amountRef}
          />
          {errors.amount && <div style={{ color: 'red' }}>Please enter a valid amount</div>}
        </div>

        <div>
          <label>Close Date</label>
          <input
            type="date"
            name="closeDate"
            ref={closeDateRef}
          />
          {/* {errors.closeDate && <div style={{ color: 'red' }}>Please enter a date</div>} */}
        </div>

        <div>
          <label>Sale Type</label>
          <input
            type="text"
            name="saleType"
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
            placeholder="Make this a dropdown"
            ref={priorityRef}
          />
          {/* {errors.priority && <div style={{ color: 'red' }}>Please enter priority</div>} */}
        </div>

        <button id='save-sale' type='submit'>Save Sale</button>
        <button id='cancel' type="button" onClick={onCancel}>Cancel</button>
        {saleToEdit?.dealName !== "" && <button id='delete' type='button' onClick={deleteSaleCard}>Delete</button>}
      </div>
    </form>
  );
}
