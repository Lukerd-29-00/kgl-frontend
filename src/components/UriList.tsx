import Popover  from "react-bootstrap/Popover"
import PopoverBody from "react-bootstrap/PopoverBody"

interface UriListProps{
    uris: string[]
}
export default function UriList(props: UriListProps): JSX.Element{
    return <Popover id="popover-positioned-bottom-start">
        <PopoverBody>
            {props.uris.map((value,i) => {
                return <div key={i}>
                    <span>
                        {value}    
                    </span>
                </div>
                    
                
            })}
        </PopoverBody>
    </Popover>
}