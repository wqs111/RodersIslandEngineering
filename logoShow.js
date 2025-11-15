// particle-logo.js
// 图片粒子化
class ParticleLogo {
    // 构造函数：接收配置参数
    constructor(options) {
        // 默认配置
        this.config = {
            containerId: 'particle-container', // 容器ID
            imageSrc: '', // Logo图片路径（必填）
            particleSize: 2, // 粒子大小
            mouseRadius: 80, // 鼠标影响范围
            mousePower: 1.5, // 排斥力度
            pixelStep: 5, // 粒子密度（值越小粒子越多）
            ...options // 合并用户配置
        };

        // 初始化
        this.init();
    }

    // 初始化方法
    init() {
        // 获取容器
        this.container = document.getElementById(this.config.containerId);
        if (!this.container) {
            console.error('未找到容器元素，请检查containerId是否正确');
            return;
        }

        // 创建Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // 粒子数组和鼠标状态
        this.particles = [];
        this.mouse = { x: null, y: null, radius: this.config.mouseRadius, power: this.config.mousePower };

        // 加载图片并初始化粒子
        this.loadImageAndCreateParticles();

        // 事件监听
        this.bindEvents();

        // 启动动画
        this.animate();
    }

    // 加载Logo图片并创建粒子
    loadImageAndCreateParticles() {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // 解决跨域图片问题
        img.onload = () => {
            // 设置Canvas尺寸为容器大小
            this.resizeCanvas();

            // 计算缩放比例，让图片适应容器并稍微缩小一些
            const scaleFactor = 0.8; // 缩小到80%的大小
            const containerWidth = this.canvas.width;
            const containerHeight = this.canvas.height;

            // 计算适应容器的缩放比例
            let scale = Math.min(
                containerWidth / img.width,
                containerHeight / img.height
            ) * scaleFactor;

            // 计算缩放后的图片尺寸
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            // 绘制图片到临时Canvas用于分析像素（使用原始尺寸）
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            tempCtx.drawImage(img, 0, 0);

            // 获取图片像素数据
            const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
            const pixels = imageData.data;

            // 计算图片在Canvas中的居中位置（使用缩放后的尺寸）
            const centerX = this.canvas.width / 2 - scaledWidth / 2;
            const centerY = this.canvas.height / 2 - scaledHeight / 2;

            // 根据像素创建粒子
            for (let y = 0; y < img.height; y += this.config.pixelStep) {
                for (let x = 0; x < img.width; x += this.config.pixelStep) {
                    const index = (y * img.width + x) * 4;
                    const alpha = pixels[index + 3]; // 透明度

                    // 只在不透明区域创建粒子
                    if (alpha > 50) {
                        // 计算粒子在Canvas中的实际位置（居中显示并应用缩放）
                        const canvasX = centerX + x * scale;
                        const canvasY = centerY + y * scale;

                        // 从图片像素获取颜色
                        const r = pixels[index];
                        const g = pixels[index + 1];
                        const b = pixels[index + 2];
                        const color = `rgb(${r}, ${g}, ${b})`;

                        // 创建粒子
                        this.particles.push(new Particle(
                            canvasX,
                            canvasY,
                            color,
                            this.config.particleSize
                        ));
                    }
                }
            }
        };
        img.src = this.config.imageSrc; // 加载图片
    }

    // 调整Canvas尺寸
    resizeCanvas() {
        const { width, height } = this.container.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
    }

    // 绑定事件
    bindEvents() {
        // 鼠标移动
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // 鼠标离开
        this.canvas.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // 窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // 动画循环
    animate() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新并绘制所有粒子
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 粒子类（内部使用）
class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.size = size || (Math.random() * 2 + 1);
        this.baseX = x; // 基础位置（粒子最终会回到这里）
        this.baseY = y;
        this.color = color;
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = 0.85; // 摩擦力（使运动减速）
        this.attraction = 0.1; // 吸引力（拉回基础位置）
    }

    // 绘制粒子
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // 更新粒子位置
    update(mouse) {
        // 鼠标排斥逻辑
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.velocityX -= Math.cos(angle) * force * mouse.power;
                this.velocityY -= Math.sin(angle) * force * mouse.power;
            }
        }

        // 回到基础位置的吸引力
        const baseDx = this.baseX - this.x;
        const baseDy = this.baseY - this.y;
        const baseDistance = Math.sqrt(baseDx * baseDx + baseDy * baseDy);

        if (baseDistance > 0) {
            const force = (baseDistance * this.attraction) / 10;
            const angle = Math.atan2(baseDy, baseDx);
            this.velocityX += Math.cos(angle) * force;
            this.velocityY += Math.sin(angle) * force;
        }

        // 应用摩擦力
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;

        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}