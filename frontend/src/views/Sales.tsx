import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import SlidePane from "../components/SlidePane";
import SaleForm from "../components/SaleForm";
import { Column, Sale, SaleCard } from "../interfaces/interfaces";
import { generateUniqueID } from "../services/helpers";
import { addToDatabase, getDatabaseModel, removeFromDatabase, updateDatabase } from "../services/db-requests";

export default function Sales() {
  
  const [columns, setColumns] = useState<Column[]>([])
  
  const [saleCards, setSaleCards] = useState<Array<SaleCard>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedColumns = await getDatabaseModel('columnModel');

        const fetchedsaleCards = await getDatabaseModel('saleModel')

        let newColumns: Array<Column> = []
        
        let newSaleCards: Array<SaleCard> = []

        if (fetchedColumns && fetchedsaleCards) { 

          const fetchedColumnsArray: Array<Column> = fetchedColumns.columns
          const fetchedsaleCardsArray: Array<SaleCard> = fetchedsaleCards.saleCards
                      
          fetchedColumnsArray.map((column) => {
              const newColumn = {id: column.id, title: column.title}
              newColumns.push(newColumn);
          });

           fetchedsaleCardsArray.map((saleCard) => {
             const newSaleCard = {id: saleCard.id, columnId: saleCard.columnId, sale: saleCard.sale}
             newSaleCards.push(newSaleCard);
           });

          setColumns(newColumns);
          setSaleCards(newSaleCards);
          
         } else {
            console.error('No data returned');
         }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
  }, []);

  const [slidingPane, setSlidingPane] = useState<{visible: boolean, data?: Sale}>({visible: false});

  const [currentSale, setCurrentSale] = useState<Sale>();

  function createSaleCard(columnId: number, sale: Sale) {
    
    const newSaleCard: SaleCard = {
      id: generateUniqueID(saleCards, 100000, 999999),
      columnId,
      sale: sale
    }

    setSaleCards([...saleCards, newSaleCard])
    addToDatabase('saleModel', newSaleCard)
  }
  
  function deleteSaleCard(id: number) {
    
    const saleToDelete = saleCards.find((saleCard) => saleCard.sale.saleId === id)

    if (!saleToDelete) {
      throw new Error("Sale not found.");
    }

    const newSaleCard = saleCards.filter((sale) => sale.id !== saleToDelete.id)
    setSaleCards(newSaleCard)
    closePane();

    removeFromDatabase('saleModel', saleToDelete)
  }
  
  function updateSaleCard(id: number, saleToUpdate: Sale) {
    
    const newColumn = columns.find((col) => col.title === saleToUpdate.dealStage);
    
    if (!newColumn) throw new Error("Column not found.")
    
      const newSaleCards = saleCards.map((saleCard) => {
      if (saleCard.id !== id) return saleCard;

      return { ...saleCard, columnId: newColumn.id, sale: saleToUpdate };
    });
    setSaleCards(newSaleCards);

    updateDatabase('saleModel', {...saleCards.find((saleCard) => saleCard.id === id), columnId: newColumn.id, sale: saleToUpdate })
  }
  

  function createNewColumn() {
    
    const id = generateUniqueID(columns, 100000, 999999)
    const newColumn: Column = {
      id: id,
      title: `Column ${columns.length + 1}`
    }

    setColumns([...columns, newColumn])

    addToDatabase('columnModel', newColumn);
  }

  function deleteColumn(id: number) {
    
    if(columns.length <= 1) {
      console.log("Cannot delete last column");
      return
    }

    const filteredColumn = columns.filter((col) => col.id !== id)
    setColumns(filteredColumn)

    const newSaleCard = saleCards.filter(sale => sale.columnId !== id)

    setSaleCards(newSaleCard)

    removeFromDatabase('columnModel', columns.find((col) => col.id = id));
  }
  
  function updateColumn(id: number, title: string) {
    
    const oldTitle = columns.find((column) => column.id === id)?.title

    if(!oldTitle) return

    const newColumns = columns.map(col => {
      if (col.id  !== id) return col
      return {...col, title}
    })
    setColumns(newColumns);
    
    updateDatabase('columnModel', {id: id, title: title})
    // Persist change to Deal Stages
    saleCards.map((saleCard) => {
      if (saleCard.sale.dealStage === oldTitle) {
        saleCard.sale.dealStage = title
        updateDatabase('saleModel', {...saleCard, sale: {...saleCard.sale, dealStage: title}})
      }
    })


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