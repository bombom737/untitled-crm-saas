import { Sale, SaleCard } from "../../interfaces/interfaces"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CircleIcon from "../../icons/CircleIcon";

interface Props {
    saleCard: SaleCard;
    deleteSaleCard: (id: number) => void;
    updateSaleCard: (id: number, content: Sale) => void;
    loadSale: (sale: Sale) => void;
}
function SaleCardComponent({ saleCard, loadSale  }: Props) {

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
  useSortable({
    id: saleCard.id as number,
    data: {
      type: 'Sale Card',
      saleCard,
    }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function openEditPane() {
    loadSale(saleCard.sale); 
  }

  if (isDragging) {
    return (
      <div
      ref={setNodeRef}
      style={style}
      className="
          bg-mainBackgroundColor
          p-2.5
          h-[100px]
          min-h-[100px]
          items-center
          flex
          text-left
          rounded-xl
          border-2
          border-rose-500
          cursor-grab
          relative
          sale
          opacity-30
      " 
      />
    )
  }
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {openEditPane()}}
      className="
        bg-mainBackgroundColor
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-rose-500
        cursor-grab
        relative
    "><div>
        <div className="
          my-auto
          h-[90%]
          w-full
          overflow-x-hidden
          overflow-y-auto
          whitespace-pre-wrap
        ">
          <p>{saleCard.sale.dealName}</p>
          <br />
          {saleCard.sale.priority === "Low Priority" ? 
            <div className="flex"><CircleIcon color='#37d60f'/> Low Priority </div> 
            : saleCard.sale.priority === "Medium Priority" ? 
            <div className="flex"><CircleIcon color='#e87b07' /> Medium Priority </div> 
            : saleCard.sale.priority === "High Priority" ? 
            <div className="flex"><CircleIcon color='#d90804' /> High Priority </div> 
            : ""}
          <br />
          <p>{saleCard.sale.amount}</p>
      </div>
    </div>
      
    </div>
  )
}

export default SaleCardComponent