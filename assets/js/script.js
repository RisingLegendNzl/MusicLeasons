document.addEventListener('DOMContentLoaded', () => {
    // --- State saving for inputs ---
    const allInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"]');
    const resetButton = document.getElementById('reset-button');
    const weeklyCheckboxes = document.querySelectorAll('#weekly-goals input[type="checkbox"]');

    const saveInputState = (input) => {
        if (input.type === 'checkbox') {
            localStorage.setItem(input.id, input.checked);
        } else if (input.type === 'text' || input.tagName.toLowerCase() === 'select') {
            localStorage.setItem(input.id, input.value);
        }
    };

    const loadInputState = () => {
        allInputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue !== null) {
                if (input.type === 'checkbox') {
                    input.checked = savedValue === 'true';
                } else {
                    input.value = savedValue;
                }
            }
        });
        // Also load state for the progression select dropdown
        const progressionSelect = document.getElementById('progression-select');
        const savedProgression = localStorage.getItem('progression-select');
        if (savedProgression) {
            progressionSelect.value = savedProgression;
        }
    };

    allInputs.forEach(input => {
        input.addEventListener('change', () => saveInputState(input));
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
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });
        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId);
        });
        localStorage.setItem('activeTab', tabId);
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            setActiveTab(tabId);
        });
    });

    // --- Chord Progression and Audio Playback ---
    const progressions = {
        prog1: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
        prog2: ['Fmaj7', 'Em7', 'Am7', 'D7'],
        prog3: ['Gadd9', 'Em7', 'Cmaj7', 'D7sus4']
    };

    const progressionSelect = document.getElementById('progression-select');
    const progressionDisplay = document.getElementById('progression-display');
    let currentAudio = null; // Prevent multiple audios playing at once

    const displayProgression = (progKey) => {
        progressionDisplay.innerHTML = ''; // Clear previous chords
        if (!progKey || !progressions[progKey]) return;

        progressions[progKey].forEach(chordName => {
            const chordButton = document.createElement('button');
            chordButton.className = 'chord-button';
            chordButton.textContent = chordName;
            chordButton.dataset.chord = chordName;
            progressionDisplay.appendChild(chordButton);
        });
    };

    progressionSelect.addEventListener('change', (e) => {
        displayProgression(e.target.value);
        saveInputState(e.target); // Save the selected progression
    });
    
    progressionDisplay.addEventListener('click', (e) => {
        if (e.target.classList.contains('chord-button')) {
            const chordName = e.target.dataset.chord;
            
            // Stop any currently playing audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Play the new audio
            const audioSrc = `assets/audio/${chordName}.mp3`; // Assumes .mp3 format
            currentAudio = new Audio(audioSrc);
            
            currentAudio.play().catch(error => {
                console.error("Error playing audio:", error);
                // Alert the user if the audio file is missing
                alert(`Could not play audio for ${chordName}. Make sure the file "${chordName}.mp3" exists in the "assets/audio/" folder.`);
            });
        }
    });

    // --- Initial Load ---
    const loadLastActiveTab = () => {
        const lastTabId = localStorage.getItem('activeTab');
        const lastTabExists = document.querySelector(`.tab-button[data-tab="${lastTabId}"]`);
        setActiveTab((lastTabId && lastTabExists) ? lastTabId : tabButtons[0].dataset.tab);
    };
    
    // Load all saved states on startup
    loadInputState();
    loadLastActiveTab();
    displayProgression(progressionSelect.value); // Display the saved progression on load

});
