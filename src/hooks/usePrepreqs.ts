import {useState, useReducer} from "react"
import joi from "joi"
import useRequestQueue from "./useRequestQueue"
enum ActionType{
    CONCAT,
    RESET
}

interface AbstractAction{
    type: ActionType
}

interface AddAction extends AbstractAction{
    type: ActionType.CONCAT
    items: string[]
    index: number
}

interface ResetAction{
    type: ActionType.RESET
}

type Action<T extends ActionType> = T extends ActionType.CONCAT ? AddAction : ResetAction

function reducePrereqs<T extends ActionType>(state: string[][], action: Action<T>): string[][]{
    if(action.type === ActionType.CONCAT){
        const newState = [...state]
        newState[action.index] = newState[action.index].concat(action.items)
        return newState
    }else{
        return new Array<string[]>()
    }
}

interface Prereqs{
    value: string[][]
    mp: Map<string,string>
    
}

async function getPrereqs(backend: URL, target: string): Promise<string[]>{
    const res = await fetch(`${backend.toString()}content/${encodeURIComponent(target)}/prerequisites`)
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

function usePrereqs(backend: URL, target: string, depth: number): Prereqs{
    const [value, reduceValue] = useReducer(reducePrereqs,target,(target: string) => {
        const output = new Array<string[]>(depth)
        for(let i = 0;i < depth;i++){
            output[i] = []
        }
        output[depth-1].push(target)
        return output
    })
    const queue = useRequestQueue()
    for(let i = depth-1;i > 0;i--){
        for(const item of value[i]){
            queue.queueRequest(getPrereqs(backend,item).then((value: string[]) => {
                reduceValue({type: ActionType.CONCAT,items: value,index: i-1})
            }))
        }
    }
}