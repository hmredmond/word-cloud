/*Given a list of rectangles determine if there is an overlap between the
a new rectangle and any of the rectangles in the list.
Return true if an intersecting triangle exists.
*/
function rectangleIntersection(rectList, len, rect, padding) {
    for (var i = 0; i < len; ++i) {
        const r = rectList[i];
        //If one rectangle is on left side of other
        if (rect['rx'] + padding < r['lx'] || rect['lx'] - padding > r['rx']) 
            continue
            //If one rectangle is above other
        if (rect['uy'] + padding < r['ly'] || rect['ly'] - padding > r['uy']) 
            continue
        return true
    }
    return false
}

/*Compute the layout*/
function computeLayout(layout, width, height, padding) {
    //Sort rectangles by height
    layout
        .sort(function (a, b) {
            return b['height'] - a['height']
        });
    //Place first rectangle in centre
    layout[0]['lx'] = -layout[0]['width'] / 2;
    layout[0]['rx'] = layout[0]['width'] / 2;
    layout[0]['ly'] = -layout[0]['height'] / 2;
    layout[0]['uy'] = layout[0]['height'] / 2;

    var t = 0,
        step = Math.PI / 32;
    var ratio = height / width;
    for (var i = 1; i < layout.length; ++i) {
        while (true) {
            var x = t * Math.cos(t);
            var y = t * Math.sin(t);
            y *= ratio;
            t += step;
            var rect = {
                'lx': x - layout[i]['width'] / 2,
                'rx': x + layout[i]['width'] / 2,
                'ly': y - layout[i]['height'] / 2,
                'uy': y + layout[i]['height'] / 2
            };
            if (rectangleIntersection(layout, i, rect, padding) === false) {
                layout[i]['lx'] = rect['lx']
                layout[i]['rx'] = rect['rx']
                layout[i]['ly'] = rect['ly']
                layout[i]['uy'] = rect['uy']
                break;
            }
        }
    }

    const maxx = layout
        .map(x => x['rx'])
        .reduce(function (a, b) {
            return Math.max(a, b)
        });
    const minx = layout
        .map(x => x['lx'])
        .reduce(function (a, b) {
            return Math.min(a, b)
        });
    const maxy = layout
        .map(x => x['uy'])
        .reduce(function (a, b) {
            return Math.max(a, b)
        });
    const miny = layout
        .map(x => x['ly'])
        .reduce(function (a, b) {
            return Math.min(a, b)
        });

    var xscale = width / (2 * Math.max(maxx, -minx));
    var yscale = height / (2 * Math.max(maxy, -miny));
    var scale = Math.min(xscale, yscale);
    for (i = 0; i < layout.length; ++i) {
        layout[i]['lx'] *= scale;
        layout[i]['rx'] *= scale;
        layout[i]['uy'] *= scale;
        layout[i]['ly'] *= scale;
        layout[i]['fontSize'] = layout[i]['value'] * scale;
        layout[i]['x'] = layout[i]['lx'] + layout[i]['width'] * scale / 2 + width / 2;
        layout[i]['y'] = layout[i]['ly'] + layout[i]['height'] * scale / 2 + height / 2;
    }

    return layout;
}

export {computeLayout, rectangleIntersection};