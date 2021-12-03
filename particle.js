const framerate = 20;
const speedup = 1.25;
const vx_base = 60;
const vy_base = 50;
const gravity = -150;

const dr = Math.pow(0.95, 30);
const dg = Math.pow(0.93, 30);
const db = Math.pow(0.90, 30);

/*
 * Particle
 * - x: number
 * - y: number
 * - vx: number
 * - vy: number
 * - color: number[4] (RGBA)
 * - fixed: boolean
 */
function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5)*vx_base - vx_base*0.5*((size-x)/size-0.5);
    this.vy = -Math.random()*vy_base;
    this.color = [color[0], color[1], color[2], Math.floor(color[3])];
    this.fixed = true;
    this.update = () => {
        if (!this.fixed) {
            this.color[0] *= Math.pow(dr, 1/framerate);
            this.color[1] *= Math.pow(dg, 1/framerate);
            this.color[2] *= Math.pow(db, 1/framerate);
            this.x += this.vx / framerate;
            this.y += (1/2*gravity / framerate + this.vy) / framerate;
            this.vy += gravity / framerate;
        }
    };
    this.draw = (ctx) => {
        ctx.fillStyle = `rgba(${(this.color[0]).toFixed()}, ${(this.color[1]).toFixed()}, ${(this.color[2]).toFixed()}, ${this.color[3]})`;
        ctx.fillRect((this.x).toFixed(), (this.y).toFixed(), 1, 1);
    };
};