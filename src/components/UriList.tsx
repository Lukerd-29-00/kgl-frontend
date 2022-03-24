import React, {ForwardedRef, forwardRef} from "react"
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay"
import Popover  from "react-bootstrap/Popover"
import PopoverBody from "react-bootstrap/PopoverBody"

interface UriListProps extends OverlayInjectedProps{
    uris: string[]
}
const UriList = forwardRef((props: UriListProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <Popover id="popover-basic" {...props} ref={ref} data-testid="uri-list-pop">
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
})

UriList.displayName = "UriList"
export default UriList