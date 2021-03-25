
// CRUNCHES EYE MOVEMENT DATA
// EXPECTS
//  limits[]
//      id
//      caption
//      top_left
//          x1
//          y1
//      bottom_right
//          x2
//          y2
//  data[]
//      GazeX
//      GazeY
const crunchData = (limits, data) => {
    const temp = isInArea(limits, data);
    let arr1 = []

    temp.forEach(e => {
        if (!arr1.length || e.id !== arr1[arr1.length-1].id) {
            arr1.push({
                id: e.id,
                caption: e.caption,
                count: 1
            })
        } else if (e.id === arr1[arr1.length-1].id) {
            arr1[arr1.length-1].count++;
        }
    })

    const full = arr1.reduce((last, current) => last + current.count, 0)
    let counter = 0;
    arr1.forEach(e => {
        e.percentage = e.count/full;
        e.start = counter;
        e.end = counter + e.count;
        counter += e.count;
    })
    
    
    let sequence = JSON.parse(JSON.stringify(arr1));
    let arr2 = []

    

    arr1.forEach(e => {
        if (!arr2.length) {
            arr2.push(e);
        } else {
            let found = false;
            arr2.forEach((item) => {
                if (item.id === e.id) {
                    found = true;
                    item.count = item.count + e.count;
                }
            })
            if (!found) {
                arr2.push(e);
            }
        }
    })

    arr2.forEach(e => {
        e.percentage = e.count/full;
    })

    return {
        sequence: sequence,
        sequence_length: full,
        summary: arr2
    }

}

// HELP FUNCTION
// TRANSFORMS array of eye movement data
// from
// { GazeX: x1, GazeY: y1 } length n
//  to
// { id: area_id, caption: area_caption } length n
const isInArea = (limits, data) => {
    let ret = []
    
    data.forEach(e => {
        let flag = false;
        limits.forEach(l => {
            if (e.GazeX >= l.top_left.x1 & e.GazeY >= l.top_left.y1 & e.GazeX <= l.bottom_right.x2 & e.GazeY <= l.bottom_right.y2) {
                // inside
                flag = true;
                ret.push({
                    id: l.id,
                    caption: l.caption
                });
            }
        })
        if (!flag) {
            ret.push({
                id: -1,
                caption: 'None'
            })
        }
    })
    
    return ret;
}


module.exports.crunchData = crunchData;