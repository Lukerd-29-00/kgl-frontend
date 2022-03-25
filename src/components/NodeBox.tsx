import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import "./Tree.css"
import { classicNameResolver } from "typescript"

interface TreeTierProps{
    classes: string[][]
    globalY: number,
    globalX: number,
}

export default function NodeBox(props: TreeTierProps){
    const left = 20 + props.globalX
    const right = left + 60
    const top = 20 + props.globalY
    const bottom = top + 60
    return <div id="inner-tree" style={{top: `${top}%`,bottom: `${bottom}%`, left: `${left}%`, right: `${right}%`}}>
        {props.classes.map((tier: string[],i: number) => <li key={`tree row ${i}`}>
                <Row>
                    {tier.map((name: string,j: number) => <li key={`tree row ${i} col ${j}`}>
                        <Col>
                            <span>
                                {name}
                            </span>
                        </Col> 
                    </li>
                    )}
                </Row>
            </li>
        )}
    </div> 


}