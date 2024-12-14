document.addEventListener("DOMContentLoaded", function() {
    // Elements
const envelopeIcon = document.querySelector('.fa-user');
const envelopeDropdown = document.getElementById('envelope-dropdown');
const overlay = document.getElementById('overlay');


envelopeIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent other listeners from interfering
    const isVisible = envelopeDropdown.style.display === 'block';
    envelopeDropdown.style.display = isVisible ? 'none' : 'block';
    overlay.style.display = isVisible ? 'none' : 'block';
});

// Close dropdown when overlay is clicked
overlay.addEventListener('click', () => {
    envelopeDropdown.style.display = 'none';
    overlay.style.display = 'none';
});



    const menuIcon = document.getElementById('menu-icon');
    const dropdownWrap = document.getElementById('dropdown-wrap');
    

    // Toggle dropdown visibility
    menuIcon.addEventListener('click', () => {
        dropdownWrap.style.display = dropdownWrap.style.display === 'block' ? 'none' : 'block';
        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    });

    // Hide dropdown when clicking on overlay
    overlay.addEventListener('click', () => {
        dropdownWrap.style.display = 'none';
        overlay.style.display = 'none';
    });

    const customSelects = document.querySelectorAll(".custom-select");

    function updateSelectedOptions(customSelect) {
        const selectedOptions = Array.from(customSelect.querySelectorAll(".option.active"))
            .filter(option => option !== customSelect.querySelector(".option.all-tags", ".option.clear-all"))
            .map(function(option) {
                return {
                    value: option.getAttribute("data-value"),
                    text: option.textContent.trim()
                };
            });

        const selectedValues = selectedOptions.map(function(option) {
            return option.value;
        });

        customSelect.querySelector(".tags_input").value = selectedValues.join(', ');

        let tagsHTML = "";

        if (selectedOptions.length === 0) {
            tagsHTML = '<span class="placeholder">Select the Area</span>';
        } else {
            const maxTagsToShow = 2;
            let additionalTagsCount = 0;

            selectedOptions.forEach(function(option, index) {
                if (index < maxTagsToShow) {
                    tagsHTML += '<span class="tag">' + option.text + '<span class="remove-tag" data-value="' + option.value + '">&times;</span></span>';
                } else {
                    additionalTagsCount++;
                }
            });

            if (additionalTagsCount > 0) {
                tagsHTML += '<span class="tag">+' + additionalTagsCount + '</span>';
            }
        }

        customSelect.querySelector(".selected-options").innerHTML = tagsHTML;
    }

    customSelects.forEach(function(customSelect) {
        const searchInput = customSelect.querySelector(".search-tags");
        const optionsContainer = customSelect.querySelector(".options");
        const noResultMessage = customSelect.querySelector(".no-result-message");
        const options = customSelect.querySelectorAll(".option");
        const allTagsOption = customSelect.querySelector(".option.all-tags");
        const clearButton = customSelect.querySelector(".clear");
        const clearAllButton = customSelect.querySelector(".option.clear-all");

        // Handle Clear All button - this should not be treated like a regular option
        clearAllButton.addEventListener("click", function() {
            // Remove "active" class from all options except "Clear All"
            options.forEach(function(option) {
                option.classList.remove("active");
            });
            updateSelectedOptions(customSelect);
        });

        clearButton.addEventListener("click", function() {
            searchInput.value = "";
            options.forEach(function(option) {
                option.style.display = "block";
            });
            noResultMessage.style.display = "none";
        });

        allTagsOption.addEventListener("click", function() {
            const isActive = !allTagsOption.classList.contains("active"); // Toggle active state for "Select All"

            // Toggle active state for all options except "Clear All" and "Select All"
            options.forEach(function(option) {
                if (option !== allTagsOption && option !== clearAllButton) {
                    option.classList.toggle("active", isActive);
                }
            });

            // Toggle "Select All" option as active or inactive
            allTagsOption.classList.toggle("active", isActive);

            // Update the selected options
            updateSelectedOptions(customSelect);
        });

        searchInput.addEventListener("input", function() {
            const searchTerm = searchInput.value.toLowerCase();

            options.forEach(function(option) {
                const optionText = option.textContent.trim().toLowerCase();
                const shouldShow = optionText.includes(searchTerm);
                option.style.display = shouldShow ? "block" : "none";
            });

            const anyOptionsMatch = Array.from(options).some(option => option.style.display === "block");
            noResultMessage.style.display = anyOptionsMatch ? "none" : "block";

            if (searchTerm) {
                optionsContainer.classList.add("option-search-active");
            } else {
                optionsContainer.classList.remove("option-search-active");
            }
        });

        options.forEach(function(option) {
            option.addEventListener("click", function() {
                if (!option.classList.contains("clear-all")) { // Prevent "Clear All" from being toggled as active
                    option.classList.toggle("active");
                    updateSelectedOptions(customSelect);
                }
            });
        });
    });

    // *** Change Made Here ***
    document.addEventListener("click", function(event) {
        const removeTag = event.target.closest(".remove-tag");
        if (removeTag) {
            const customSelect = removeTag.closest(".custom-select");
            const valueToRemove = removeTag.getAttribute("data-value");

            // Find the corresponding option and deactivate it
            const optionToRemove = customSelect.querySelector(`.option[data-value='${valueToRemove}']`);
            if (optionToRemove) {
                optionToRemove.classList.remove("active");
            }

            // Update the displayed tags
            updateSelectedOptions(customSelect);
        }
    });
    // *** Change Ends Here ***

    const selectBoxes = document.querySelectorAll(".select-box");

    selectBoxes.forEach(function(selectBox) {
        selectBox.addEventListener("click", function(event) {
            if (!event.target.closest(".tag")) {
                selectBox.parentNode.classList.toggle("open");
            }
        });
    });

    document.addEventListener("click", function(event) {
        customSelects.forEach(function(customSelect) {
            if (!event.target.closest(".custom-select") && !event.target.classList.contains("remove-tag")) {
                customSelect.classList.remove("open");
            }
        });
    });

    function resetCustomSelects() {
        customSelects.forEach(function(customSelect) {
            customSelect.querySelectorAll(".option.active").forEach(function(option) {
                option.classList.remove("active");
            });
            customSelect.querySelector(".option.all-tags").classList.remove("active");
            updateSelectedOptions(customSelect);
        });
    }

    updateSelectedOptions(customSelects[0]);

    const submitButton = document.querySelector(".btn_submit");

    submitButton.addEventListener("click", function() {
        let valid = true;

        customSelects.forEach(function(customSelect) {
            const selectedOptions = customSelect.querySelectorAll(".option.active");

            if (selectedOptions.length === 0) {
                const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
                tagErrorMsg.textContent = "This field is required";
                tagErrorMsg.style.display = "block";
                valid = false;
            } else {
                const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
                tagErrorMsg.textContent = "";
                tagErrorMsg.style.display = "none";
            }
        });

        if (valid) {
            let tags = document.querySelector(".tags_input").value;
            alert(tags);
            resetCustomSelects();
            return;
        }
    });
});
