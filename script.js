let selectElement = document.getElementById("movie");
let containerDivElement = document.getElementById("container");
let numberRows = document.getElementById("rows");
let numberSeats = document.getElementById("numberSeats");
let countElement = document.getElementById("count");
let totalElement = document.getElementById("total");
let screenDiv; // Declaramos screenDiv como una variable global
let counterSeatSelected = 0;
let totalPrice = 0;
let optionElement;
let data;
let movieImages = [];

numberRows.addEventListener('input', createSeats);
numberSeats.addEventListener('input', createSeats);
selectElement.addEventListener('change', function () {
    const selectedIndex = selectElement.selectedIndex;
    const selectedFilm = selectedIndex >= 0 ? data.peliculas[selectedIndex] : null;

    // Llamar a la función para cambiar el fondo del screenDiv
    changeScreenBackground(selectedFilm);
    updateTotalPrice();
});

getFilms();

function calculatePrice(price, numberOfSeats) {
    return price * numberOfSeats;
}

function updateTotalPrice() {
    totalPrice = calculatePrice(selectElement.value, counterSeatSelected);
    totalElement.innerText = totalPrice;
}

function createSeats() {
    let numRows = parseInt(numberRows.value);
    let seatsPerRow = parseInt(numberSeats.value);

    containerDivElement.innerHTML = "";

    screenDiv = document.createElement("div"); // Inicializamos screenDiv
    screenDiv.classList.add("screen");
    containerDivElement.appendChild(screenDiv);

    for (let i = 0; i < numRows; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 0; j < seatsPerRow; j++) {
            let seatDiv = document.createElement("div");
            seatDiv.classList.add("seat");
            seatDiv.setAttribute("data-seat-id", i + "-" + j);

            if (Math.random() < 0.3) {
                seatDiv.classList.add("occupied");
            } else {
                seatDiv.addEventListener("click", function () {
                    handleSeatClick(seatDiv);
                });
            }

            rowDiv.appendChild(seatDiv);
        }

        containerDivElement.appendChild(rowDiv);
    }
}

function handleSeatClick(seatDiv) {
    if (seatDiv.classList.contains("selected")) {
        seatDiv.classList.remove("selected");
        counterSeatSelected--;
    } else {
        seatDiv.classList.add("selected");
        counterSeatSelected++;
    }

    countElement.innerText = counterSeatSelected;
    updateTotalPrice();
}

async function getFilms() {
    try {
        const apiUrl = './peliculas.json';
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        data = await response.json();

        if (Array.isArray(data.peliculas)) {
            data.peliculas.forEach(film => {
                optionElement = document.createElement('option');
                optionElement.value = film.precio;
                optionElement.text = film.titulo + " (" + film.precio + "€)";
                selectElement.appendChild(optionElement);

                movieImages.push(film.imagen);
            });
        } else {
            console.error('Error: El contenido de "peliculas.json" no es un array.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

function changeScreenBackground(selectedFilm) {
    if (selectedFilm && selectElement.selectedIndex >= 0 && selectElement.selectedIndex < movieImages.length) {
        const selectedImage = movieImages[selectElement.selectedIndex];
        screenDiv.style.backgroundImage = `url(${selectedImage})`;
    } else {
      screenDiv.style.backgroundImage = '';
    }
}
