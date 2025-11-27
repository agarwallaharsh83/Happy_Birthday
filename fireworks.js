const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Firework {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * W;
        this.y = H;
        this.targetY = Math.random() * (H / 2);
        this.speed = Math.random() * 4 + 4;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;

            if (this.y <= this.targetY) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            this.particles.forEach((p) => p.update());
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, 3, 3);
        } else {
            this.particles.forEach((p) => p.draw());
        }
    }

    createParticles() {
        const count = 40;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        for (let i = 0; i < count; i++) {
            this.particles.push(
                new Particle(this.x, this.y, color)
            );
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.color = color;
        this.life = 100;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.96;
        this.life -= 2;
    }

    draw() {
        if (this.life > 0) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life / 100;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

let fireworks = [];
setInterval(() => fireworks.push(new Firework()), 600);

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, W, H);

    fireworks = fireworks.filter(f => !f.exploded || f.particles.some(p => p.life > 0));

    fireworks.forEach(f => {
        f.update();
        f.draw();
    });

    requestAnimationFrame(animate);
}

animate();
