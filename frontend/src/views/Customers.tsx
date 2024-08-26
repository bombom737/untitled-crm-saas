import { useState, useRef } from 'react';

//PROTOTYPE Will have to refine and refactor this code

interface LeadStatus{
    new: boolean;
    open: boolean;
    inProgress: boolean;
    openDeal: boolean;
    unqualified: boolean;
    attemptedToContact: boolean;
    connected: boolean;
}

interface Customer {
    name: string;
    email: string;
    phoneNumber: string;
    leadStatus: string;
    dateCreated: "Creation date"; //Date.now() or something similar
    jobTitle: string;
    industry: string;
    
}

export default function Customers() {

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);

  let customerArray:Array<Customer> = []

  const [leadStatus, setLeadStatus] = useState<LeadStatus>({
    new: false,
    open: false,
    inProgress: false,
    openDeal: false,
    unqualified: false,
    attemptedToContact: false,
    connected: false,
  });

  function handleCheckboxChange(status: keyof LeadStatus) {
    // Reset all status values to false, then set the selected status to true
    setLeadStatus({
      new: false,
      open: false,
      inProgress: false,
      openDeal: false,
      unqualified: false,
      attemptedToContact: false,
      connected: false,
      [status]: true, // Update the selected status
    });
    console.log(status)
  };
  
  function createCustomer(e:any){
    
    e.preventDefault()
    const customer: Customer ={
      name: e.target.value,
      email: e.target.value,
      phoneNumber: e.target.value,
      leadStatus: leadStatus.new === true ? 'New' : leadStatus.open === true ? 'Open' : leadStatus.inProgress === true ? 'In Progress' : leadStatus.openDeal === true ? 'Open Deal' : leadStatus.unqualified === true ? 'Unqualified' : leadStatus.attemptedToContact === true ? 'Attempted To Contact' : 'Connected', //find better way
      dateCreated: "Creation date", //Date.now() or something similar
      jobTitle: e.target.value,
      industry: e.target.value,
    }
    alert('Successfully created customer! ' + customer)
    console.log(customerArray)
  }
  return (
    <div>
      <div>Customers</div>
      <form>
        <div className="createCustomer">
          <input type="text" placeholder="Enter customer name" ref={nameRef}/>
          <input type="text" placeholder="Enter customer email" ref={emailRef}/>
          <input type="text" placeholder="Enter customer phone number" ref={phoneNumberRef}/>
          <label>Lead Status</label>
          <div>
            {Object.keys(leadStatus).map((key) => (
              <div key={key}>
                <input
                  type="checkbox"
                  checked={leadStatus[key as keyof LeadStatus]}
                  onChange={() => handleCheckboxChange(key as keyof LeadStatus)}
                />
                <label>{key}</label>
              </div>
            ))}
          </div>
          <input type="text" placeholder="Enter job title" ref={jobTitleRef}/>
          <input type="text" placeholder="Enter industry" ref={industryRef}/>
          <button onClick={createCustomer}>Create Customer</button>
        </div>
      </form>
    </div>
  )
}
