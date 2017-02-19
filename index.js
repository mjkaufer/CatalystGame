var Example = Example || {};

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    wireframes: false,
    options: {
        width: document.body.clientWidth,
        height: document.body.clientHeight / 2
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);


var wordWidth = render.canvas.width/10;
var wordCount = 8;


var letters = []
var sleeping = []



$.get('./Catalyst.svg').done(function(data) {
    // var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);
    var color = "#333333";
    $(data).find('path').each(function(i, path) {
        var vertexSets = [];


        vertexSets.push(Svg.pathToVertices(path));
        console.log(vertexSets)
        var body = Bodies.fromVertices(render.canvas.width + wordWidth*(i-9), 100, vertexSets, {
            flagInternal: true,
            render: {
                fillStyle: color,
                strokeStyle: color,
                opacity: 1,
                lineWidth: 1
                //THE FILL COLORS AND STYLES DONT ACTUALLY WORK
                //I LITERALLY HAD TO EDIT THE RENDERER TO MAKE THIS SHIT HAVE COLOR
                //THIS IS WHY I DRINK
                //I KIND OF EDITED THE CODE TO FIX LINEWIDTH BUT THAT WAS STILL DUBIOUS AT BEST
            }
        }, true);


        (function(body, i){
            body["index"] = i;    
        })(body, i)
        



        letters.push(body)
        sleeping.push(body.id)

        Matter.Sleeping.set(body, true);
        World.add(world, body);



    });


});


World.add(world, [
    // Bodies.rectangle()
    // Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    // Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    // Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, render.canvas.height, render.canvas.width*2, 1, { isStatic: true }),
    Bodies.rectangle(0, 0, render.canvas.width*2, 1, { isStatic: true }),
    Bodies.rectangle(0, 0, 1, render.canvas.height*2, { isStatic: true }),
    Bodies.rectangle(render.canvas.width, 0, 1, render.canvas.height*2, { isStatic: true }),
    //also wtf the render.canvas.height  only fills up half like smfh

]);


// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: true
            }
        }
    });

World.add(world, mouseConstraint);

Matter.Events.on(mouseConstraint, 'startdrag', function(event){
    // console.log(event.body.id)
    var indexOf = sleeping.indexOf(event.body.id)
    if (indexOf != -1)
        sleeping.splice(indexOf, 1)
    // event.pairs.forEach(function(e){
    //     console.log(e.bodyB.isSleeping + ":" + e.bodyA.isSleeping)
    //     if (e.isSleeping)
    //         return;
    //     console.log("Hello")
    //     // console.log(e)

    //     if (!e.bodyB.isSleeping && blackListedIds.indexOf(e.bodyB.id) == -1)
    //         blackListedIds.push(e.bodyB.id)

    //     x = true
    //     console
    //     if (e.index !== undefined) {
    //         letters.stopRotating = true;
    //     }
    // })
    console.log(event)
})

// keep the mouse in sync with rendering
render.mouse = mouse;

var startTime = Date.now();

var lastRotationArray = Array.apply(null, Array(wordCount)).map(Number.prototype.valueOf,0);//so we can't actually do absolute rotation or access elements' last rotation so we have to do this



var jitterInterval = setInterval(function(){

    var dt = Date.now() - startTime;

    letters.forEach(function(e, i){
        if (sleeping.indexOf(e.id) == -1) {
            console.log("Oh no")
            return;
        }

        var angle = Math.sin(dt / 200 + i ) * Math.PI / 24;
        Matter.Body.rotate(e, angle - lastRotationArray[i])
        // console.log(angle - lastRotationArray[i])
        lastRotationArray[i] = angle


    })

}, 10)

// fit the render viewport to the scene
// Render.lookAt(render, {
//     min: { x: 0, y: 0 },
//     max: { x: 800, y: 600 }
// });

// // context for MatterTools.Demo
// return {
//     engine: engine,
//     runner: runner,
//     render: render,
//     canvas: render.canvas,
//     stop: function() {
//         Matter.Render.stop(render);
//         Matter.Runner.stop(runner);
//     }
// };
