const route =
    document.getElementById("journeyRoute");

const footprintContainer =
    document.getElementById("footprints");

const mapLoader =
    document.querySelector(".map-loader");

// ======================================================
// FLAG SETTINGS
// ======================================================

const FLAG_SIZE = 220; // Change this to resize the flag


// ======================================================
// SETTINGS
// ======================================================

const STEP_DISTANCE = 45;

const WALK_SPEED = 220;

const FOOTPRINT_SIZE = 18;




// Keep your existing footprint orientation
const FOOTPRINT_ROTATION_OFFSET = 90;


// Existing footprint fade behavior
const FOOTPRINT_LIFETIME = 1000;

const FADE_DURATION = 1000;


// ======================================================
// FINAL DESTINATION
// ======================================================

// You tested 98 and said this position works.
// So we keep it exactly as it is.
const END_OFFSET = 98;


// Final footprint will sit slightly behind the flag
const FINAL_FOOTPRINT_GAP = 28;


// ======================================================
// PATH
// ======================================================

const routeLength =
    route.getTotalLength();


// ======================================================
// PATH ANGLE
// ======================================================

function getPathAngle(distance) {

    const sample = 3;

    const p1 =
        route.getPointAtLength(
            Math.max(
                0,
                distance - sample
            )
        );

    const p2 =
        route.getPointAtLength(
            Math.min(
                routeLength,
                distance + sample
            )
        );


    const dx =
        p2.x - p1.x;

    const dy =
        p2.y - p1.y;


    return (
        Math.atan2(dy, dx)
        * 180
        / Math.PI
    );
}


// ======================================================
// SVG POSITION → MAP POSITION
// ======================================================

function getMapPosition(distance) {

    const point =
        route.getPointAtLength(distance);


    const matrix =
        route.getScreenCTM();


    const screenPoint =
        new DOMPoint(
            point.x,
            point.y
        ).matrixTransform(matrix);


    const loaderRect =
        mapLoader.getBoundingClientRect();


    return {

        x:
            screenPoint.x -
            loaderRect.left,

        y:
            screenPoint.y -
            loaderRect.top
    };
}


// ======================================================
// NORMAL TRAIL FOOTPRINT
// ======================================================

function createTrailFootprint(distance) {

    const position =
        getMapPosition(distance);

    const angle =
        getPathAngle(distance);


    const footprint =
        document.createElement("img");


    footprint.src =
        "assets/loader/Footprints.svg";

    footprint.className =
        "footprint";


    footprint.style.width =
        `${FOOTPRINT_SIZE}px`;

    footprint.style.left =
        `${position.x}px`;

    footprint.style.top =
        `${position.y}px`;


    // KEEPING YOUR WORKING FOOTPRINT ROTATION
    footprint.style.transform =
        `translate(-50%, -50%)
         rotate(${angle + FOOTPRINT_ROTATION_OFFSET}deg)`;


    footprintContainer.appendChild(
        footprint
    );


    // ------------------------------------------
    // Fade old footprint
    // ------------------------------------------

    setTimeout(() => {

        footprint.classList.add(
            "fade-out"
        );

    }, FOOTPRINT_LIFETIME);


    // ------------------------------------------
    // Remove old footprint
    // ------------------------------------------

    setTimeout(() => {

        footprint.remove();

    }, FOOTPRINT_LIFETIME + FADE_DURATION);
}

// ======================================================
// CREATE FLAG
// ======================================================

function createFlag(distance) {

    const position =
        getMapPosition(distance);

    // ----------------------------------
    // Outer marker
    // ----------------------------------

    const flag =
        document.createElement("div");

    flag.className =
        "flag-marker";

    flag.style.left =
        `${position.x}px`;

    flag.style.top =
        `${position.y}px`;

    /*
     * IMPORTANT:
     *
     * The flag NEVER receives the
     * route angle.
     *
     * It always remains horizontal.
     */
    flag.style.transform =
        "translate(-50%, -50%)";


    // ----------------------------------
    // Flag image
    // ----------------------------------

    const flagImage =
        document.createElement("img");

    flagImage.src =
        "assets/loader/flag_loader.svg";

    flagImage.className =
        "flag-image";

    /*
     * Size is controlled ONLY here.
     */
    flagImage.style.width =
        `${FLAG_SIZE}px`;

    /*
     * Absolutely no rotation.
     */
    flagImage.style.transform =
        "rotate(0deg)";


    flag.appendChild(
        flagImage
    );


    footprintContainer.appendChild(
        flag
    );


    return flag;
}


