import Popover  from "react-bootstrap/Popover"
import PopoverBody from "react-bootstrap/PopoverBody"

interface ErrorBoxProps{
    message: string
}
export default function ErrorBox(props: ErrorBoxProps): JSX.Element{
    return <Popover id="popover-positioned-bottom-start">
        <PopoverBody>
            <span>
                {props.message}
            </span>
        </PopoverBody>
    </Popover>
}