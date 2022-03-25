import React, {useEffect, useState} from "react"
import SearchBar from "./SearchBar"
import joi from "joi"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Filters from "./Filters"
import useActiveRequests from "../hooks/useRequestQueue"
import UnionSet from "../util/UnionSet"
import Tree from "./Tree"

interface DashboardProps{
    backend: URL,
    prefixes: Map<string,string>,
    filters: Map<string,Set<string>>,
}

async function fetchSubjects(url: URL): Promise<Array<string>>{
    const res = await fetch(url.toString())
    const data: unknown = await res.json()
    let {error} = joi.array().validate(data)
    if(error === undefined){
        error = joi.array().items(joi.string().uri()).validate((data as string[]).map((value) => {
            return encodeURI(value)
        })).error
    }
    if(error === undefined){
        return data as string[]
    }else{
        throw Error(error.message)
    }
}

async function getSubjects(url: URL, classes?: Set<string>): Promise<string[]>{
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
                promises.push(fetchSubjects(newUrl).then(value => {
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
            const output = await fetchSubjects(url)
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
    const [target, setTarget] = useState<string | null>(null)
    const subjectsQueue = useActiveRequests<string[]>()
    useEffect(() => {
        subjectsQueue.queueRequest(getSubjects(props.backend))
    },[])
    const handleFilterChange = (classes: Set<string>) => {
        subjectsQueue.queueRequest(getSubjects(props.backend,classes))
    }
    if(subjectsQueue.value){
        return <Container>
            <Row>
                <Col>
                    <Filters filters={props.filters} fetchCallback={handleFilterChange}/>
                </Col>
                <Col>
                    <SearchBar subjects={subjectsQueue.value} loading={!subjectsQueue.empty} setTarget={setTarget}/>
                </Col>
            </Row>
            <Row>
                <Tree target={target} depth={3}/>
            </Row>
        </Container>
    }else{
        return <div>
            loading...
        </div>
    }
}