document.addEventListener('DOMContentLoaded', () => {
    // --- State saving for inputs ---
    const allInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"]');
    const resetButton = document.getElementById('reset-button');
    const weeklyCheckboxes = document.querySelectorAll('#weekly-goals input[type="checkbox"]');

    const saveInputState = (input) => {
        if (input.type === 'checkbox') {
            localStorage.setItem(input.id, input.checked);
        } else if (input.type === 'text') {
            localStorage.setItem(input.id, input.value);
        }
    };

    const loadInputState = () => {
        allInputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue !== null) {
                if (input.type === 'checkbox') {
                    // Convert string 'true'/'false' back to boolean
                    input.checked = savedValue === 'true';
                } else if (input.type === 'text') {
                    input.value = savedValue;
                }
            }
        });
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
        // Save the active tab to localStorage
        localStorage.setItem('activeTab', tabId);
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            setActiveTab(tabId);
        });
    });

    // --- Initial Load ---
    const loadLastActiveTab = () => {
        const lastTabId = localStorage.getItem('activeTab');
        // Check if the saved tab ID exists as a button
        const lastTabExists = document.querySelector(`.tab-button[data-tab="${lastTabId}"]`);

        if (lastTabId && lastTabExists) {
            setActiveTab(lastTabId);
        } else {
            // Default to the first tab if none is saved or if the saved one is invalid
            setActiveTab(tabButtons[0].dataset.tab);
        }
    };
    
    // Load all saved states on startup, but only if we are on the guitar page
    if (document.querySelector('.tabs-container')) {
        loadInputState();
        loadLastActiveTab();
    }
});
