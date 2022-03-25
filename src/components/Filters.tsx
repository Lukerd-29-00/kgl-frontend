import useFilters from "../hooks/useFilters"
import React, { useEffect } from "react"
import UnionSet from "../util/UnionSet"
interface FiltersProps{
    filters: Map<string,Set<string>>,
    fetchCallback: (values: Set<string>) => void,
}

export default function Filters(props: FiltersProps): JSX.Element{
    const filters = useFilters()
    useEffect(() => {
        //fetch the subjects according to the selected filters whenever the selected filters changes.
        const classes = new UnionSet<string>()
        for(const filter of filters.filters){
            const filterClasses = props.filters.get(filter) as Set<string>
            classes.union(filterClasses)
        }
        props.fetchCallback(classes)
    },[filters.filters])
    return <>
        {Array.from<string>(props.filters.keys()).map((value: string, i: number) => {
            return <button className={filters.filters.has(value) ? "filter-selected" : "filter-unselected"} key={i} onClick={() => {
                if(filters.filters.has(value)){
                    filters.delete(value)
                }else{
                    filters.add(value)
                }
            }}>
                {value}
            </button>
        })}
    </>
}