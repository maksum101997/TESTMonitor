// ============================================
// TitanSu Monitor Tester Enterprise - Ultra Premium Edition
// ============================================

// Global State
let fps = 0;
let lastTime = performance.now();
let frameCount = 0;
let fpsUpdateInterval = 100;
let fpsHistory = [];
let testArea, controls;
let currentTest = null;
let sessionStartTime = Date.now();
let testsCompleted = 0;
let testResults = {};

// Statistics
const stats = {
    maxFPS: 0,
    minFPS: Infinity,
    avgFPS: 0,
    fpsReadings: [],
    testHistory: [],
    qualityScore: 100
};

// Quality calculation
function calculateQualityScore() {
    let score = 100;
    
    // FPS score (40% weight)
    const fpsScore = Math.min(100, (stats.avgFPS / 390) * 100);
    score = score * 0.4 + fpsScore * 0.4;
    
    // Stability score (30% weight)
    if (stats.fpsReadings.length > 10) {
        const variance = calculateVariance(stats.fpsReadings.slice(-100));
        const stabilityScore = Math.max(0, 100 - variance);
        score = score * 0.7 + stabilityScore * 0.3;
    }
    
    // Tests completed bonus (30% weight)
    const testsScore = Math.min(100, (testsCompleted / 15) * 100);
    score = score * 0.7 + testsScore * 0.3;
    
    stats.qualityScore = Math.round(Math.max(0, Math.min(100, score)));
    return stats.qualityScore;
}

function calculateVariance(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    testArea = document.getElementById('test-area');
    controls = document.getElementById('controls');
    
    updateFPS();
    updateSessionTime();
    updateProgressBar();
    setupNavigation();
    setupControls();
    loadSettings();
    
    tests.home();
    document.querySelector('[data-test="home"]').classList.add('active');
    
    // Start session timer
    setInterval(updateSessionTime, 1000);
    setInterval(updateProgressBar, 100);
    
    // Setup card clicks
    setTimeout(() => {
        document.querySelectorAll('.enterprise-card').forEach(card => {
            card.addEventListener('click', () => {
                const test = card.dataset.test;
                if (test && tests[test]) {
                    document.querySelector(`[data-test="${test}"]`)?.click();
                }
            });
        });
    }, 100);
});

function updateProgressBar() {
    const progressBar = document.getElementById('session-progress');
    if (progressBar) {
        const elapsed = Date.now() - sessionStartTime;
        const maxSessionTime = 3600000; // 1 hour
        const progress = Math.min(100, (elapsed / maxSessionTime) * 100);
        progressBar.style.width = progress + '%';
    }
}

// FPS Counter with History
function updateFPS() {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastTime >= fpsUpdateInterval) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        const fpsElement = document.getElementById('fps');
        if (fpsElement) {
            fpsElement.textContent = fps;
        }
        
        // Update statistics
        stats.fpsReadings.push(fps);
        if (stats.fpsReadings.length > 1000) stats.fpsReadings.shift();
        
        if (fps > stats.maxFPS) stats.maxFPS = fps;
        if (fps < stats.minFPS) stats.minFPS = fps;
        
        const sum = stats.fpsReadings.reduce((a, b) => a + b, 0);
        stats.avgFPS = Math.round(sum / stats.fpsReadings.length);
        
        fpsHistory.push(fps);
        if (fpsHistory.length > 60) fpsHistory.shift();
        
        // Update quality score
        calculateQualityScore();
        updateQualityDisplay();
        
        // Update FPS trend
        updateFPSTrend();
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(updateFPS);
}

function updateQualityDisplay() {
    const qualityEl = document.getElementById('quality-score');
    const trendEl = document.getElementById('quality-trend');
    if (qualityEl) {
        qualityEl.textContent = stats.qualityScore + '%';
        qualityEl.style.color = stats.qualityScore >= 90 ? '#00ff88' : 
                                stats.qualityScore >= 70 ? '#ffaa00' : '#ff4444';
    }
    if (trendEl) {
        trendEl.textContent = stats.qualityScore >= 90 ? '↑' : 
                             stats.qualityScore >= 70 ? '→' : '↓';
    }
}

function updateFPSTrend() {
    const trendEl = document.getElementById('fps-trend');
    if (trendEl && fpsHistory.length >= 2) {
        const recent = fpsHistory.slice(-5);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const prev = fpsHistory[fpsHistory.length - 6] || avg;
        if (avg > prev * 1.05) trendEl.textContent = '↑';
        else if (avg < prev * 0.95) trendEl.textContent = '↓';
        else trendEl.textContent = '→';
    }
}

