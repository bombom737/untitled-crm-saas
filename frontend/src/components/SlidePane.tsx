import SlidingPane from "react-sliding-pane"
import "react-sliding-pane/dist/react-sliding-pane.css"


interface Props{
    visible: boolean,
    display: any,
    title: string,
    closePane: () => void
}

export default function SlidePane({visible, title, display, closePane}: Props) {
  
  return (
    <SlidingPane 
      className='edit-pane' 
      isOpen={visible}
      title={title ? title : "Title"}
      width={window.innerWidth < 600 ? "100%" : "500px"}
      onRequestClose={closePane}
    >
      <div>
        <div> 
          {display}
        </div>
      </div>
    </SlidingPane>
  )
}