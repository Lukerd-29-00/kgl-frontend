
import React, { ChangeEvent, useEffect, useState, useRef} from "react"
import searchSubjects from "../util/searchSubjects"
import Overlay from "react-bootstrap/Overlay"
import UriList from "./UriList"
import ErrorBox from "./ErrorBox"
interface SearchBarProps{
    //selectHandler: (str: string) => void //WIP
    subjects: string[]
}

export default function SearchBar(props: SearchBarProps): JSX.Element{
    const [displayedSubjects, setDisplayedSubjects] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searchMatch, setSearchMatch] = useState<RegExp | null>(null)
    const [show, setShow] = useState(false)
    const target = useRef(null)
    const container = useRef(null)
    const validSearches = /^[^\*\[\]\(\)\^\$\?\\\+\{\}\!\|]*$/
    const invalidSearchChars = /([\*\[\]\(\)\^\$\?\\\+\{\}\!\|])/
    useEffect(() => {
        if(props.subjects !== null && searchMatch !== null){
            const matches = searchSubjects([...props.subjects],searchMatch)
            if(matches.length > 0){
                setDisplayedSubjects(matches)
                setError(null)
            }else{
                setError("no matches")
            }
        }else if(props.subjects !== null){
            setDisplayedSubjects([...props.subjects])
            setError(null)
        }else{
            setDisplayedSubjects([])
        }
    },[props.subjects,searchMatch])
    return <div ref={container}>
        <input data-testid="search-bar" className="search-bar" onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            if(e.target.value.match(validSearches)){
                setError(null)
                setSearchMatch(new RegExp(e.target.value))
            }else{
                const chr = e.target.value.match(invalidSearchChars)
                setError(`'${(chr as RegExpMatchArray)[0]}' not allowed!`)
            }
        }
        } ref={target}
        onClick={() => {
            setShow(true)
        }} placeholder="enter subject IRI">
        </input>
        <Overlay container={container.current} transition={true} placement={"bottom-start"} target={target.current} show={show} rootClose={true} onHide={() => {
            setShow(false)
        }}>
            <div>
                {error === null ? <UriList uris={displayedSubjects}/> : <ErrorBox message={error}/>}
            </div>
        </Overlay>
    </div>
}