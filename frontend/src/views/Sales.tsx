import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import SlidePane from "../components/SlidePane";
import SaleForm from "../components/SaleForm";
import { Column, Sale, SaleCard } from "../interfaces/interfaces";
import { generateUniqueID } from "../services/helpers";

export default function Sales() {
  
  const [columns, setColumns] = useState<Column[]>([{
    id: 696969,
    title: "Appointment scheduled"
  },
  {
    id: 636969,
    title: "Uncover challenges"
  },
  {
    id: 696569,
    title: "Identify & Present Solutions"
  },
  {
    id: 616969,
    title: "Quote Received"
  },
  {
    id: 698969,
    title: "Closed Won"
  },
  {
    id: 696909,
    title: "Expand"
  },
  {
    id: 696901,
    title: "Closed Lost"
  }])

  const [sampleSale1] = useState<Sale>({
    dealName: "Woah",
    dealStage: "Appointment scheduled",
    amount: 40404,
    closeDate: "18/08/2025",
    saleType: "Test sale",
    priority: "No Priority",
    associatedWith: "",
    saleId: 135512,
  });

  const [sampleSale2] = useState<Sale>({
    dealName: "Woah",
    dealStage: "Uncover challenges",
    amount: 40404,
    closeDate: "18/08/2025",
    saleType: "Test sale",
    priority: "No Priority",
    associatedWith: "",
    saleId: 939234,
  });

  const [saleCards, setSaleCards] = useState<Array<SaleCard>>([
    { 
    id: 123456,
    columnId: 696969,
    sale: sampleSale1
    },
    { 
      id: 123455,
      columnId: 636969,
      sale: sampleSale2
    },
  ]);
 
  const [slidingPane, setSlidingPane] = useState<{visible: boolean, data?: Sale}>({visible: false});

  const [currentSale, setCurrentSale] = useState<Sale>();

  function createSaleCard(columnId: number, sale: Sale) {
    const newSaleCard: SaleCard = {
      id: generateUniqueID(saleCards, 100000, 999999),
      columnId,
      sale: sale
    }
    setSaleCards([...saleCards, newSaleCard])
    console.log(`Created new sale ${JSON.stringify(newSaleCard, null, 2)}`);
    
  }
  
  function deleteSaleCard(id: number) {
    
    const saleToDelete = saleCards.find((saleCard) => saleCard.sale.saleId === id)
    console.log(saleToDelete);

    if (!saleToDelete) {
      throw new Error("Sale not found.");
    }

    const newSaleCard = saleCards.filter((sale) => sale.id !== saleToDelete.id)
    setSaleCards(newSaleCard)
    closePane();
  }
  
  function updateSaleCard(id: number, saleToUpdate: Sale) {
    
    const newColumn = columns.find((col) => col.title === saleToUpdate.dealStage);
    
    if (!newColumn) throw new Error("Column not found.")
    
      const newSaleCards = saleCards.map((saleCard) => {
      if (saleCard.id !== id) return saleCard;

      return { ...saleCard, columnId: newColumn.id, sale: saleToUpdate };
    });
    setSaleCards(newSaleCards);
  }
  

  function createNewColumn() {
    const id = generateUniqueID(columns, 100000, 999999)
    const newColumn: Column = {
      id: id,
      title: `Column ${columns.length + 1}`
    }

    setColumns([...columns, newColumn])
  }

  function deleteColumn(id: number) {
    const filteredColumn = columns.filter((col) => col.id !== id)
    setColumns(filteredColumn)

    const newSaleCard = saleCards.filter(sale => sale.columnId !== id)

    setSaleCards(newSaleCard)
  }
  
  function updateColumn(id: number, title: string) {
    const newColumns = columns.map(col => {
      if (col.id  !== id) return col
      return {...col, title}
    })
    setColumns(newColumns);
  }
  
  function openPane() {
    setSlidingPane({visible: true });
  };
  
  function closePane() {
    setSlidingPane( {visible: false });
  };

  function loadSale(sale: Sale) {
    setCurrentSale(sale);
    setSlidingPane({visible: true});
  };

 function saveSale(saleToSave: Sale) {
  const column = columns.find((col) => col.title === saleToSave.dealStage);
  if (!column) {
    console.error(`Column not found. Column searched: ${saleToSave.dealStage || "Empty string"}`);
    return
  }

  const existingSale = saleCards.find((sale) => sale.sale.saleId === saleToSave.saleId)
  if (existingSale){
    updateSaleCard(existingSale.id as number, saleToSave);
  } else {
    createSaleCard(column?.id || 616969, saleToSave)
  }

  closePane()
  }

  function createSale(){
    setCurrentSale({
      dealName: "",
      dealStage: columns[0].title,
      amount: 0,
      closeDate: "",
      saleType: "",
      priority: "No Priority",
      associatedWith: "",
      saleId: generateUniqueID(saleCards, 100000, 999999),
    });
    openPane()
  }

  return (
    <div>
      <KanbanBoard 
        columns={columns} 
        saleCards={saleCards} 
        loadSale={loadSale}
        updateSaleCard={updateSaleCard}
        deleteSaleCard={deleteSaleCard}
        createNewColumn={createNewColumn}
        updateColumn={updateColumn}
        deleteColumn={deleteColumn}
        setColumns={setColumns}
        setSaleCards={setSaleCards}
        />
      <button onClick={createSale}>Create Sale</button>
      <div className="edit-pane">
          <SlidePane
          visible={slidingPane.visible}
          title={""}
          closePane={closePane}
          display={<SaleForm 
            saleCards={saleCards}   
            columns={columns}     
            saleToEdit={currentSale} 
            onSaleValidated={(sale) => saveSale(sale)} 
            onCancel={closePane}
            onDeleteSale={(id) => deleteSaleCard(id)}
            />}
          ></SlidePane>
        </div>
    </div>
  )
}
