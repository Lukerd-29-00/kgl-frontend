
enum ActionType{
    ADD,
    DELETE
}

interface AddAction<T>{
    type: ActionType.ADD
    item: Promise<T>
    finish: (arg: T) => void
}

interface DeleteAction{
    type: ActionType.DELETE
    item: Promise<void>
}

type Action<T,A> = A extends ActionType.ADD ? AddAction<T> : DeleteAction

function requestsReducer<T,A>(state: Set<Promise<void>>, action: Action<T,A>): Set<Promise<void>>{
    const newState = new Set(state)
    if(action.type === ActionType.ADD){
        newState.add(action.item.then(action.finish))
    }else{
        newState.delete(action.item)
    }
    return newState
}


export default function useRequests(){
    

}