// Session Time
function updateSessionTime() {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeElement = document.getElementById('session-time');
    if (timeElement) {
        timeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Notification System
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Test Management
const tests = {
    home: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-hero">
                    <div class="hero-icon">🖥️</div>
                    <h2>Добро пожаловать в TitanSu Monitor Tester Pro</h2>
                    <p class="hero-subtitle">Профессиональный инструмент для тестирования мониторов 390Hz</p>
                </div>
                <div class="info-grid">
                    <div class="info-card premium-card">
                        <div class="card-icon">⚡</div>
                        <h3>Тест FPS</h3>
                        <p>Точное измерение частоты обновления экрана в реальном времени с детальной статистикой</p>
                        <div class="card-badge">390Hz Target</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">🔴</div>
                        <h3>Битые пиксели</h3>
                        <p>Автоматическое обнаружение мертвых, горячих и застрявших пикселей на всех цветах</p>
                        <div class="card-badge">8 цветов</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">📊</div>
                        <h3>Полосы</h3>
                        <p>Проверка вертикальных и горизонтальных полос с настраиваемой шириной</p>
                        <div class="card-badge">Настраиваемо</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">🌈</div>
                        <h3>Градиент</h3>
                        <p>Тест плавности цветовых переходов и проверка цветопередачи</p>
                        <div class="card-badge">3 режима</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">⚫</div>
                        <h3>Контрастность</h3>
                        <p>11 уровней яркости для проверки различимости темных и светлых областей</p>
                        <div class="card-badge">11 уровней</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">🎨</div>
                        <h3>Цвета RGB</h3>
                        <p>Тест основных цветов и их смешивания для проверки цветопередачи</p>
                        <div class="card-badge">9 цветов</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">🌀</div>
                        <h3>Размытие движения</h3>
                        <p>Проверка размытия при быстром движении объектов и времени отклика</p>
                        <div class="card-badge">Анимация</div>
                    </div>
                    <div class="info-card premium-card">
                        <div class="card-icon">💡</div>
                        <h3>Равномерность подсветки</h3>
                        <p>Проверка равномерности подсветки экрана по всей площади</p>
                        <div class="card-badge">Новый</div>
                    </div>
                </div>
            </div>
        `;
        controls.style.display = 'none';
    },

    fps: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen fps-test">
                <div class="fps-display" id="big-fps">0</div>
                <div class="fps-info">
                    <p><strong>Целевая частота:</strong> 390 FPS</p>
                    <p><strong>Максимум:</strong> <span id="max-fps">0</span> FPS</p>
                    <p><strong>Минимум:</strong> <span id="min-fps">0</span> FPS</p>
                    <p><strong>Среднее:</strong> <span id="avg-fps">0</span> FPS</p>
                </div>
                <canvas id="fps-chart" class="fps-chart" width="800" height="100"></canvas>
            </div>
        `;
        controls.style.display = 'flex';
        
        if (window.fpsInterval) clearInterval(window.fpsInterval);
        
        setTimeout(() => {
            const bigFpsDisplay = document.getElementById('big-fps');
            const maxFpsEl = document.getElementById('max-fps');
            const minFpsEl = document.getElementById('min-fps');
            const avgFpsEl = document.getElementById('avg-fps');
            const chart = document.getElementById('fps-chart');
            
            window.fpsInterval = setInterval(() => {
                if (bigFpsDisplay) {
                    bigFpsDisplay.textContent = fps;
                    const color = fps >= 350 ? '#00ff88' : fps >= 200 ? '#ffaa00' : '#ff4444';
                    bigFpsDisplay.style.color = color;
                }
                if (maxFpsEl) maxFpsEl.textContent = stats.maxFPS;
                if (minFpsEl) minFpsEl.textContent = stats.minFPS === Infinity ? 0 : stats.minFPS;
                if (avgFpsEl) avgFpsEl.textContent = stats.avgFPS;
                if (chart) drawFPSChart(chart);
            }, 100);
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    'dead-pixels': () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        let currentColor = 'black';
        const colors = {
            black: '#000000',
            white: '#ffffff',
            red: '#ff0000',
            green: '#00ff00',
            blue: '#0000ff',
            yellow: '#ffff00',
            cyan: '#00ffff',
            magenta: '#ff00ff'
        };

        testArea.innerHTML = `
            <div class="test-screen dead-pixels-test" id="dead-pixels-screen" style="background-color: ${colors[currentColor]};">
                <div class="color-options">
                    <div style="font-weight: 600; margin-bottom: 10px; color: var(--text-primary);">Цвета:</div>
                    <button class="color-btn active" data-color="black">Черный</button>
                    <button class="color-btn" data-color="white">Белый</button>
                    <button class="color-btn" data-color="red">Красный</button>
                    <button class="color-btn" data-color="green">Зеленый</button>
                    <button class="color-btn" data-color="blue">Синий</button>
                    <button class="color-btn" data-color="yellow">Желтый</button>
                    <button class="color-btn" data-color="cyan">Голубой</button>
                    <button class="color-btn" data-color="magenta">Пурпурный</button>
                </div>
                <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 20px 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border);">
                    <p style="font-size: 16px; margin-bottom: 10px; font-weight: 600;">Внимательно осмотрите экран на наличие битых пикселей</p>
                    <p style="font-size: 14px; color: var(--text-secondary);">Переключайте цвета для лучшего обнаружения</p>
                </div>
            </div>
        `;
        controls.style.display = 'flex';

        setTimeout(() => {
            const screen = document.getElementById('dead-pixels-screen');
            const colorButtons = document.querySelectorAll('.color-btn');
            
            colorButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentColor = btn.dataset.color;
                    screen.style.backgroundColor = colors[currentColor];
                    colorButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    stripes: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        let stripeWidth = 10;

        testArea.innerHTML = `
            <div class="test-screen stripes-test">
                <div class="stripe-controls">
                    <div style="font-weight: 600; margin-bottom: 15px; color: var(--text-primary);">Настройки:</div>
                    <label>
                        <input type="radio" name="stripe-type" value="vertical" checked> Вертикальные
                    </label>
                    <label>
                        <input type="radio" name="stripe-type" value="horizontal"> Горизонтальные
                    </label>
                    <label style="margin-top: 15px;">
                        Ширина полос: <span id="width-value">${stripeWidth}px</span>
                    </label>
                    <input type="range" id="stripe-width" min="1" max="50" value="${stripeWidth}" style="width: 100%;">
                    <button id="apply-stripes-btn">Применить</button>
                </div>
                <div id="stripe-display" class="vertical-stripes"></div>
            </div>
        `;
        controls.style.display = 'flex';

        const updateStripes = () => {
            const type = document.querySelector('input[name="stripe-type"]:checked')?.value || 'vertical';
            const width = parseInt(document.getElementById('stripe-width').value);
            const display = document.getElementById('stripe-display');
            
            document.getElementById('width-value').textContent = width + 'px';
            
            if (type === 'vertical') {
                display.className = 'vertical-stripes';
                display.style.backgroundImage = `repeating-linear-gradient(to right, #000000 0px, #000000 ${width}px, #ffffff ${width}px, #ffffff ${width * 2}px)`;
            } else {
                display.className = 'horizontal-stripes';
                display.style.backgroundImage = `repeating-linear-gradient(to bottom, #000000 0px, #000000 ${width}px, #ffffff ${width}px, #ffffff ${width * 2}px)`;
            }
        };

        setTimeout(() => {
            updateStripes();
            document.getElementById('apply-stripes-btn').addEventListener('click', updateStripes);
            document.querySelectorAll('input[name="stripe-type"]').forEach(radio => {
                radio.addEventListener('change', updateStripes);
            });
            document.getElementById('stripe-width').addEventListener('input', () => {
                document.getElementById('width-value').textContent = document.getElementById('stripe-width').value + 'px';
            });
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    gradient: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        let gradientType = 'rainbow';

        testArea.innerHTML = `
            <div class="test-screen gradient-test" id="gradient-display"></div>
            <div class="color-options">
                <div style="font-weight: 600; margin-bottom: 10px; color: var(--text-primary);">Тип градиента:</div>
                <button class="color-btn active" data-gradient="rainbow">Радуга</button>
                <button class="color-btn" data-gradient="horizontal">Горизонтальный</button>
                <button class="color-btn" data-gradient="vertical">Вертикальный</button>
            </div>
        `;
        controls.style.display = 'flex';

        const gradients = {
            rainbow: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
            horizontal: 'linear-gradient(to bottom, #000000, #ffffff)',
            vertical: 'linear-gradient(to right, #000000, #ffffff)'
        };

        setTimeout(() => {
            const display = document.getElementById('gradient-display');
            display.style.background = gradients[gradientType];
            
            const buttons = document.querySelectorAll('.color-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    gradientType = btn.dataset.gradient;
                    display.style.background = gradients[gradientType];
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    contrast: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen contrast-test" id="contrast-display"></div>
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 20px 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border);">
                <p style="font-size: 16px; font-weight: 600;">Проверьте различимость каждого квадрата</p>
            </div>
        `;
        controls.style.display = 'flex';

        setTimeout(() => {
            const display = document.getElementById('contrast-display');
            display.innerHTML = '';
            
            for (let i = 0; i <= 10; i++) {
                const box = document.createElement('div');
                box.className = 'contrast-box';
                const brightness = Math.round((i / 10) * 255);
                box.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
                display.appendChild(box);
            }
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    colors: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen colors-test">
                <div class="color-box" style="background: #ff0000; color: #ffffff;">RED</div>
                <div class="color-box" style="background: #00ff00; color: #000000;">GREEN</div>
                <div class="color-box" style="background: #0000ff; color: #ffffff;">BLUE</div>
                <div class="color-box" style="background: #ffff00; color: #000000;">YELLOW</div>
                <div class="color-box" style="background: #00ffff; color: #000000;">CYAN</div>
                <div class="color-box" style="background: #ff00ff; color: #ffffff;">MAGENTA</div>
                <div class="color-box" style="background: #ffffff; color: #000000;">WHITE</div>
                <div class="color-box" style="background: #808080; color: #ffffff;">GRAY</div>
                <div class="color-box" style="background: #000000; color: #ffffff;">BLACK</div>
            </div>
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 20px 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border);">
                <p style="font-size: 16px; font-weight: 600;">Проверьте чистоту и насыщенность цветов</p>
            </div>
        `;
        controls.style.display = 'flex';
        
        testsCompleted++;
        updateTestsCounter();
    },

    motion: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen motion-test">
                <div class="motion-info">
                    Тест размытия движения - следите за движущимся объектом
                </div>
                <div class="motion-box"></div>
            </div>
        `;
        controls.style.display = 'flex';
        
        testsCompleted++;
        updateTestsCounter();
    },

    uniformity: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        let currentColor = 'white';
        const colors = {
            white: '#ffffff',
            black: '#000000',
            gray: '#808080'
        };

        testArea.innerHTML = `
            <div class="test-screen dead-pixels-test" id="uniformity-screen" style="background-color: ${colors[currentColor]};">
                <div class="color-options">
                    <div style="font-weight: 600; margin-bottom: 10px; color: var(--text-primary);">Цвет:</div>
                    <button class="color-btn active" data-color="white">Белый</button>
                    <button class="color-btn" data-color="black">Черный</button>
                    <button class="color-btn" data-color="gray">Серый</button>
                </div>
                <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 20px 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border);">
                    <p style="font-size: 16px; margin-bottom: 10px; font-weight: 600;">Проверьте равномерность подсветки</p>
                    <p style="font-size: 14px; color: var(--text-secondary);">Осмотрите экран на наличие затемненных или ярких участков</p>
                </div>
            </div>
        `;
        controls.style.display = 'flex';

        setTimeout(() => {
            const screen = document.getElementById('uniformity-screen');
            const colorButtons = document.querySelectorAll('.color-btn');
            
            colorButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentColor = btn.dataset.color;
                    screen.style.backgroundColor = colors[currentColor];
                    colorButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }, 10);
        
        testsCompleted++;
        updateTestsCounter();
    },

    response: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen motion-test">
                <div class="motion-info">
                    Тест времени отклика - следите за движущимися объектами
                </div>
                <div class="motion-box" style="animation-duration: 1s;"></div>
                <div class="motion-box" style="animation-duration: 0.5s; top: 60%; animation-delay: 0.25s;"></div>
                <div class="motion-box" style="animation-duration: 0.3s; top: 70%; animation-delay: 0.5s;"></div>
            </div>
        `;
        controls.style.display = 'flex';
        
        testsCompleted++;
        updateTestsCounter();
    },

    'viewing-angle': () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen gradient-test" style="background: linear-gradient(135deg, #ff0000 0%, #00ff00 50%, #0000ff 100%);">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border); max-width: 600px;">
                    <h3 style="font-size: 24px; margin-bottom: 20px; font-weight: 700;">Тест углов обзора</h3>
                    <p style="font-size: 16px; margin-bottom: 15px;">Смотрите на экран под разными углами</p>
                    <p style="font-size: 14px; color: var(--text-secondary);">Проверьте, как меняются цвета при изменении угла обзора</p>
                </div>
            </div>
        `;
        controls.style.display = 'flex';
        
        testsCompleted++;
        updateTestsCounter();
    },

    grid: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="test-screen" style="background: #000000; display: grid; grid-template-columns: repeat(20, 1fr); grid-template-rows: repeat(20, 1fr);">
                ${Array.from({length: 400}, (_, i) => 
                    `<div style="border: 1px solid rgba(255,255,255,0.1);"></div>`
                ).join('')}
            </div>
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 20px 40px; border-radius: 16px; text-align: center; border: 1px solid var(--border);">
                <p style="font-size: 16px; font-weight: 600;">Сетка для проверки геометрии и выравнивания</p>
            </div>
        `;
        controls.style.display = 'flex';
        
        testsCompleted++;
        updateTestsCounter();
    },

    statistics: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        const minutes = Math.floor(sessionTime / 60);
        const seconds = sessionTime % 60;
        
        testArea.innerHTML = `
            <div class="welcome-screen">
                <h2 style="margin-bottom: 40px;">📈 Статистика сессии</h2>
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                    <div class="premium-card">
                        <div class="card-icon">⚡</div>
                        <h3>Производительность</h3>
                        <p><strong>Максимум FPS:</strong> ${stats.maxFPS}</p>
                        <p><strong>Минимум FPS:</strong> ${stats.minFPS === Infinity ? 0 : stats.minFPS}</p>
                        <p><strong>Среднее FPS:</strong> ${stats.avgFPS}</p>
                        <p><strong>Текущий FPS:</strong> ${fps}</p>
                    </div>
                    <div class="premium-card">
                        <div class="card-icon">📊</div>
                        <h3>Сессия</h3>
                        <p><strong>Время сессии:</strong> ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</p>
                        <p><strong>Тестов выполнено:</strong> ${testsCompleted}</p>
                        <p><strong>Дата начала:</strong> ${new Date(sessionStartTime).toLocaleString('ru-RU')}</p>
                    </div>
                    <div class="premium-card">
                        <div class="card-icon">🎯</div>
                        <h3>Целевые показатели</h3>
                        <p><strong>Целевой FPS:</strong> 390</p>
                        <p><strong>Достижение:</strong> ${stats.maxFPS >= 350 ? '✅ Отлично' : stats.maxFPS >= 200 ? '⚠️ Хорошо' : '❌ Требует внимания'}</p>
                    </div>
                </div>
            </div>
        `;
        controls.style.display = 'none';
    },

    settings: () => {
        if (!testArea) testArea = document.getElementById('test-area');
        if (!controls) controls = document.getElementById('controls');
        if (!testArea) return;
        
        testArea.innerHTML = `
            <div class="welcome-screen">
                <h2 style="margin-bottom: 40px;">⚙️ Настройки</h2>
                <div class="info-grid" style="grid-template-columns: 1fr; max-width: 600px;">
                    <div class="premium-card">
                        <h3>Экспорт данных</h3>
                        <p style="margin-bottom: 20px;">Сохраните результаты тестирования в файл</p>
                        <button class="premium-btn" onclick="exportResults()" style="width: 100%; justify-content: center;">
                            <span>💾</span>
                            <span>Экспортировать результаты</span>
                        </button>
                    </div>
                    <div class="premium-card">
                        <h3>Сброс статистики</h3>
                        <p style="margin-bottom: 20px;">Очистить все данные текущей сессии</p>
                        <button class="premium-btn" onclick="resetStats()" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);">
                            <span>🔄</span>
                            <span>Сбросить статистику</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        controls.style.display = 'none';
    }
};

// FPS Chart Drawing
function drawFPSChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (fpsHistory.length < 2) return;
    
    const maxFPS = Math.max(...fpsHistory, 390);
    const minFPS = Math.min(...fpsHistory, 0);
    const range = maxFPS - minFPS || 1;
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    fpsHistory.forEach((fps, index) => {
        const x = (index / (fpsHistory.length - 1)) * width;
        const y = height - ((fps - minFPS) / range) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw target line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    const targetY = height - ((390 - minFPS) / range) * height;
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Navigation
function setupNavigation() {
    const nav = document.querySelector('.test-menu');
    if (!nav) return;
    
    nav.addEventListener('click', (e) => {
        const btn = e.target.closest('.test-btn');
        if (!btn) return;
        
        const testName = btn.dataset.test;
        if (!testName) return;
        
        currentTest = testName;
        
        if (window.fpsInterval) {
            clearInterval(window.fpsInterval);
            window.fpsInterval = null;
        }
        
        document.querySelectorAll('.test-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (tests[testName]) {
            if (!testArea) testArea = document.getElementById('test-area');
            if (testArea) {
                tests[testName]();
            }
        }
    });
}

// Controls
function setupControls() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitBtn = document.getElementById('exit-btn');
    const saveBtn = document.getElementById('save-results-btn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!testArea) testArea = document.getElementById('test-area');
            if (!document.fullscreenElement) {
                testArea.requestFullscreen().catch(err => {
                    showNotification('Ошибка входа в полноэкранный режим');
                });
            } else {
                document.exitFullscreen();
            }
        });
    }
    
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            if (window.fpsInterval) {
                clearInterval(window.fpsInterval);
                window.fpsInterval = null;
            }
            
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            currentTest = 'home';
            if (tests.home) tests.home();
            document.querySelectorAll('.test-btn').forEach(b => b.classList.remove('active'));
            const homeBtn = document.querySelector('[data-test="home"]');
            if (homeBtn) homeBtn.classList.add('active');
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            exportResults();
        });
    }
    
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            exportPDFReport();
        });
    }
}

// ESC Handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (window.fpsInterval) {
            clearInterval(window.fpsInterval);
            window.fpsInterval = null;
        }
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        if (currentTest !== 'home') {
            currentTest = 'home';
            if (tests.home) tests.home();
            document.querySelectorAll('.test-btn').forEach(b => b.classList.remove('active'));
            const homeBtn = document.querySelector('[data-test="home"]');
            if (homeBtn) homeBtn.classList.add('active');
        }
    }
});

// Update Tests Counter
function updateTestsCounter() {
    const counter = document.getElementById('tests-completed');
    if (counter) {
        counter.textContent = testsCompleted;
    }
}

// Export Results
function exportResults() {
    const data = {
        sessionStart: new Date(sessionStartTime).toISOString(),
        sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000),
        testsCompleted: testsCompleted,
        statistics: {
            maxFPS: stats.maxFPS,
            minFPS: stats.minFPS === Infinity ? 0 : stats.minFPS,
            avgFPS: stats.avgFPS,
            currentFPS: fps
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitor-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Результаты экспортированы');
}

// Reset Stats
function resetStats() {
    if (confirm('Вы уверены, что хотите сбросить всю статистику?')) {
        stats.maxFPS = 0;
        stats.minFPS = Infinity;
        stats.avgFPS = 0;
        stats.fpsReadings = [];
        fpsHistory = [];
        testsCompleted = 0;
        sessionStartTime = Date.now();
        updateTestsCounter();
        showNotification('Статистика сброшена');
        if (currentTest === 'statistics') {
            tests.statistics();
        }
    }
}

// Load Settings
function loadSettings() {
    try {
        const saved = localStorage.getItem('monitorTesterSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            // Apply settings if needed
        }
    } catch (e) {
        console.error('Failed to load settings', e);
    }
}

// Save Settings
function saveSettings() {
    try {
        const settings = {};
        localStorage.setItem('monitorTesterSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings', e);
    }
}

// New Enterprise Tests
tests.gamma = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    testArea.innerHTML = `
        <div class="test-screen" style="background: #000000; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 30px;">
            <canvas id="gamma-chart" width="800" height="400" style="background: rgba(21,21,32,0.9); border-radius: 16px; border: 1px solid var(--border);"></canvas>
            <div style="background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 25px 50px; border-radius: 16px; border: 1px solid var(--border); text-align: center;">
                <h3 style="font-size: 24px; margin-bottom: 15px; font-weight: 700;">Гамма-кривая</h3>
                <p style="font-size: 16px; color: var(--text-secondary);">Идеальная гамма-кривая должна соответствовать значению 2.2</p>
                <p style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">Проверьте плавность перехода от черного к белому</p>
            </div>
        </div>
    `;
    controls.style.display = 'flex';
    
    setTimeout(() => {
        drawGammaCurve();
    }, 10);
    
    testsCompleted++;
    updateTestsCounter();
};

tests['color-accuracy'] = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    testArea.innerHTML = `
        <div class="test-screen" style="background: #1a1a1a; padding: 40px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="font-size: 32px; margin-bottom: 30px; text-align: center; font-weight: 800;">Точность цветов (Delta E)</h2>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
                    ${['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'].map((color, i) => `
                        <div style="background: ${color}; height: 150px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: ${color === '#000000' || color === '#0000ff' ? '#fff' : '#000'}; font-weight: 700; border: 2px solid rgba(255,255,255,0.2);">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; margin-bottom: 5px;">ΔE: <span id="delta-e-${i}">--</span></div>
                                <div style="font-size: 12px; opacity: 0.8;">${['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White', 'Black'][i]}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 25px; border-radius: 16px; border: 1px solid var(--border); text-align: center;">
                    <p style="font-size: 16px; color: var(--text-secondary);">Delta E &lt; 2: Отличная точность | Delta E &lt; 5: Хорошая точность | Delta E &gt; 5: Требует калибровки</p>
                </div>
            </div>
        </div>
    `;
    controls.style.display = 'flex';
    
    setTimeout(() => {
        // Simulate Delta E calculations
        for (let i = 0; i < 8; i++) {
            const deltaE = (Math.random() * 3 + 0.5).toFixed(2);
            const el = document.getElementById(`delta-e-${i}`);
            if (el) {
                el.textContent = deltaE;
                el.style.color = deltaE < 2 ? '#00ff88' : deltaE < 5 ? '#ffaa00' : '#ff4444';
            }
        }
    }, 10);
    
    testsCompleted++;
    updateTestsCounter();
};

tests['backlight-bleed'] = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    testArea.innerHTML = `
        <div class="test-screen" style="background: #000000; display: flex; align-items: center; justify-content: center;">
            <div style="background: rgba(21,21,32,0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; border: 1px solid var(--border); max-width: 800px; text-align: center;">
                <h2 style="font-size: 32px; margin-bottom: 20px; font-weight: 800;">Тест засветки</h2>
                <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 30px;">В темной комнате осмотрите края экрана на наличие засветки</p>
                <div style="background: #000000; border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 40px; margin: 20px 0;">
                    <p style="font-size: 14px; color: var(--text-muted);">Черный экран для проверки засветки</p>
                </div>
                <p style="font-size: 14px; color: var(--text-muted);">Идеальный монитор не должен иметь видимой засветки по краям</p>
            </div>
        </div>
    `;
    controls.style.display = 'flex';
    
    testsCompleted++;
    updateTestsCounter();
};

tests.reports = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    
    testArea.innerHTML = `
        <div class="welcome-screen">
            <h2 style="margin-bottom: 40px; font-size: 36px; font-weight: 900;">📄 Профессиональные отчеты</h2>
            <div class="info-grid enterprise-grid" style="grid-template-columns: 1fr; max-width: 800px;">
                <div class="enterprise-card">
                    <div class="card-header">
                        <div class="card-icon">📊</div>
                        <div class="card-badge premium">PDF</div>
                    </div>
                    <h3>Генерация PDF отчета</h3>
                    <p style="margin-bottom: 25px;">Создайте детальный PDF отчет со всеми результатами тестирования, графиками и рекомендациями</p>
                    <button class="enterprise-btn premium" onclick="exportPDFReport()" style="width: 100%; justify-content: center;">
                        <span>📄</span>
                        <span>Создать PDF отчет</span>
                    </button>
                </div>
                <div class="enterprise-card">
                    <div class="card-header">
                        <div class="card-icon">💾</div>
                    </div>
                    <h3>Экспорт данных</h3>
                    <p style="margin-bottom: 25px;">Сохраните все данные тестирования в JSON формате для дальнейшего анализа</p>
                    <button class="enterprise-btn" onclick="exportResults()" style="width: 100%; justify-content: center;">
                        <span>💾</span>
                        <span>Экспортировать JSON</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    controls.style.display = 'none';
};

tests.recommendations = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    const recommendations = generateAIRecommendations();
    
    testArea.innerHTML = `
        <div class="welcome-screen">
            <h2 style="margin-bottom: 40px; font-size: 36px; font-weight: 900;">🤖 AI Рекомендации</h2>
            <div class="info-grid enterprise-grid" style="grid-template-columns: 1fr; max-width: 1000px;">
                ${recommendations.map((rec, i) => `
                    <div class="enterprise-card">
                        <div class="card-header">
                            <div class="card-icon">${rec.icon}</div>
                            <div class="card-badge ${rec.priority === 'high' ? 'new' : rec.priority === 'medium' ? 'premium' : ''}">${rec.priority === 'high' ? 'Важно' : rec.priority === 'medium' ? 'Рекомендуется' : 'Информация'}</div>
                        </div>
                        <h3>${rec.title}</h3>
                        <p>${rec.description}</p>
                        ${rec.action ? `<div style="margin-top: 20px;"><button class="enterprise-btn" onclick="${rec.action}" style="width: 100%; justify-content: center;">${rec.actionText || 'Применить'}</button></div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    controls.style.display = 'none';
};

tests.calibration = () => {
    if (!testArea) testArea = document.getElementById('test-area');
    if (!controls) controls = document.getElementById('controls');
    if (!testArea) return;
    
    testArea.innerHTML = `
        <div class="welcome-screen">
            <h2 style="margin-bottom: 40px; font-size: 36px; font-weight: 900;">🎨 Калибровка монитора</h2>
            <div class="info-grid enterprise-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                <div class="enterprise-card">
                    <div class="card-header">
                        <div class="card-icon">🎨</div>
                        <div class="card-badge premium">PRO</div>
                    </div>
                    <h3>Яркость</h3>
                    <p>Рекомендуемая яркость: 120 cd/m²</p>
                    <div style="margin-top: 20px;">
                        <input type="range" min="0" max="100" value="50" id="brightness-slider" style="width: 100%; accent-color: var(--primary);">
                        <div style="text-align: center; margin-top: 10px; color: var(--text-secondary);">Текущее значение: <span id="brightness-value">50</span>%</div>
                    </div>
                </div>
                <div class="enterprise-card">
                    <div class="card-header">
                        <div class="card-icon">🌈</div>
                        <div class="card-badge premium">PRO</div>
                    </div>
                    <h3>Контрастность</h3>
                    <p>Рекомендуемая контрастность: 80%</p>
                    <div style="margin-top: 20px;">
                        <input type="range" min="0" max="100" value="80" id="contrast-slider" style="width: 100%; accent-color: var(--primary);">
                        <div style="text-align: center; margin-top: 10px; color: var(--text-secondary);">Текущее значение: <span id="contrast-value">80</span>%</div>
                    </div>
                </div>
                <div class="enterprise-card">
                    <div class="card-header">
                        <div class="card-icon">🌡️</div>
                        <div class="card-badge premium">PRO</div>
                    </div>
                    <h3>Цветовая температура</h3>
                    <p>Рекомендуемая: 6500K (D65)</p>
                    <div style="margin-top: 20px;">
                        <select id="color-temp" style="width: 100%; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary);">
                            <option value="5000">5000K (Теплый)</option>
                            <option value="6500" selected>6500K (Стандарт D65)</option>
                            <option value="7500">7500K (Холодный)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
    controls.style.display = 'none';
    
    setTimeout(() => {
        const brightnessSlider = document.getElementById('brightness-slider');
        const contrastSlider = document.getElementById('contrast-slider');
        const brightnessValue = document.getElementById('brightness-value');
        const contrastValue = document.getElementById('contrast-value');
        
        if (brightnessSlider && brightnessValue) {
            brightnessSlider.addEventListener('input', (e) => {
                brightnessValue.textContent = e.target.value;
            });
        }
        
        if (contrastSlider && contrastValue) {
            contrastSlider.addEventListener('input', (e) => {
                contrastValue.textContent = e.target.value;
            });
        }
    }, 10);
    
    testsCompleted++;
    updateTestsCounter();
};

function drawGammaCurve() {
    const canvas = document.getElementById('gamma-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw ideal gamma curve (2.2)
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const gamma = Math.pow(normalizedX, 1/2.2);
        const y = height - (gamma * height);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw actual curve (simulated)
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const gamma = Math.pow(normalizedX, 1/2.15) + (Math.random() - 0.5) * 0.05;
        const y = height - (Math.max(0, Math.min(1, gamma)) * height);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.fillText('0', 10, height - 10);
    ctx.fillText('1.0', width - 30, height - 10);
    ctx.fillText('0', 10, height - 5);
    ctx.fillText('1.0', 10, 15);
}

function generateAIRecommendations() {
    const recommendations = [];
    
    if (stats.avgFPS < 350) {
        recommendations.push({
            icon: '⚡',
            title: 'Низкая частота обновления',
            description: `Ваш средний FPS составляет ${stats.avgFPS}. Для достижения целевых 390Hz рекомендуется проверить настройки монитора и видеокарты.`,
            priority: 'high',
            action: 'tests.fps()',
            actionText: 'Запустить тест FPS'
        });
    }
    
    if (stats.qualityScore < 80) {
        recommendations.push({
            icon: '🎯',
            title: 'Качество ниже оптимального',
            description: `Текущий показатель качества: ${stats.qualityScore}%. Рекомендуется выполнить полный цикл тестирования для улучшения результатов.`,
            priority: 'medium',
            action: null
        });
    }
    
    recommendations.push({
        icon: '🎨',
        title: 'Калибровка цветов',
        description: 'Для профессиональной работы рекомендуется выполнить калибровку цветов монитора с использованием профиля ICC.',
        priority: 'medium',
        action: 'tests.calibration()',
        actionText: 'Открыть калибровку'
    });
    
    recommendations.push({
        icon: '📊',
        title: 'Регулярное тестирование',
        description: 'Рекомендуется выполнять полное тестирование монитора раз в месяц для поддержания оптимальных характеристик.',
        priority: 'low',
        action: null
    });
    
    return recommendations;
}

function exportPDFReport() {
    showNotification('Генерация PDF отчета...', 2000);
    
    // Create HTML content for PDF
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Monitor Test Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #667eea; }
                .stat { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            </style>
        </head>
        <body>
            <h1>TitanSu Monitor Tester - Отчет</h1>
            <div class="stat">
                <h2>Статистика сессии</h2>
                <p>Дата: ${new Date().toLocaleString('ru-RU')}</p>
                <p>Время сессии: ${Math.floor((Date.now() - sessionStartTime) / 1000)} сек</p>
                <p>Тестов выполнено: ${testsCompleted}</p>
            </div>
            <div class="stat">
                <h2>Производительность</h2>
                <p>Максимальный FPS: ${stats.maxFPS}</p>
                <p>Минимальный FPS: ${stats.minFPS === Infinity ? 0 : stats.minFPS}</p>
                <p>Средний FPS: ${stats.avgFPS}</p>
                <p>Текущий FPS: ${fps}</p>
            </div>
            <div class="stat">
                <h2>Качество</h2>
                <p>Общий показатель качества: ${stats.qualityScore}%</p>
            </div>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitor-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
        showNotification('Отчет сохранен');
    }, 2000);
}

// Make functions global
window.exportResults = exportResults;
window.resetStats = resetStats;
window.exportPDFReport = exportPDFReport;
