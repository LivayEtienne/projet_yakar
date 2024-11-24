// Fonction pour récupérer l'historique des températures et humidités
async function getHistorique() {
    try {
        const response = await fetch('http://localhost:3000/api/temperatures/historique');  // Appel à l'API backend
        if (!response.ok) {
            throw new Error('Impossible de récupérer les données.');
        }
        const data = await response.json();  // Récupérer les données en format JSON

        // Sélectionner le tableau et vider son contenu existant
        const tbody = document.querySelector('#historique-table tbody');
        tbody.innerHTML = '';

        // Ajouter chaque ligne de données dans le tableau
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${item.temperature} °C</td>
                <td>${item.humidity} %</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        // Afficher un message d'erreur si l'appel échoue
        document.querySelector('#error-message').style.display = 'block';
        document.querySelector('#error-message').textContent = error.message;
    }
}

// Appeler la fonction dès que la page est chargée
window.onload = getHistorique;

// Fonction pour récupérer la moyenne hebdomadaire des températures et humidités
async function getWeeklyAverage() {
    try {
        const response = await fetch('http://localhost:3000/api/average-weekly');  // Appel à l'API backend
        if (!response.ok) {
            throw new Error('Impossible de récupérer les moyennes hebdomadaires.');
        }
        const data = await response.json();  // Récupérer les données en format JSON

        // Sélectionner le tableau de la moyenne hebdomadaire et vider son contenu existant
        const tbody = document.querySelector('#weekly-average-table tbody');
        tbody.innerHTML = '';

        // Ajouter chaque ligne de données dans le tableau
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.week}</td>
                <td>${item.averageTemperature.toFixed(2)} °C</td>
                <td>${item.averageHumidity.toFixed(2)} %</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des moyennes hebdomadaires:', error);
    }
}

// Appeler la fonction dès que la page est chargée
window.onload = function() {
    getHistorique();  // Appel pour l’historique des données
    getWeeklyAverage();  // Appel pour la moyenne hebdomadaire
};

// Fonction pour filtrer les données selon la période choisie
async function filterData() {
    const period = document.querySelector('#filter-period').value;  // Récupérer la valeur sélectionnée
    try {
        const response = await fetch(`http://localhost:3000/api/temperatures/filter?period=${period}`);
        if (!response.ok) {
            throw new Error('Impossible de récupérer les données filtrées.');
        }
        const data = await response.json();
        updateHistory(data);  // Mettre à jour l'affichage avec les données filtrées
    } catch (error) {
        console.error('Erreur lors du filtrage des données :', error);
    }
}

// Fonction pour obtenir la couleur de la température en fonction de sa valeur
function getTemperatureColor(temp) {
    if (temp > 30) {
        return 'red';  // Température chaude
    } else if (temp < 0) {
        return 'blue';  // Température froide
    } else {
        return 'black';  // Température normale
    }
}

// Mise à jour de l'affichage de l'historique avec la couleur appropriée
function updateHistory(data) {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';  // Vider le tableau existant

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td style="color: ${getTemperatureColor(item.temperature)}">${item.temperature} °C</td>
            <td>${item.humidity} %</td>
        `;
        tbody.appendChild(row);
    });
}

// Appel API pour récupérer les données et mettre à jour l'affichage
async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/temperatures');
        const data = await response.json();
        updateHistory(data);  // Mettre à jour l'affichage de l'historique
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Initialisation de l'affichage des données
fetchData();
