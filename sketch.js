// By Steve's Makerspace
// https://youtu.be/SRRjYIbKZHw
// p to pause, n for new art, s to save jpg
// mess with the variables below

let amplitude, env, fft, sound;
let additive = false;
let filling = true; //color lines only or fill?
//if fill, black outline?
let blackLines = false; //only when filling
let chromatic = false;
let sw = 10; // strokeWeight if there are lines
let sat = 100; // def 100
let brt = 70; // def 70
let alph = 30; // def 30
let rate = 5; //rate of pedal change 0.5
let hueyD = 1.4; //rate of color change 1.4
let range = 360; // color range
let numColors = 5; // for chromatic
let fps = 24; //framerate 24
let chance = 0.1; //chance in 10 of reversal 0.1
let array1 = [];
let newArray = [];
let paused = false;
let x1D,
    x2D,
    y2D,
    x3D,
    y3D,
    x4D,
    x1,
    x2,
    y2,
    x3,
    y3,
    x4,
    huey,
    ang,
    currR,
    maxY2,
    maxY3,
    pedalCount,
    layerCount,
    hueyPrelim,
    hueyMax;

function preload() {
    sound = loadSound('sound.mp3');
}

function setup() {
    amplitude = new p5.Amplitude();
    amplitude.setInput(sound)

    fft = new p5.FFT(.8, 16);
    // sound.setVolume(.5);
    sound.loop();


    frameRate(fps);

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(togglePlay);

    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100);
    newArt();
}

function newArt() {
    background(0);
    array1 = [];
    pedalCount = round(random(8, 25)); // 8 to 25
    ang = 360 / pedalCount;
    layerCount = random(4, 40); //4, 40+ takes more processing
    hueyPrelim = random(360);
    hueyMax = hueyPrelim + range;
    let colorPlace = 0;

    // calculate STARTING hues and points for each layer, starting with outside pedals and going inward, and save them plus directions to array
    let j = layerCount;
    for (let j = layerCount; j > 0; j--) {
        currR = (j / layerCount) * (width / 2);
        x1 = random(0.35 * currR, 0.45 * currR);
        x2 = random(0.5 * currR, 0.7 * currR);
        maxY2 = x2 * tan(ang) * 0.9;
        y2 = random(0.06 * currR, maxY2);
        x3 = random(x2 * 1.1, 0.85 * currR);
        maxY3 = x3 * tan(ang) * 0.9;
        y3 = random(0.06 * currR, maxY3);
        x4 = random(0.88 * currR, 0.99 * currR);
        x1D = x2D = y2D = x3D = y3D = x4D = (rate / layerCount) * j;

        if (chromatic == true) {
            huey = hueyPrelim + (colorPlace * range) / numColors;
            if (huey > 360) {
                huey -= 360;
            }
            colorPlace++;
            if (colorPlace > numColors) {
                colorPlace = 0;
            }
        } else {
            huey = random(360);
        }
        array1.push(
            x1,
            x2,
            y2,
            x3,
            y3,
            x4,
            x1D,
            x2D,
            y2D,
            x3D,
            y3D,
            x4D,
            huey,
            hueyD
        );
    }
    if (paused) {
        draw();
    }
}

function draw() {

    if (additive == false) {
        background(0); alph = 40; brt = 90;
        if (filling == false) { alph = 100; brt = 90 }
    }

    // let spectrum = fft.analyze();
    // console.log(spectrum);

    // let level = amplitude.getLevel();
    // mapped = round(random(level, 10));
    newLayerCount = layerCount;

    // console.log('level', level);
    // console.log('layerCount', layerCount);
    // console.log('newLayerCount', newLayerCount);

    newArray = [];
    push();
    translate(width / 2, height / 2);

    // calculate points for each layer, starting with outside pedals and going inward
    for (let k = newLayerCount; k > 0; k--) {
        let place = (newLayerCount - k) * 14;
        let x1N = array1[place + 0];
        let x2N = array1[place + 1];
        let y2N = array1[place + 2];
        let x3N = array1[place + 3];
        let y3N = array1[place + 4];
        let x4N = array1[place + 5];
        let x1Nd = array1[place + 6];
        let x2Nd = array1[place + 7];
        let y2Nd = array1[place + 8];
        let x3Nd = array1[place + 9];
        let y3Nd = array1[place + 10];
        let x4Nd = array1[place + 11];
        let hueyN = array1[place + 12];
        let hueyNd = array1[place + 13];
        currR = (k / newLayerCount) * (width / 2);

        x1N += x1Nd;
        if (x1N < 0.35 * currR || x1N > 0.45 * currR || random(10) < chance) {
            x1Nd *= -1;
        }
        x2N += x2Nd;
        if (x2N < 0.5 * currR || x2N > 0.7 * currR || random(10) < chance) {
            x2Nd *= -1;
        }
        maxY2 = x2N * tan(ang) * 0.9;
        y2N += y2Nd;
        if (y2N < 0.06 * currR || y2N > maxY2 || random(10) < chance) {
            y2Nd *= -1;
        }
        x3N += x3Nd;
        if (x3N < x2N * 1.1 || x3N > 0.85 * currR || random(10) < chance) {
            x3Nd *= -1;
        }
        maxY3 = x3N * tan(ang) * 0.9;
        y3N += y3Nd;
        if (y3N < 0.06 * currR || y3N > maxY3 || random(10) < chance) {
            y3Nd *= -1;
        }
        x4N += x4Nd;
        if (x4N < 0.88 * currR || x4N > 0.99 * currR || random(10) < chance) {
            x4Nd *= -1;
        }

        hueyN += hueyNd;
        if (chromatic == true) {
            if (
                hueyN > 360 ||
                hueyN > hueyMax ||
                hueyN < 0 ||
                hueyN < hueyPrelim ||
                random(10) < chance
            ) {
                hueyNd *= -1;
            }
        } else {
            if (hueyN > 359) {
                hueyN = 0;
            }
            if (hueyN < 0) {
                hueyN = 359;
            }
            if (random(10) < chance) {
                hueyNd *= -1;
            }
        }

        if (filling == false) {
            noFill();
            strokeWeight(sw);
            stroke(hueyN, sat, brt, alph);
        } else {
            if (blackLines == false) {
                noStroke();
            } else {
                stroke(0);
            }
            fill(hueyN, sat, brt, alph);
        }

        newArray.push(
            x1N,
            x2N,
            y2N,
            x3N,
            y3N,
            x4N,
            x1Nd,
            x2Nd,
            y2Nd,
            x3Nd,
            y3Nd,
            x4Nd,
            hueyN,
            hueyNd
        );


        // draw the pedals for one layer
        for (let i = 0; i < pedalCount; i++) {
            beginShape();
            curveVertex(x4N, 0);
            curveVertex(x4N, 0);
            curveVertex(x3N, y3N);
            curveVertex(x2N, y2N);
            curveVertex(x1N, 0);
            curveVertex(x2N, -y2N);
            curveVertex(x3N, -y3N);
            curveVertex(x4N, 0);
            curveVertex(x4N, 0);
            endShape();
            rotate(ang);
        }
        rotate(ang / 2);
    }
    pop();
    array1 = newArray;
}

function keyTyped() {
    if (key === "space") {

    }
    if (key === "s") {
        save("myCanvas.jpg");
    }
    if (key === "n") {
        setup();
    }
    if (key === "p") {
        if (paused) {
            loop();
            paused = false;
        } else {
            noLoop();
            paused = true;
        }
    }
}

function togglePlay() {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }
