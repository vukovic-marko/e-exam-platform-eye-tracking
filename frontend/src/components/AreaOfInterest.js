import React from 'react'
import { Rect, Text, Label } from 'react-konva';


const AreaOfInterest = (props) => {

    const { area, idx } = props;    
    const width = area.bottom_right.x2 - area.top_left.x1;
    const height = area.bottom_right.y2 - area.top_left.y1;

    const getColor = (id) => {
        const colors = ['#3581D8', '#D82E3F', '#FFE135', '#63CAD8', '#28CC2D'];
        return colors[id % 5];
    }

    if (!props.draggable) 
        return (
            <Label x={area.top_left.x1} y={area.top_left.y1}>
                <Text x={5} y={height-15} text={area.caption}/>
                <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    stroke={getColor(idx+1).toString()}
                />  
            </Label>
        );
    else
        return (
            <Label 
                x={area.top_left.x1} 
                y={area.top_left.y1} 
                draggable={true}
                onDragEnd={e => {
                    const { x, y } = e.target._lastPos;
                    const { height, width } = e.target.children[1].attrs;
                    props.areaOfInterestMoved(idx, x, y, x + height, y + width);
                }}
            >
                <Text x={5} y={200-15} text={props.caption}/>
                <Rect
                    x={0}
                    y={0}
                    width={200}
                    height={200}
                    stroke={getColor(idx+1).toString()}
                ></Rect>
            </Label>
        );

}


export default AreaOfInterest
