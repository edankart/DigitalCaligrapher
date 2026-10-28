document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const petalsSlider = document.getElementById('petals');
    const strokeSlider = document.getElementById('stroke');
    const radiusSlider = document.getElementById('radius');
    const saveBtn = document.getElementById('saveBtn');
    const statusMsg = document.getElementById('statusMsg');
    const randomBtn = document.getElementById('randomBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const eraserBtn = document.getElementById('eraserBtn');

    // Tooltip Elements
    const tooltip = document.getElementById('culturalTooltip');
    const tooltipText = document.getElementById('tooltipText');

    // Timers
    let tooltipTimeout;
    let tooltipDelayTimeout;
    let isDraggingSlider = false; // Флаг, чтобы знать, что мы двигаем ползунок

    // Helper function to check current language
    function getCurrentLang() {
        return localStorage.getItem('siteLanguage') || 'en';
    }

    // Tabs & Modes
    const tabGenerator = document.getElementById('tabGenerator');
    const tabBrush = document.getElementById('tabBrush');
    const panelGenerator = document.getElementById('panelGenerator');
    const panelBrush = document.getElementById('panelBrush');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const colorBtns = document.querySelectorAll('.color-btn');

    let currentMode = 'generator';
    let currentColor = '#1a1a1a';
    let isEraserActive = false;
    let currentBrush = 'fine';
    let currentPalette = 'ming';

    // Canvas Setup
    const drawingCanvas = document.getElementById('drawingCanvas');
    const pencilCanvas = document.getElementById('pencilCanvas');

    drawingCanvas.width = 600; drawingCanvas.height = 600;
    pencilCanvas.width = 600; pencilCanvas.height = 600;

    const drawCtx = drawingCanvas.getContext('2d');
    const pencilCtx = pencilCanvas.getContext('2d');

    // --- TOOLTIP LOGIC ---
    function showTooltip(enMessage, cnMessage) {
        clearTimeout(tooltipTimeout);
        clearTimeout(tooltipDelayTimeout);

        const lang = getCurrentLang();
        tooltipText.innerText = (lang === 'cn') ? cnMessage : enMessage;

        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';

        tooltipTimeout = setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(20px)';
        }, 4000);
    }

    // --- GENERATOR DRAWING FUNCTION ---
    // --- RANDOMIZE SLIDERS ON LOAD ---
    function randomizeSliders() {
        const randomPetals = Math.floor(Math.random() * 22) + 3; // 3 to 24
        const randomStroke = Math.floor(Math.random() * 10) + 1; // 1 to 10
        const randomRadius = Math.floor(Math.random() * 230) + 50; // 50 to 280

        petalsSlider.value = randomPetals;
        strokeSlider.value = randomStroke;
        radiusSlider.value = randomRadius;

        document.getElementById('valPetals').innerText = randomPetals;
        document.getElementById('valStroke').innerText = randomStroke;
        document.getElementById('valRadius').innerText = randomRadius;
    }
    function drawGeneratorPattern() {
        drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawCtx.fillStyle = '#faf9f6';
        drawCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

        const petals = parseInt(petalsSlider.value);
        const strokeW = parseInt(strokeSlider.value);
        const radius = parseInt(radiusSlider.value);

        let primaryColor = '#000000';
        let secondaryColor = '#000000';

        if (currentPalette === 'ming') {
            primaryColor = '#1a1a1a';
            secondaryColor = '#2a52be';
        } else if (currentPalette === 'imperial') {
            primaryColor = '#e63946';
            secondaryColor = '#d4af37';
        } else if (currentPalette === 'bamboo') {
            primaryColor = '#2e8b57';
            secondaryColor = '#1a1a1a';
        }

        drawCtx.save();
        drawCtx.translate(drawingCanvas.width / 2, drawingCanvas.height / 2);
        drawCtx.lineWidth = strokeW;
        drawCtx.lineCap = 'round';
        drawCtx.lineJoin = 'round';

        for (let i = 0; i < petals; i++) {
            drawCtx.save();
            drawCtx.rotate((Math.PI * 2 / petals) * i);

            drawCtx.strokeStyle = primaryColor;
            drawCtx.beginPath();
            drawCtx.moveTo(0, 0);
            drawCtx.bezierCurveTo(radius * 0.5, -radius * 0.5, radius * 0.8, -radius * 0.2, 0, -radius);
            drawCtx.bezierCurveTo(-radius * 0.8, -radius * 0.2, -radius * 0.5, -radius * 0.5, 0, 0);
            drawCtx.stroke();

            drawCtx.strokeStyle = secondaryColor;
            drawCtx.beginPath();
            drawCtx.arc(0, -radius, strokeW * 2, 0, Math.PI * 2);
            drawCtx.stroke();

            drawCtx.restore();
        }

        drawCtx.strokeStyle = secondaryColor;
        drawCtx.beginPath();
        drawCtx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
        drawCtx.stroke();
        drawCtx.restore();
    }

    // Initialize p5
    new p5((p) => {
        p.setup = () => {
            p.noCanvas();
            randomizeSliders();
            drawGeneratorPattern();
        };

        // --- SLIDER LISTENERS ---

        // Start dragging
        [petalsSlider, strokeSlider, radiusSlider].forEach(slider => {
            slider.addEventListener('mousedown', () => isDraggingSlider = true);
            slider.addEventListener('touchstart', () => isDraggingSlider = true);
        });

        // Stop dragging (on global mouseup/touchend)
        document.addEventListener('mouseup', () => isDraggingSlider = false);
        document.addEventListener('touchend', () => isDraggingSlider = false);

        petalsSlider.addEventListener('input', (e) => {
            document.getElementById('valPetals').innerText = e.target.value;
            if (currentMode === 'generator') {
                drawGeneratorPattern();

                if (!isDraggingSlider) return; // Only show tooltip if user is actively dragging

                clearTimeout(tooltipDelayTimeout);
                tooltipDelayTimeout = setTimeout(() => {
                    // Check again if still dragging and in generator mode
                    if (isDraggingSlider && currentMode === 'generator') {
                        const val = parseInt(e.target.value);
                        if (val > 16) {
                            showTooltip(
                                "Dense patterns like this echo the intricate wood carvings of the Ming Dynasty.",
                                "这样密集的图案呼应了明代复杂的木雕艺术。"
                            );
                        } else if (val < 6) {
                            showTooltip(
                                "Simple, minimalist patterns reflect the Zen philosophy of 'less is more'.",
                                "简单、极简的图案反映了‘少即是多’的禅宗哲学。"
                            );
                        }
                    }
                }, 800);
            }
        });

        strokeSlider.addEventListener('input', (e) => {
            document.getElementById('valStroke').innerText = e.target.value;
            if (currentMode === 'generator') {
                drawGeneratorPattern();

                if (!isDraggingSlider) return;

                clearTimeout(tooltipDelayTimeout);
                tooltipDelayTimeout = setTimeout(() => {
                    if (isDraggingSlider && currentMode === 'generator' && e.target.value > 6) {
                        showTooltip(
                            "Thick strokes remind us of the bold brushwork in traditional Chinese calligraphy.",
                            "粗犷的笔触让人想起中国传统书法中大胆的运笔。"
                        );
                    }
                }, 800);
            }
        });

        radiusSlider.addEventListener('input', (e) => {
            document.getElementById('valRadius').innerText = e.target.value;
            if (currentMode === 'generator') drawGeneratorPattern();
        });

        randomBtn.addEventListener('click', () => {
            randomizeSliders();
            if (currentMode === 'generator') drawGeneratorPattern();
        });
    });

    // --- INK BRUSH LOGIC ---
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    drawingCanvas.addEventListener('mousedown', (e) => {
        if (currentMode !== 'brush') return;
        isDrawing = true;
        const { x, y } = getMousePos(drawingCanvas, e);
        lastX = x; lastY = y;
        drawCtx.beginPath();
        drawCtx.moveTo(x, y);
    });

    drawingCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing || currentMode !== 'brush') return;
        const { x, y } = getMousePos(drawingCanvas, e);

        const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        if (distance > 100) {
            lastX = x; lastY = y;
            drawCtx.beginPath();
            drawCtx.moveTo(x, y);
            return;
        }

        if (isEraserActive) {
            drawCtx.strokeStyle = '#faf9f6';
            drawCtx.lineWidth = 30;
            drawCtx.lineCap = 'round';
            drawCtx.lineJoin = 'round';
        } else {
            drawCtx.strokeStyle = currentColor;

            if (currentBrush === 'fine') {
                let thickness = 12 - (distance * 0.4);
                if (thickness < 1) thickness = 1;
                if (thickness > 12) thickness = 12;
                drawCtx.lineWidth = thickness;
                drawCtx.lineCap = 'round';
                drawCtx.lineJoin = 'round';
            }
            else if (currentBrush === 'broad') {
                let thickness = 25 - (distance * 0.1);
                if (thickness < 10) thickness = 10;
                if (thickness > 25) thickness = 25;
                drawCtx.lineWidth = thickness;
                drawCtx.lineCap = 'round';
                drawCtx.lineJoin = 'round';
            }
            else if (currentBrush === 'dry') {
                let thickness = 15 - (distance * 0.2);
                if (thickness < 2) thickness = 2;
                if (thickness > 15) thickness = 15;
                drawCtx.lineWidth = thickness;
                drawCtx.lineCap = 'butt';
                drawCtx.lineJoin = 'miter';

                for (let i = 0; i < 3; i++) {
                    let jitterX = (Math.random() - 0.5) * 4;
                    let jitterY = (Math.random() - 0.5) * 4;
                    drawCtx.lineTo(x + jitterX, y + jitterY);
                    drawCtx.stroke();
                    drawCtx.beginPath();
                    drawCtx.moveTo(x + jitterX, y + jitterY);
                }
            }
        }

        drawCtx.lineTo(x, y);
        drawCtx.stroke();
        drawCtx.beginPath();
        drawCtx.moveTo(x, y);
        lastX = x; lastY = y;
    });

    drawingCanvas.addEventListener('mouseup', () => isDrawing = false);
    drawingCanvas.addEventListener('mouseleave', () => isDrawing = false);

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    clearCanvasBtn.addEventListener('click', () => {
        if (currentMode === 'brush') {
            drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawCtx.fillStyle = '#faf9f6';
            drawCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        }
    });

    // --- TAB SWITCHING ---
    tabGenerator.addEventListener('click', () => {
        currentMode = 'generator';
        panelGenerator.style.display = 'block';
        panelBrush.style.display = 'none';
        tabGenerator.style.background = '#1a1a1a'; tabGenerator.style.color = 'white';
        tabBrush.style.background = '#f0f0f0'; tabBrush.style.color = '#1a1a1a';
        drawGeneratorPattern();
    });

    tabBrush.addEventListener('click', () => {
        currentMode = 'brush';
        panelGenerator.style.display = 'none';
        panelBrush.style.display = 'block';
        tabBrush.style.background = '#1a1a1a'; tabBrush.style.color = 'white';
        tabGenerator.style.background = '#f0f0f0'; tabGenerator.style.color = '#1a1a1a';
        drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawCtx.fillStyle = '#faf9f6';
        drawCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    });

    // Color Selection & Eraser
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentColor = btn.getAttribute('data-color');
            isEraserActive = false;
            colorBtns.forEach(b => b.style.border = '2px solid transparent');
            btn.style.border = '2px solid #1a1a1a';

            eraserBtn.style.backgroundColor = '#ffffff';
            eraserBtn.style.color = '#1a1a1a';
            eraserBtn.style.border = '1px solid #eaeaea';
        });
    });

    eraserBtn.addEventListener('click', () => {
        isEraserActive = true;
        colorBtns.forEach(b => b.style.border = '2px solid transparent');
        eraserBtn.style.backgroundColor = '#1a1a1a';
        eraserBtn.style.color = '#ffffff';
        eraserBtn.style.border = '1px solid #1a1a1a';
    });

    // --- SAVE & DOWNLOAD ---
    saveBtn.addEventListener('click', async () => {
        statusMsg.innerText = "Saving...";
        statusMsg.style.color = "orange";

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.drawImage(drawingCanvas, 0, 0);
        tempCtx.drawImage(pencilCanvas, 0, 0);

        const imageBase64 = tempCanvas.toDataURL("image/png");
        const settings = JSON.stringify({ mode: currentMode });

        try {
            const response = await fetch('/Studio/Save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: imageBase64, settings: settings })
            });

            if (response.ok) {
                statusMsg.innerText = "Masterpiece saved to gallery!";
                statusMsg.style.color = "green";
            } else {
                statusMsg.innerText = "Error saving image";
                statusMsg.style.color = "red";
            }
        } catch (error) {
            console.error(error);
            statusMsg.innerText = "Network error";
            statusMsg.style.color = "red";
        }
    });

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(drawingCanvas, 0, 0);
        tempCtx.drawImage(pencilCanvas, 0, 0);

        const link = document.createElement('a');
        link.download = `pattern-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL("image/png");
        link.click();
    });

    // --- PALETTE SWITCHING LOGIC ---
    const paletteBtns = document.querySelectorAll('.palette-btn');
    paletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paletteBtns.forEach(b => {
                b.style.border = '2px solid transparent';
                b.classList.remove('active-palette');
            });
            btn.style.border = '2px solid #1a1a1a';
            btn.classList.add('active-palette');

            currentPalette = btn.getAttribute('data-palette');

            if (currentMode === 'generator') {
                drawGeneratorPattern();
            }

            // Clear any active slider tooltips
            clearTimeout(tooltipDelayTimeout);

            if (currentPalette === 'ming') {
                showTooltip("Ming Porcelain: Blue and white ceramics that defined an era of trade and art.", "明代青花瓷：定义了贸易与艺术时代的蓝白陶瓷。");
            }
            if (currentPalette === 'imperial') {
                showTooltip("Imperial Silk: Red and gold were reserved for the Emperor, symbolizing power and prosperity.", "皇家丝绸：红色和金色是皇帝的专属，象征着权力和繁荣。");
            }
            if (currentPalette === 'bamboo') {
                showTooltip("Bamboo Forest: A symbol of resilience and integrity in Chinese culture.", "竹林：中国文化中坚韧与正直的象征。");
            }
        });
    });

    // --- BRUSH SWITCHING LOGIC ---
    const brushBtns = document.querySelectorAll('.brush-btn');
    brushBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            brushBtns.forEach(b => {
                b.style.border = '2px solid transparent';
                b.classList.remove('active-brush');
            });
            btn.style.border = '2px solid #1a1a1a';
            btn.classList.add('active-brush');

            currentBrush = btn.getAttribute('data-brush');

            isEraserActive = false;
            eraserBtn.style.backgroundColor = '#ffffff';
            eraserBtn.style.color = '#1a1a1a';
            eraserBtn.style.border = '1px solid #eaeaea';
        });
    });

    // --- PENCIL AUTO-DRAW LOGIC ---
    let idleTimeout;
    const idleTimeLimit = 4000;
    let isAutoDrawing = false;
    let animationFrameId;

    function resetIdleTimer() {
        clearTimeout(idleTimeout);

        if (isAutoDrawing) {
            isAutoDrawing = false;
            cancelAnimationFrame(animationFrameId);

            pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);

            if (currentMode === 'brush') {
                drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                drawCtx.fillStyle = '#faf9f6';
                drawCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            }
        }

        idleTimeout = setTimeout(startAutoDraw, idleTimeLimit);
    }

    function startAutoDraw() {
        if (currentMode !== 'brush') return;
        isAutoDrawing = true;

        drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawCtx.fillStyle = '#faf9f6';
        drawCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);

        let dropY = -50;
        const dropX = drawingCanvas.width / 2;

        function animateFall() {
            if (!isAutoDrawing) return;

            pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
            pencilCtx.font = "36px Arial";
            pencilCtx.fillText("✏️", dropX - 0, dropY - 10);

            dropY += 15;

            if (dropY < drawingCanvas.height / 2) {
                animationFrameId = requestAnimationFrame(animateFall);
            } else {
                dropY = drawingCanvas.height / 2 - 20;
                setTimeout(() => {
                    if (!isAutoDrawing) return;
                    pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
                    beginPencilDrawing();
                }, 150);
            }
        }

        animateFall();
    }

    function beginPencilDrawing() {
        drawCtx.strokeStyle = '#1a1a1a';
        drawCtx.lineWidth = 2;
        drawCtx.lineCap = 'round';
        drawCtx.lineJoin = 'round';

        const patternType = Math.floor(Math.random() * 3);

        const centerX = drawingCanvas.width / 2;
        const centerY = drawingCanvas.height / 2;

        let step = 0;
        let maxSteps = 800;
        let petals = Math.floor(Math.random() * 3) + 8;
        let radius = Math.floor(Math.random() * 50) + 180;

        let lastPencilX = centerX;
        let lastPencilY = centerY;

        function drawStep() {
            if (!isAutoDrawing) return;

            if (step > maxSteps) {
                let flyUpY = lastPencilY;
                let flyUpX = lastPencilX;
                let opacity = 1;

                function flyAway() {
                    if (opacity <= 0) {
                        pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
                        pencilCtx.globalAlpha = 1;
                        isAutoDrawing = false;
                        resetIdleTimer();
                        return;
                    }

                    pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
                    pencilCtx.globalAlpha = opacity;
                    pencilCtx.font = "36px Arial";

                    flyUpY -= 12;

                    pencilCtx.fillText("✏️", flyUpX - 0, flyUpY - 10);

                    opacity -= 0.04;

                    animationFrameId = requestAnimationFrame(flyAway);
                }

                flyAway();
                return;
            }

            pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);

            let x, y;

            if (patternType === 0) {
                const petalIndex = Math.floor(step / (maxSteps / petals));
                const stepInPetal = step % (maxSteps / petals);
                const progress = stepInPetal / (maxSteps / petals);

                const baseAngle = (Math.PI * 2 / petals) * petalIndex;
                const r = radius * Math.sin(progress * Math.PI);
                const petalAngle = baseAngle + (Math.sin(progress * Math.PI) * 0.4);

                x = centerX + Math.cos(petalAngle) * r;
                y = centerY + Math.sin(petalAngle) * r;

                if (stepInPetal === 0) {
                    drawCtx.beginPath();
                    drawCtx.moveTo(centerX, centerY);
                } else {
                    drawCtx.lineTo(x, y);
                    drawCtx.stroke();
                    drawCtx.beginPath();
                    drawCtx.moveTo(x, y);
                }

            } else if (patternType === 1) {
                const angle = step * 0.05;
                const r = radius * Math.sin(petals * angle) * Math.cos(angle * 0.5);
                x = centerX + Math.cos(angle) * r;
                y = centerY + Math.sin(angle) * r;

                if (step === 0) {
                    drawCtx.beginPath();
                    drawCtx.moveTo(x, y);
                } else {
                    drawCtx.lineTo(x, y);
                    drawCtx.stroke();
                    drawCtx.beginPath();
                    drawCtx.moveTo(x, y);
                }

            } else {
                const petalIndex = Math.floor(step / (maxSteps / petals));
                const stepInPetal = step % (maxSteps / petals);
                const progress = stepInPetal / (maxSteps / petals);

                const baseAngle = (Math.PI * 2 / petals) * petalIndex;
                const r = radius * Math.sin(progress * Math.PI) * 1.1;
                const petalAngle = baseAngle + (Math.sin(progress * Math.PI * 2) * 0.2);

                x = centerX + Math.cos(petalAngle) * r;
                y = centerY + Math.sin(petalAngle) * r;

                if (stepInPetal === 0) {
                    drawCtx.beginPath();
                    drawCtx.moveTo(centerX, centerY);
                } else {
                    drawCtx.lineTo(x, y);
                    drawCtx.stroke();
                    drawCtx.beginPath();
                    drawCtx.moveTo(x, y);
                }
            }

            pencilCtx.font = "36px Arial";
            pencilCtx.fillText("✏️", x - 0, y - 10);

            lastPencilX = x;
            lastPencilY = y;

            step++;

            setTimeout(drawStep, 15);
        }

        drawStep();
    }

    // Detect user activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    // --- SHARE LOGIC ---
    document.getElementById('shareBtn').addEventListener('click', () => {
        const shareText = "Check out my traditional pattern created with Digital Heritage!";
        const shareUrl = window.location.origin + '/Studio';

        if (navigator.share) {
            // Native share API (mobile)
            navigator.share({
                title: 'Digital Heritage Pattern',
                text: shareText,
                url: shareUrl
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback: Open Twitter/X intent
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
        }
    });
    resetIdleTimer();
});