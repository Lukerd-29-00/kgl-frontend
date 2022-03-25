import React, {useState, useRef, useEffect} from "react"
import DragRange from "react-drag-range"
import NodeBox from "./NodeBox"
import joi from "joi"
import "./Tree.css"

interface TreeProps{
    target: string | null
    depth: number
    backend: URL
}



export default function Tree(props: TreeProps): JSX.Element{
    const [xValue, setXValue] = useState(0)
    const [yValue, setYValue] = useState(0)
    const target = useRef(null)
    const [nodes, setNodes] = useState<string[][] | null>(null)
    useEffect(() => {
        if(props.target !== null){
            const newNodes = new Array<string[]>()
            newNodes.push([props.target])
            newNodes.unshift([])
            for(let i = 0;i < props.depth; i++){
                newNodes.shift([])

            }
        }else{
            setNodes(null)
        }
    },[props.target,props.depth])
    return <div>
        <DragRange
            percent
            value={xValue}
            onChange={value => setXValue(value)}
            getTarget={()=>target.current}
        >
            <DragRange
                percent
                yAxis
                getTarget={()=>target.current}
                onChange={value=>setYValue(value)}
                value={yValue}
            >
                <div ref={target} id="outer-tree">
                    <NodeBox globalX={xValue} globalY={yValue} />
                </div>
            </DragRange>
        </DragRange>
    </div>
}