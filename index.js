var cvs = document.getElementById("image");
var ctx = cvs.getContext("2d");

const pps = 1/3;
var particles = [];
let fn = (p) => { return Math.pow(p.x, 2) + Math.pow(p.y+cvs.height, 2); };
var gif = null;

document.getElementById("img-input").onchange = () => {
    let input = document.getElementById("img-input").files[0];

    let img = new Image();
    img.src = URL.createObjectURL(input);
    img.onload = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

        particles = [];
        gif = new GIF({
            workers: 2,
            quality: 10,
            transparent: 0x00FF00,
        });
        gif.addFrame(cvs, { copy: true });

        let data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;

        for (let i = 0; i < cvs.width; ++i) {
            for (let j = 0; j < cvs.height; ++j) {
                let p = new Particle(i, j, data.slice(4*(j*cvs.width+i), 4*(j*cvs.width+i)+4));
                particles.push(p);
            }
        }
        
        particles.sort((a, b) => {
            return fn(a) - fn(b);
        });
    };
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function run() {
    let i = 0, endframes = 0;
    while (endframes < 0.5*framerate) {
        await sleep(5);

        let done = true;

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        for (let j = 0; j < particles.length; ++j) {
            if (Math.sqrt(fn(particles[j])) > Math.sqrt(5)*cvs.height*(1-i*pps/framerate))
                particles[j].fixed = false;   
        }
        for (let p of particles) {
            p.update();
            p.draw(ctx);
            if (!(0 > p.x || 0 > p.y || cvs.width < p.x || cvs.height < p.y)) {
                done = false;
            }
        }

        if (done) {
            endframes += 1;
        }
        i += 1;

        gif.addFrame(cvs, { delay: 1000/framerate, copy: true });
    }

    gif.on("finished", function(blob) {
        document.getElementById("result").src = URL.createObjectURL(blob);
    });
    gif.render();
};

document.getElementById("go").onclick = run;
