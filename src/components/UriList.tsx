import Popover  from "react-bootstrap/Popover"
import PopoverBody from "react-bootstrap/PopoverBody"

interface UriListProps{
    uris: string[]
}
export default function UriList(props: UriListProps): JSX.Element{
    return <Popover id="popover-basic">
        <PopoverBody data-testid="uri-list">
            {props.uris.map((value,i) => {
                return <div key={i}>
                    <span data-testid="uri">
                        {value}    
                    </span>
                </div>
                    
                
            })}
        </PopoverBody>
    </Popover>
}