// ======================================================
// UPDATE FLAG POSITION
// ======================================================

function updateFlag(flag, distance) {

    const position =
        getMapPosition(distance);


    flag.style.left =
        `${position.x}px`;

    flag.style.top =
        `${position.y}px`;


    /*
     * Keep it horizontal.
     *
     * DO NOT call getPathAngle() here.
     */
    flag.style.transform =
        "translate(-50%, -50%)";
}

// ======================================================
// FINAL WAITING FOOTPRINT
// ======================================================

function createFinalFootprint(
    finalDistance
) {

    console.log(
        "CREATING FINAL WAITING FOOTPRINT"
    );


    // ------------------------------------------
    // Put footprint slightly behind the flag
    // ------------------------------------------

    const footprintDistance =
        Math.max(
            0,
            finalDistance - FINAL_FOOTPRINT_GAP
        );


    const position =
        getMapPosition(
            footprintDistance
        );


    const angle =
        getPathAngle(
            footprintDistance
        );


    const footprint =
        document.createElement("img");


    footprint.src =
        "assets/loader/Footprints.svg";


    footprint.className =
        "final-footprint";


    footprint.style.width =
        `${FOOTPRINT_SIZE}px`;


    footprint.style.left =
        `${position.x}px`;


    footprint.style.top =
        `${position.y}px`;


    // Keep the same orientation system
    // as your working footprints.
    footprint.style.transform =
        `
        translate(-50%, -50%)
        rotate(${angle + FOOTPRINT_ROTATION_OFFSET}deg)
        `;


    footprintContainer.appendChild(
        footprint
    );


    console.log(
        "FINAL FOOTPRINT POSITION:",
        position
    );
}


// ======================================================
// WALKING STATE
// ======================================================

let distance = 0;

let nextFootprintDistance = 0;

let lastTime =
    performance.now();

let hasArrived = false;


// Moving flag reference
let movingFlag = null;


// ======================================================
// WALK
// ======================================================

function walk(currentTime) {

    // ------------------------------------------
    // IMPORTANT:
    // Completely stop after reaching destination
    // ------------------------------------------

    if (hasArrived) {

        return;
    }


    // ------------------------------------------
    // Calculate elapsed time
    // ------------------------------------------

    const delta =
        (
            currentTime -
            lastTime
        ) / 1000;


    lastTime =
        currentTime;


    // ------------------------------------------
    // Move traveler
    // ------------------------------------------

    distance +=
        WALK_SPEED * delta;


    // ------------------------------------------
    // Destination
    // ------------------------------------------

    const finalDistance =
        Math.max(
            0,
            routeLength - END_OFFSET
        );


    // ==================================================
    // ARRIVED
    // ==================================================

    if (
        distance >= finalDistance
    ) {

        // Clamp position exactly
        distance =
            finalDistance;


        // IMPORTANT:
        // Prevent another animation frame.
        hasArrived =
            true;


        console.log(
            "TRAVELER REACHED END"
        );


        // ----------------------------------------------
        // Put flag exactly at final destination
        // ----------------------------------------------

        updateFlag(
            movingFlag,
            finalDistance
        );


        // ----------------------------------------------
        // Tell CSS that flag has reached destination
        // ----------------------------------------------

        movingFlag.classList.add(
            "final"
        );


        // ----------------------------------------------
        // Create ONE blinking footprint
        // slightly behind the flag
        // ----------------------------------------------

        createFinalFootprint(
            finalDistance
        );


        // ----------------------------------------------
        // DO NOT call requestAnimationFrame()
        // ----------------------------------------------

        return;
    }


    // ==================================================
    // UPDATE MOVING FLAG
    // ==================================================

    if (
        movingFlag === null
    ) {

        // First frame:
        // create flag at Daman

        movingFlag =
            createFlag(
                distance
            );

    } else {

        // Every frame after that:
        // move flag along route

        updateFlag(
            movingFlag,
            distance
        );
    }


    // ==================================================
    // CREATE TRAIL FOOTPRINTS
    // ==================================================

    while (
        distance >=
        nextFootprintDistance
    ) {

        createTrailFootprint(
            nextFootprintDistance
        );


        nextFootprintDistance +=
            STEP_DISTANCE;
    }


    // ==================================================
    // CONTINUE WALKING
    // ==================================================

    requestAnimationFrame(
        walk
    );
}


// ======================================================
// START
// ======================================================

requestAnimationFrame(
    walk
);