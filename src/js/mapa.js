(function() {

    // Logical Or
    const lat = 19.73146275420665;
    const lng = -99.95778290450444;
    const mapa = L.map('mapa').setView([lat, lng ], 16);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()
