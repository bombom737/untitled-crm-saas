import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Table({ data, editFn, removeFn }: { data: Array<any>, editFn: (item: any | undefined) => void , removeFn: (item: any | undefined) => void }) {
  const firstItemKeys = data.length > 0 ? Object.keys(data[0]) : [];
  const filteredKeys = firstItemKeys.filter(key => key !== 'customerId' && key !== '_id' && key !== 'owningUser' && key !== '__v');
  
  function formatHeader(string: string) {
      return string
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };
  
  const renderRemoveButton = (rowData: any) => (
    <button onClick={() => removeFn(rowData)}>
      Remove
    </button>
  );

  const renderEditButton = (rowData:any) => (
    <button onClick={() => editFn(rowData)}>
      Edit
      </button>
  )

  return (
    <div className="card">
      <DataTable value={data} scrollable scrollHeight="400px">
        {filteredKeys.map((key) => (
          <Column key={key} field={key} header={formatHeader(key) + `There is a bug where headers aren't displayed properly`} />
        ))}
        <Column body={renderRemoveButton} />
        <Column body={renderEditButton}/>
      </DataTable>
    </div>
  );
}



