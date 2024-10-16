import React, { useState, useEffect, useRef } from 'react';
import { Column, Sale, SaleCard } from '../interfaces/interfaces';
import { generateUniqueID } from '../services/helpers';
import './SaleForm.css';
import CircleIcon from '../icons/CircleIcon';

interface Props {
  saleCards: Array<SaleCard>;  
  columns: Array<Column>;
  saleToEdit?: Sale; 
  onSaleValidated: (sale: Sale) => void;
  onCancel: () => void;
  onDeleteSale: (id: number) => void;
}

export default function SaleForm({ saleCards, columns, saleToEdit, onSaleValidated, onCancel, onDeleteSale }: Props) {
  
  const [errors, setErrors] = useState({
    name: false,
    amount: false,
  });
  
  const dealNameRef = useRef<HTMLInputElement>(null);
  const dealStageRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const closeDateRef = useRef<HTMLInputElement>(null);
  const saleTypeRef = useRef<HTMLInputElement>(null);
  const associatedWithRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<any>(null);
  
  // Define priority options
  const priorityOptions = [
    { value: 'No Priority', label: 'No Priority', icon: null },
    { value: 'Low Priority', label: 'Low', icon: <CircleIcon color='#37d60f' /> },
    { value: 'Medium Priority', label: 'Medium', icon: <CircleIcon color='#e87b07' /> },
    { value: 'High Priority', label: 'High', icon: <CircleIcon color='#d90804' /> }
  ];

  // Effect to load `saleToEdit` data and set selectedPriority if saleToEdit exists
  useEffect(() => {
    if (saleToEdit) {
      if (dealNameRef.current) dealNameRef.current.value = saleToEdit.dealName || "";
      if (dealStageRef.current) dealStageRef.current.value = saleToEdit.dealStage || columns[0]?.title || "";
      if (amountRef.current) amountRef.current.value = saleToEdit.amount?.toString() || "0";
      if (closeDateRef.current) closeDateRef.current.value = saleToEdit.closeDate || "";
      if (saleTypeRef.current) saleTypeRef.current.value = saleToEdit.saleType || "";
      if (associatedWithRef.current) associatedWithRef.current.value = saleToEdit.associatedWith || "";
      if (priorityRef) priorityRef.current.value = saleToEdit.priority || "No Priority";
    }
  }, [saleToEdit, columns]);  // Depend on saleToEdit and columns

  // Validation and form submission logic
  function handleValidation() {
    const newErrors = {
      name: !dealNameRef.current?.value,
      amount: !amountRef.current?.value || Number(amountRef.current?.value) <= 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  }

  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const saleToSave: Sale = {
        dealName: dealNameRef.current?.value || "",
        dealStage: dealStageRef.current?.value || columns[0]?.title || "",
        amount: Number(amountRef.current?.value) || 0,
        closeDate: closeDateRef.current?.value || "",
        saleType: saleTypeRef.current?.value || "",
        priority: priorityRef.current?.value || "No Priority",
        associatedWith: associatedWithRef.current?.value || "",
        saleId: saleToEdit?.saleId || generateUniqueID(saleCards, 100000, 999999),
      };

      onSaleValidated(saleToSave);
    } else {
      console.log('Validation failed, check errors');
    }
  }

  function deleteSaleCard(){
    const id = saleToEdit ? saleToEdit.saleId : undefined;
    if (!id) throw new Error("Sale not found.");
    onDeleteSale(id);
  }

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
        </div>
        <div>
          <label>Sale Type</label>
          <input
            type="text"
            name="saleType"
            placeholder="Enter sale type"
            ref={saleTypeRef}
          />
        </div>
        <div>
          <label>Priority</label>
          <select
          ref={priorityRef}
          defaultValue={saleToEdit?.priority || priorityOptions[0].value}>
            {priorityOptions.map((priority, idx) => (
            <option key={idx} value={priority.value}>
              {priority.value}
            </option>
          ))}
          </select>

        </div>
        <div className="buttons">
          <button id='save-sale' type='submit'>Save Sale</button>
          <button id='cancel' type="button" onClick={onCancel}>Cancel</button>
          {saleToEdit?.dealName !== "" && <button id='delete' type='button' onClick={deleteSaleCard}>Delete</button>}
        </div>
      </div>
    </form>
  );
}
