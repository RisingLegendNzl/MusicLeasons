document.addEventListener('DOMContentLoaded', () => {
    const allInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"]');
    const resetButton = document.getElementById('reset-button');
    const weeklyCheckboxes = document.querySelectorAll('#weekly-goals input[type="checkbox"]');

    // Function to save the state of an input to localStorage
    const saveState = (input) => {
        if (input.type === 'checkbox') {
            localStorage.setItem(input.id, input.checked);
        } else if (input.type === 'text') {
            localStorage.setItem(input.id, input.value);
        }
    };

    // Function to load the state of all inputs from localStorage
    const loadState = () => {
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

    // Add event listeners to all inputs to save state on change
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveState(input);
        });
    });

    // Reset button functionality
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Confirm with the user before resetting
            if (confirm('Are you sure you want to reset the weekly goals? This cannot be undone.')) {
                weeklyCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    localStorage.removeItem(checkbox.id); // Remove from storage
                });
            }
        });
    }

    // Load the saved state when the page loads
    loadState();
});
