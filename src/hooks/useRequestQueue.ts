import { useState, useReducer } from "react"


interface QueueAction{
    action: () => Promise<void>
}

interface State{
    queue: Array<() => Promise<void>>
    active: Promise<void> | null
}

function QueueReducer(state: State, action: QueueAction | null): State{
    const newState: State = {active: state.active !== null ? {...state.active} : null, queue: [...state.queue]}
    if(action !== null){
        if(newState.active !== null){
            newState.queue.push(action.action)
        }else{
            newState.active = action.action()
        }
    }else if(newState.queue.length > 0){
        newState.active = (newState.queue.shift() as () => Promise<void>)()
    }else{
        newState.active = null
    }
    return newState
}

interface RequestQueue<T>{
    queueRequest: (req: Promise<T>) => void
    value: T | null
}

function init(): State{
    return {queue: new Array<() => Promise<void>>(), active: null}
}

export default function useRequestQueue<T>(): RequestQueue<T>{
    const queue = useReducer(QueueReducer,undefined,init)
    const [value, setValue] = useState<T | null>(null)
    const queueRequest = (req: Promise<T>) => {
        const queuedReq = () => {
            return req.then(ret => {
                setValue(ret)
                queue[1](null)
            })
        }
        queue[1]({action: queuedReq})
    }
    return {value, queueRequest}
}

