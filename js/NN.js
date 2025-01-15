let canvasHolder = document.getElementById("canvasholder");
let w = canvasHolder.offsetWidth;
console.log(w);
let l1, l2;
let range1, range2;

let initialLoad = true;

// Colors
const BG_COLOR = [36, 36, 36];
// const DEFAULT_CIRCLE_COLOR = [0, 98, 155];
const DEFAULT_CIRCLE_COLOR = [36, 36, 36];
// const DEFAULT_CIRCLE_COLOR = [0, 98, 155];

// const HOVER_CIRCLE_COLOR = [0, 83, 132];
const HOVER_CIRCLE_COLOR = [0, 98, 155];
// const LINE_COLOR = [230, 185, 0];
const DEFAULT_LINE_COLOR = [235, 235, 235];
// const LINE_COLOR = [198, 146, 20];

let layerColors = []; // Stores the current color of all circles
let hovering = false; // Global flag for hover detection

function setup() {
    let canvas = createCanvas(w, w);
    canvas.parent("NNCanvas");
    trace = createGraphics(width, height);
    trace.background(240, 240, 240);
    l1 = floor(random(2, 6));
    l2 = floor(random(2, 6));
    while (l1 == l2) {
        l1 = floor(random(2, 6));
        l2 = floor(random(2, 6));
    }

    // Initialize colors for all layers
    initializeLayerColors(l1 + l2 + 2); // Total circles (layer1 + layer2 + layer3)
}

function draw() {
    background(...BG_COLOR);

    let layer1 = [];
    let layer2 = [];
    let layer3 = [];

    // Store positions for the first layer
    let base = w / 2;
    range1 = base + ((l1 - 3) * base) / 10;
    range2 = base + ((l2 - 3) * base) / 10;

    for (let i = 0; i < l1; i++) {
        let x = (3 * w) / 16;
        let y = w / 2 - range1 / 2 + i * (range1 / (l1 - 1));
        layer1.push({ x, y });
    }

    // Store positions for the second layer
    for (let i = 0; i < l2; i++) {
        let x = w / 2;
        let y = w / 2 - range2 / 2 + i * (range2 / (l2 - 1));
        layer2.push({ x, y });
    }

    // Store positions for the third layer
    let range = 100;
    let nodes = 2;
    for (let i = 0; i < nodes; i++) {
        let x = (13 * w) / 16;
        let y = w / 2 - range / 2 + i * (range / (nodes - 1));
        layer3.push({ x, y });
    }

    // Check if hovering over any circle
    hovering = isHovering([...layer1, ...layer2, ...layer3]);

    // Update colors of all circles based on hover state
    if (initialLoad) {
        if (millis() / 1000 > 1) {
            initialLoad = false;
        }
    }
    updateAllColors();

    // Draw lines first
    stroke(...DEFAULT_LINE_COLOR);
    strokeWeight(1);
    for (let a of layer1) {
        for (let b of layer2) {
            line(a.x, a.y, b.x, b.y);
        }
    }
    for (let a of layer2) {
        for (let b of layer3) {
            line(a.x, a.y, b.x, b.y);
        }
    }

    // Draw circles
    strokeWeight(2);
    drawCircles(layer1, 0);
    drawCircles(layer2, layer1.length);
    drawCircles(layer3, layer1.length + layer2.length);
}

function initializeLayerColors(totalCircles) {
    for (let i = 0; i < totalCircles; i++) {
        layerColors.push([...DEFAULT_CIRCLE_COLOR]); // Start with default color
    }
}

function isHovering(allLayers) {
    for (let { x, y } of allLayers) {
        let d = dist(mouseX, mouseY, x, y);
        if (d < 20) {
            return true; // Mouse is hovering over at least one circle
        }
    }
    return false;
}

function updateAllColors() {
    let targetColor;
    if (initialLoad) {
        targetColor = HOVER_CIRCLE_COLOR;
    } else {
        targetColor = hovering ? HOVER_CIRCLE_COLOR : DEFAULT_CIRCLE_COLOR;
    }
    for (let i = 0; i < layerColors.length; i++) {
        layerColors[i] = lerpColorArray(layerColors[i], targetColor, 0.1);
    }
}

function drawCircles(layer, colorOffset) {
    for (let i = 0; i < layer.length; i++) {
        let { x, y } = layer[i];
        fill(...layerColors[colorOffset + i]); // Use the interpolated color
        let circleSize = w / 10;
        if (circleSize < 30) {
            circleSize = 30;
        }
        ellipse(x, y, circleSize);
    }
}

function lerpColorArray(currentColor, targetColor, amount) {
    return currentColor.map((c, i) => lerp(c, targetColor[i], amount));
}
