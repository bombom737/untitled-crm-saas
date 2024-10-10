import { Sale, SaleCard } from "../../interfaces/interfaces"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    "><p className="
      my-auto
      h-[90%]
      w-full
      overflow-x-hidden
      overflow-y-auto
      whitespace-pre-wrap
    ">{saleCard.sale.dealName}</p>
    </div>
  )
}

export default SaleCardComponent