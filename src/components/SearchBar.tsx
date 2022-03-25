
import React, { ChangeEvent, useEffect, useState, useRef} from "react"
import searchSubjects from "../util/searchSubjects"
import Overlay from "react-bootstrap/Overlay"
import UriList from "./UriList"
import ErrorBox from "./ErrorBox"
interface SearchBarProps{
    setTarget: (target: string) => void
    subjects: string[]
    loading: boolean
}

export default function SearchBar(props: SearchBarProps): JSX.Element{
    const [displayedSubjects, setDisplayedSubjects] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searchMatch, setSearchMatch] = useState<RegExp>(() => new RegExp(""))
    const [show, setShow] = useState(false)
    const target = useRef(null)
    const container = useRef(null)
    const invalidSearchChars = /([\*\[\]\(\)\^\$\?\\\+\{\}\!\|])/
    useEffect(() => {
        const matches = searchSubjects([...props.subjects],searchMatch)
        if(matches.length > 0){
            setDisplayedSubjects(matches)
            setError(null)
        }else{
            setError("no matches") //todo: configurable error messages (because this is going to be used in several languages)
        }
    },[props.subjects,searchMatch])
    return <div ref={container}>
        <input data-testid="search-bar" className="search-bar" onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            setSearchMatch(new RegExp(e.target.value.replace(invalidSearchChars,"\\$&")))
        }
        } ref={target}
        onClick={() => {
            setShow(true)
        }} placeholder="search subjects">
        </input>
        <Overlay placement={"bottom-start"} target={target.current} show={show} rootClose={true} onHide={() => {
            setShow(false)
        }}>
            {innerProps => (
                <div>
                    {props.loading ? "loading..." : error === null ? <UriList uris={displayedSubjects} setTarget={props.setTarget} {...innerProps}/> : <ErrorBox message={error}/>}
                </div>)}
        </Overlay>
    </div>
}