import SlidingPane from "react-sliding-pane"
import "react-sliding-pane/dist/react-sliding-pane.css"


interface Props{
    visible: boolean,
    data?: any,
    closePane: () => void
}
export default function EditPane({visible, data, closePane}: Props) {
    

    
  return (
    <SlidingPane 
    className='edit-pane' 
    isOpen={visible}
    title="Edit Customer"
    width={window.innerWidth < 600 ? "100%" : "500px"}
    onRequestClose={closePane}
    >
      <div>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </SlidingPane>
  )
}