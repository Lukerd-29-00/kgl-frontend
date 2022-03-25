import React, {ForwardedRef, forwardRef} from "react"
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay"
import Popover  from "react-bootstrap/Popover"
import PopoverBody from "react-bootstrap/PopoverBody"

interface UriListProps extends OverlayInjectedProps{
    setTarget: (target: string) => void,
    uris: string[]
}
const UriList = forwardRef((props: UriListProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <Popover id="popover-basic" {...props} ref={ref} data-testid="uri-list-pop">
        <PopoverBody data-testid="uri-list">
            <ol>
                {props.uris.map((value,i) => {
                    return <li key={i}>
                        <span className="uri" data-testid="uri" onClick={() => props.setTarget(value)}>
                            {value}    
                        </span>
                        <br/>
                    </li>
                })}
            </ol>

        </PopoverBody>
    </Popover>
})

UriList.displayName = "UriList"
export default UriList