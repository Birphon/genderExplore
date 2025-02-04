let traitsData;
let selections = new Map();
let filteredData = [];

// Fetch and load the JSON data
async function loadData() {
    try {
        const response = await fetch('data.json');
        traitsData = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function createSelectionBoxes(index) {
    return `
        <div class="selection-boxes" data-index="${index}">
            <div class="box blue" onclick="selectBox(${index}, 'blue')"></div>
            <div class="box white" onclick="selectBox(${index}, 'white')"></div>
            <div class="box grey" onclick="selectBox(${index}, 'grey')"></div>
            <div class="box pink" onclick="selectBox(${index}, 'pink')"></div>
        </div>
    `;
}

function populateTable(category = 'all') {
    const tbody = document.getElementById('traitsTable');
    tbody.innerHTML = '';
    let index = 0;

    traitsData.categories.forEach(cat => {
        if (category === 'all' || category === cat.name) {
            cat.subcategories.forEach(subcat => {
                subcat.traits.forEach(trait => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-category>${cat.name}</td>
                        <td data-subcategory>${subcat.name}</td>
                        <td>${trait.masculine}</td>
                        <td>${createSelectionBoxes(index)}</td>
                        <td>${trait.feminine}</td>
                    `;
                    tbody.appendChild(row);
                    index++;
                });
            });
        }
    });

    // Restore selections
    selections.forEach((value, key) => {
        const boxes = document.querySelector(`[data-index="${key}"]`);
        if (boxes) {
            boxes.querySelector(`.box.${value}`).classList.add('selected');
        }
    });

    updateProgress();
}

function selectBox(index, type) {
    const boxes = document.querySelector(`[data-index="${index}"]`);
    boxes.querySelectorAll('.box').forEach(box => box.classList.remove('selected'));
    boxes.querySelector(`.box.${type}`).classList.add('selected');
    selections.set(index, type);
    updateProgress();
}

function calculateGenderExpression(counts, total) {
    // Define weights for different selections
    const weights = {
        blue: { masc: 1.0, fem: 0.0, neutral: 0.0 },
        pink: { masc: 0.0, fem: 1.0, neutral: 0.0 },
        grey: { masc: 0.5, fem: 0.5, neutral: 1.0 },
        white: { masc: 0.3, fem: 0.3, neutral: 0.8 }
    };

    // Calculate weighted scores
    let mascScore = 0;
    let femScore = 0;
    let neutralScore = 0;

    Object.entries(counts).forEach(([type, count]) => {
        mascScore += (count / total) * weights[type].masc;
        femScore += (count / total) * weights[type].fem;
        neutralScore += (count / total) * weights[type].neutral;
    });

    // Normalize scores
    const totalScore = mascScore + femScore + neutralScore;
    mascScore = (mascScore / totalScore) * 100;
    femScore = (femScore / totalScore) * 100;
    neutralScore = (neutralScore / totalScore) * 100;

    // Determine primary and secondary expressions
    const expressions = [];

    // Binary expressions
    if (mascScore > 65) expressions.push(["Male", mascScore]);
    if (femScore > 65) expressions.push(["Female", femScore]);

    // Non-binary expressions
    if (mascScore > 45 && mascScore <= 65) expressions.push(["TransMasc", mascScore]);
    if (femScore > 45 && femScore <= 65) expressions.push(["TransFem", femScore]);
    if (neutralScore > 40) expressions.push(["Non-binary", neutralScore]);
    if (Math.abs(mascScore - femScore) < 20) expressions.push(["Androgynous", (mascScore + femScore) / 2]);
    if (counts.grey > total * 0.3) expressions.push(["Genderfluid", (counts.grey / total) * 100]);

    // Sort by score
    expressions.sort((a, b) => b[1] - a[1]);

    return expressions;
}

function updateScoreSection(counts, total) {
    const scoreSection = document.getElementById('scoreSection');
    const percentages = document.getElementById('percentages');
    const primaryExpression = document.getElementById('primaryExpression');
    const secondaryExpressions = document.getElementById('secondaryExpressions');

    // Update percentages
    percentages.innerHTML = '';
    const types = {
        blue: 'Masculine',
        pink: 'Feminine',
        grey: 'Both',
        white: 'Either'
    };

    Object.entries(counts).forEach(([type, count]) => {
        if (count > 0) {
            const percentage = ((count / total) * 100).toFixed(1);
            const item = document.createElement('div');
            item.className = 'percentage-item';
            item.innerHTML = `
                <span>${types[type]}</span>
                <span>${percentage}%</span>
            `;
            percentages.appendChild(item);
        }
    });

    // Calculate and update gender expressions
    const expressions = calculateGenderExpression(counts, total);
    
    // Update primary expression
    if (expressions.length > 0) {
        primaryExpression.innerHTML = `
            <div class="expression-item">
                <span>${expressions[0][0]}</span>
                <span>${expressions[0][1].toFixed(1)}%</span>
            </div>
        `;
    }

    // Update secondary expressions
    secondaryExpressions.innerHTML = expressions.slice(1).map(([expr, score]) => `
        <div class="expression-item">
            <span>${expr}</span>
            <span>${score.toFixed(1)}%</span>
        </div>
    `).join('');

    // Show the score section
    scoreSection.style.display = 'block';
}

function updateProgress() {
    const counts = {
        blue: 0,
        pink: 0,
        grey: 0,
        white: 0
    };

    // Count selections
    selections.forEach(type => {
        counts[type]++;
    });

    // Calculate total selected
    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
    if (totalSelected === 0) return;

    // Calculate percentages
    const progress = document.querySelector('.progress');
    progress.innerHTML = '';

    Object.entries(counts).forEach(([type, count]) => {
        if (count > 0) {
            const percentage = (count / totalSelected) * 100;
            const segment = document.createElement('div');
            segment.className = `progress-segment progress-${type}`;
            segment.style.width = `${percentage}%`;
            progress.appendChild(segment);
        }
    });

    // Check if all traits have been selected
    const totalTraits = document.querySelectorAll('.selection-boxes').length;
    if (totalSelected === totalTraits) {
        updateScoreSection(counts, totalSelected);
    } else {
        document.getElementById('scoreSection').style.display = 'none';
    }
}

function initializeCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(traitsData.categories.map(cat => cat.name));
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', (e) => {
        populateTable(e.target.value);
    });
}

function initializePage() {
    initializeCategoryFilter();
    populateTable();
}

// Make functions available globally
window.selectBox = selectBox;

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadData);