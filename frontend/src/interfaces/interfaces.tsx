export interface Customer {
    name: string;
    email: string;
    phoneNumber: string;
    leadStatus: string;
    dateCreated: string;
    jobTitle: string;
    industry: string;
    customerId: number | undefined;
}

export interface Sale {
    buyerName: string;
    dealStage: string;
    amount: string;
    closeDate: string;
    saleType: string;
    priority: string;
    associatedWith: string;
    saleId: number | undefined;
}