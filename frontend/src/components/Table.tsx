import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Table({ data, removeFn }: { data: Array<any>, removeFn: (item: any | undefined) => void }) {
  const firstItemKeys = data.length > 0 ? Object.keys(data[0]) : [];
  const filteredKeys = firstItemKeys.filter(key => key !== 'customerId' && key !== '_id');
  
  function formatHeader(string: string) {
      return string
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };
  
  const renderRemoveButton = (rowData: any) => (
    <button onClick={() => removeFn(rowData)} className="p-button p-button-danger">
      Remove
    </button>
  );

  return (
    <div className="card">
      <DataTable value={data} scrollable scrollHeight="400px">
        {filteredKeys.map((key) => (
          <Column key={key} field={key} header={formatHeader(key)} />
        ))}
        <Column body={renderRemoveButton} />
      </DataTable>
    </div>
  );
}



