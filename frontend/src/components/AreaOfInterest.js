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

}


export default AreaOfInterest
