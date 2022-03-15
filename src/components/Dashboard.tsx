import React, {useEffect, useState} from "react"
import SearchBar from "./SearchBar"
import joi from "joi"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Filters from "./Filters"
import Config from "../util/interfaces/Config"
import useActiveRequests from "../hooks/useActiveRequests"
import UnionSet from "../util/UnionSet"

interface DashboardProps{
    fetcher?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
    config: Config
}

async function fetchSubjects(url: URL, fetcher: (input: RequestInfo,init?: RequestInit) => Promise<Response>): Promise<Array<string>>{
    const res = await fetcher(url.toString())
    const data: unknown = await res.json()
    let {error} = joi.array().validate(data)
    if(error === undefined){
        error = joi.array().items(joi.string().uri()).validate((data as string[]).map((value) => {
            return encodeURI(value)
        })).error
    }
    if(error === undefined){
        return (data as string[]).map((value) => {
            return (value.match(/\/([^\/]+)$/) as RegExpMatchArray)[1]
        })
    }else{
        throw Error(error.message)
    }
}

async function getSubjects(url: URL, fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>, classes?: Set<string>): Promise<string[]>{
    url = new URL(`${url.toString()}content`)
    if(classes !== undefined && Array.from(classes.values()).length > 0){
        const output = new UnionSet<string>()
        const promises = new Array<Promise<void>>()
        const setFromStorage = async (item: string) => {
            output.union(new Set<string>(JSON.parse(item)))
        }
        for(const ttlClass of classes){
            const item = window.sessionStorage.getItem(ttlClass)
            if(item !== null){
                promises.push(setFromStorage(item))
            }else{
                const newUrl = new URL(url.toString())
                newUrl.searchParams.append("allowedClasses",ttlClass)
                promises.push(fetchSubjects(newUrl,fetcher).then(value => {
                    output.union(new Set<string>(value))
                    try{
                        window.sessionStorage.setItem(ttlClass,JSON.stringify(value))
                    }catch{
                        window.sessionStorage.clear()
                    }
                }))
            }
        }
        await Promise.all(promises)
        return Array.from(output)
    }else{
        const item = window.sessionStorage.getItem("")
        if(item !== null){
            return JSON.parse(item)
        }else{
            const output = await fetchSubjects(url,fetcher)
            try{
                window.sessionStorage.setItem("",JSON.stringify(output))
            }catch{
                window.sessionStorage.clear()
            }
            return output
        }
    }   
}

export default function Dashboard(props: DashboardProps): JSX.Element{
    const fetcher = props.fetcher || fetch
    const [subjects, setSubjects] = useState<null | string[]>(null)
    const [target, setTarget] = useState<string | null>(null)
    const queue = useActiveRequests<string[]>()
    useEffect(() => {
        queue.queueRequest(getSubjects(props.config.backend,fetcher))
    },[])
    useEffect(() => {
        setSubjects(queue.value)
    },[queue.value])
    useEffect(() => {
        console.log(target) //This is here for the linter's sake; I haven't implemented target yet.
    },[target])
    const handleFilterChange = (classes: Set<string>) => {
        queue.queueRequest(getSubjects(props.config.backend,fetcher,classes))
    }
    if(subjects){
        return <Container>
            <Row>
                <Col>
                    <Filters filters={props.config.filters} fetchCallback={handleFilterChange}/>
                </Col>
                <Col>
                    <SearchBar subjects={subjects} selectHandler={setTarget}/>
                </Col>
            </Row>
            <Row>
            </Row>
        </Container>
    }else{
        return <div>
            loading...
        </div>
    }
    



}