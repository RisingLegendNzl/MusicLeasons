document.addEventListener('DOMContentLoaded', () => {
    // --- State saving for inputs ---
    const allInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"], textarea');
    const resetButton = document.getElementById('reset-button');
    const weeklyCheckboxes = document.querySelectorAll('#weekly-goals input[type="checkbox"]');

    const saveInputState = (input) => {
        const id = input.id;
        if (input.type === 'checkbox') {
            localStorage.setItem(id, input.checked);
        } else { // Handles text, textarea
            localStorage.setItem(id, input.value);
        }
    };

    const loadInputState = () => {
        allInputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue !== null) {
                if (input.type === 'checkbox') {
                    input.checked = (savedValue === 'true');
                } else {
                    input.value = savedValue;
                }
            }
        });
    };

    allInputs.forEach(input => {
        input.addEventListener('input', () => saveInputState(input));
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the weekly goals? This cannot be undone.')) {
                weeklyCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    localStorage.removeItem(checkbox.id);
                });
            }
        });
    }

    // --- Tab Functionality ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    const setActiveTab = (tabId) => {
        if (!tabId) return;
        tabButtons.forEach(button => button.classList.toggle('active', button.dataset.tab === tabId));
        tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === tabId));
        localStorage.setItem('activeTab', tabId);
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
    });

    // --- Metronome Functionality ---
    const metronomeElement = document.querySelector('.metronome');
    if (metronomeElement) {
        const bpmValueSpan = document.getElementById('bpm-value');
        const bpmSlider = document.getElementById('bpm-slider');
        const startStopBtn = document.getElementById('start-stop-metronome');
        const decreaseBtn = document.getElementById('decrease-bpm');
        const increaseBtn = document.getElementById('increase-bpm');
        
        let bpm = 100;
        let isPlaying = false;
        let metronomeInterval = null;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const updateBpm = (newValue) => {
            bpm = parseInt(newValue, 10);
            bpmValueSpan.textContent = bpm;
            bpmSlider.value = bpm;
        };

        const playTick = () => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A 'tick' sound
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            gain.gain.setValueAtTime(1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        };

        const startMetronome = () => {
            isPlaying = true;
            startStopBtn.textContent = 'Stop';
            startStopBtn.style.backgroundColor = 'var(--accent-active)';
            const interval = 60000 / bpm;
            metronomeInterval = setInterval(playTick, interval);
        };

        const stopMetronome = () => {
            isPlaying = false;
            startStopBtn.textContent = 'Start';
            startStopBtn.style.backgroundColor = 'var(--accent-primary)';
            clearInterval(metronomeInterval);
        };

        startStopBtn.addEventListener('click', () => {
            if(audioContext.state === 'suspended') audioContext.resume();
            isPlaying ? stopMetronome() : startMetronome();
        });

        bpmSlider.addEventListener('input', (e) => updateBpm(e.target.value));
        decreaseBtn.addEventListener('click', () => updateBpm(bpm - 1));
        increaseBtn.addEventListener('click', () => updateBpm(bpm + 1));
    }

    // --- Strumming Visualizer ---
    const visualizer = document.getElementById('strum-visualizer');
    if (visualizer) {
        const arrows = visualizer.querySelectorAll('.strum-arrow');
        const pattern = [0, 1, 2, 4, 5, 6]; // Indices of arrows to light up
        let beat = 0;
        setInterval(() => {
            arrows.forEach(arrow => arrow.classList.remove('active'));
            if (pattern.includes(beat)) {
                 const currentArrow = arrows[Math.floor(beat / 2)];
                 if(currentArrow) currentArrow.classList.add('active');
            }
            beat = (beat + 1) % 8; // 8 sixteenth notes in a bar
        }, 150); // Corresponds to 100 BPM (60000 / 100 / 4)
    }

    // --- Initial Load ---
    const loadLastActiveTab = () => {
        const lastTabId = localStorage.getItem('activeTab');
        const lastTabExists = document.querySelector(`.tab-button[data-tab="${lastTabId}"]`);
        setActiveTab((lastTabId && lastTabExists) ? lastTabId : (tabButtons.length > 0 ? tabButtons[0].dataset.tab : null));
    };
    
    // Load all saved states on startup
    if (document.querySelector('.tabs-container')) {
        loadInputState();
        loadLastActiveTab();
    }
});
