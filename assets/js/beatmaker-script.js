document.addEventListener('DOMContentLoaded', () => {
    const tracksContainer = document.getElementById('tracks');
    const playPauseBtn = document.getElementById('play-pause');
    const clearBtn = document.getElementById('clear');
    const tempoInput = document.getElementById('tempo');

    const sounds = {
        kick: new Audio('assets/audio/kick.wav'),
        snare: new Audio('assets/audio/snare.wav'),
        hihat: new Audio('assets/audio/hihat.wav')
    };

    const numSteps = 16;
    let isPlaying = false;
    let currentStep = 0;
    let tempo = 120;
    let intervalId = null;

    // --- Initialization ---

    function createSteps() {
        tracksContainer.querySelectorAll('.steps').forEach(track => {
            track.innerHTML = ''; // Clear existing steps if any
            for (let i = 0; i < numSteps; i++) {
                const step = document.createElement('div');
                step.classList.add('step');
                step.dataset.step = i;
                track.appendChild(step);
            }
        });
    }

    // --- Sequencer Logic ---

    function playLoop() {
        intervalId = setInterval(() => {
            const allSteps = tracksContainer.querySelectorAll('.step');
            const currentColumn = tracksContainer.querySelectorAll(`[data-step="${currentStep}"]`);

            // Update visual playhead
            allSteps.forEach(s => s.classList.remove('playing'));
            currentColumn.forEach(s => s.classList.add('playing'));

            // Play sounds for active steps in the current column
            tracksContainer.querySelectorAll('.track').forEach(track => {
                const step = track.querySelector(`[data-step="${currentStep}"]`);
                if (step.classList.contains('active')) {
                    const soundName = track.querySelector('.steps').dataset.sound;
                    playSound(soundName);
                }
            });

            currentStep = (currentStep + 1) % numSteps;
        }, (60 / tempo) * 1000 / 4); // 16th note interval
    }

    function playSound(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].currentTime = 0; // Rewind to start
            sounds[soundName].play();
        }
    }

    function startSequencer() {
        if (isPlaying) return;
        isPlaying = true;
        playPauseBtn.textContent = 'Pause';
        playLoop();
    }

    function stopSequencer() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = 'Play';
        clearInterval(intervalId);
        tracksContainer.querySelectorAll('.step').forEach(s => s.classList.remove('playing'));
    }

    // --- Event Listeners ---

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSequencer();
        } else {
            startSequencer();
        }
    });

    clearBtn.addEventListener('click', () => {
        tracksContainer.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
    });

    tempoInput.addEventListener('input', (e) => {
        const newTempo = parseInt(e.target.value, 10);
        if (newTempo >= 60 && newTempo <= 200) {
            tempo = newTempo;
            if (isPlaying) {
                stopSequencer();
                startSequencer();
            }
        }
    });

    tracksContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('step')) {
            e.target.classList.toggle('active');
        }
    });

    // --- Run on Load ---
    createSteps();
});
