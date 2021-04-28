import React, { useRef, useEffect } from 'react'
import { Rect, Text, Label, Transformer } from 'react-konva';


const AreaOfInterest = (props) => {

    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (trRef.current && trRef.current.nodes()) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    })

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
                    props.areaOfInterestMoved(idx, x, y, x + width, y + height);
                }}
            >
                <Text x={5} y={5} text={props.caption}/>
                <Rect
                    x={0}
                    y={0}
                    color="red"
                    width={width}
                    height={height}
                    ref={shapeRef}
                    onTransformEnd={(e) => {
                        // transformer is changing scale of the node
                        // and NOT its width or height
                        // but in the store we have only width and height
                        // to match the data better we will reset scale on transform end
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
              
                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);

                        node.width(node.width() * scaleX)
                        node.height(node.height() * scaleY)
                        
                        props.areaOfInterestMoved(idx, node.parent.x(), node.parent.y(), node.parent.x() + node.width(), node.parent.y() + node.height());
                      }}
                    stroke={getColor(idx+1).toString()}
                ></Rect>
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    borderEnabled={false}
                    keepRatio={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    />
            </Label>
        );

}


export default AreaOfInterest
