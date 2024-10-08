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
    dealName: string;
    dealStage: string;
    amount: number;
    closeDate: string;
    saleType: string;
    priority: string;
    associatedWith: string;
    saleId: number | undefined;
}

export type Column = {
    id: number | undefined;
    title: string;
}

export type SaleCard = {
    id: number | undefined;
    columnId: number | undefined;
    sale: Sale;
}