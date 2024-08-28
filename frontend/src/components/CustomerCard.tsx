import { Customer } from '../interfaces/customerInterface';

export default function CustomerCard({ customer }: { customer: Customer }) {
    return (
      <div>
        <div>{customer.name}</div>
        <div>{customer.email}</div>
        <div>{customer.phoneNumber}</div>
        <div>{customer.leadStatus}</div>
        <div>{customer.dateCreated}</div>
        <div>{customer.jobTitle}</div>
        <div>{customer.industry}</div>
      </div>
    );
  }