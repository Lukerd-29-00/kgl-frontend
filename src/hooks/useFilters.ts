import { useReducer } from "react"
import UnionSet from "../util/UnionSet"
enum ActionType{
    ADD,
    DELETE
}

interface AbstractAction{
    type: ActionType
}

interface AddAction extends AbstractAction{
    type: ActionType.ADD
    value: string
}

interface DeleteAction extends AbstractAction{
    type: ActionType.DELETE
    value: string
}

type Action<T extends ActionType> = 
T extends ActionType.ADD ? AddAction :
DeleteAction

function filterReducer<T extends ActionType>(state: Set<string>, action: Action<T>): UnionSet<string>{
    const newState = new UnionSet<string>(state)
    switch(action.type){
    case ActionType.ADD: {
        newState.add(action.value)
        break
    }
    case ActionType.DELETE: {
        newState.delete(action.value)
        break
    }
    }
    return newState
}

interface FiltersList{
    filters: UnionSet<string>
    add: (value: string) => void
    delete: (value: string) => void
}

function init(): UnionSet<string>{
    return new UnionSet<string>()
}

export default function useFilters(): FiltersList{
    const [filters, modifyFilters] = useReducer(filterReducer,undefined,init)
    const add = (value: string) => {
        modifyFilters({type: ActionType.ADD, value})
    }
    const remove = (value: string) => {
        modifyFilters({type: ActionType.DELETE, value})
    }

    return {filters, add, delete: remove}
}