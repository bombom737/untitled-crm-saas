import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { Customer, Sales, etc... } from '../interfaces/interfaces';

export default function Table({ data, removeFn }: { data: Array<any>, removeFn: (item: any | undefined) => void }) {
    // Extract the keys from the first object in the data array to create columns dynamically
    const firstItemKeys = data.length > 0 ? Object.keys(data[0]) : [];
    
    // Exclude customerId and _id
    const filteredKeys = firstItemKeys.filter(key => key !== 'customerId' && key !== '_id');
    
    // Utility function to format the header, adding spaces before capitalized letters and capitalizing the first letter
    function formatHeader(string: string) {
        return string
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
    }

    // Function to render the remove button
    const renderRemoveButton = (rowData: any) => {
        return (
            <button onClick={() => removeFn(rowData)} className="p-button p-button-danger">
                Remove
            </button>
        );
    };

    return (
        <div className="card">
            <DataTable value={data} scrollable scrollHeight="400px" className="mt-4">
                {filteredKeys.map((key) => (
                    <Column key={key} field={key} header={formatHeader(key)} style={{ minWidth: '150px' }} />
                ))}
                <Column body={renderRemoveButton} style={{ minWidth: '150px' }} />
            </DataTable>
        </div>
    );
}

