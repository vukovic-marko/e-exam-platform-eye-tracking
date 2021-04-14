import React from 'react'

const Tooltip = (data) => {
    return (
      <div style= {{
        width: 200,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5
      }}>
        <h6>{data.caption}</h6>
        <b>{data.count}</b> {data.count === 1 ? 'point' : 'points'} out of <b>{data.sequence_length}</b> total <br/>
        <b>{(data.percentage*100).toFixed(2)}%</b> of a sequence
      </div>
    )
}

export default Tooltip
