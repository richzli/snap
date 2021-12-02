const framerate = 24;
const vx_base = 100;
const vy_base = 20;
const gravity = -100;

const dr = Math.pow(0.95, 30/framerate);
const dg = Math.pow(0.93, 30/framerate);
const db = Math.pow(0.90, 30/framerate);

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
    this.vx = Math.random()*vx_base - vx_base*(255-x)/255;
    this.vy = -Math.random()*vy_base;
    this.color = [color[0], color[1], color[2], color[3]];
    this.fixed = true;
    this.update = () => {
        if (!this.fixed) {
            this.color[0] *= dr;
            this.color[1] *= dg;
            this.color[2] *= db;
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