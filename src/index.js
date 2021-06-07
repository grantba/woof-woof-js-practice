const dogBar = document.querySelector("#dog-bar");
const filterButton = document.querySelector("#good-dog-filter");
const dogInfo = document.querySelector("#dog-info");

function getDogs() {
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(dogs => createDogs(dogs))
}

getDogs();

function createDogs(dogs) {
    dogBar.innerHTML = "";
    dogs.forEach(dog => {
        const span = document.createElement("span");
        span.innerHTML = `<span><h5 data-id="dog-name" id=${dog.id}>${dog.name}</h5>
        <p hidden="true">${dog.isGoodDog}</p>
        <img hidden="true" src=${dog.image} alt="Dog's Photo"></span>`
        dogBar.innerHTML += span.innerHTML;
    })
}

filterButton.addEventListener("click", event => {
    const location = ( event.target.innerText === "Filter good dogs: OFF" ? "Filter good dogs: ON" : "Filter good dogs: OFF" );
    event.target.innerText = location;
    if (location === "Filter good dogs: ON") {
        goodDogsOnly();
    }
    else {
        getDogs();
    }
})

function goodDogsOnly() {
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(dogs => postGoodDogs(dogs))
}

function postGoodDogs(dogs) {
    dogBar.innerHTML = "";
    dogs.forEach(dog => {
        if (dog.isGoodDog === true) {
            const span = document.createElement("span");
            span.innerHTML = `<span><h5 data-id="dog-name" id=${dog.id}>${dog.name}</h5>
            <p hidden="true">${dog.isGoodDog}</p>
            <img hidden="true" src=${dog.image} alt="Dog's Photo"></span>`
            dogBar.innerHTML += span.innerHTML;
        }
    })
}

dogBar.addEventListener("click", event => {
    if (event.target.dataset.id === "dog-name") {
        const id = event.target.id;
        getDog(id);
    }
})

function getDog(id) {
    fetch(`http://localhost:3000/pups/${id}`)
    .then(resp => resp.json())
    .then(dog => showDog(dog))
}

function showDog(dog) {
    const goodDog = dog.isGoodDog;
    const dogBehaviour = dogStatus(goodDog);
    dogInfo.innerHTML = "";
    const div = document.createElement("div");
    div.id = "dog-info";
    div.innerHTML = `<div><h2 id=${dog.id}>${dog.name}</h2><br>
    <button id="behaviour-button">${dogBehaviour}</button><br>
    <br><img src=${dog.image} alt="Dog's Photo"></div>`
    dogInfo.innerHTML = div.innerHTML;

    const behaviourButton = document.getElementById("behaviour-button");
    behaviourButton.addEventListener("click", event => {
        const dogId = event.target.parentElement.querySelector("h2").id;
        if (event.target.innerText === "Good Dog!") {
            const status = dogStatus(false); 
            const goodOrBad = false;
            behaviourButton.innerText = status;
            changeStatus(dogId, goodOrBad);
        }
        else {
            const status = dogStatus(true); 
            const goodOrBad = true;
            behaviourButton.innerText = status;
            changeStatus(dogId, goodOrBad);
        }
    });
}

function dogStatus(goodDog) {
    if (goodDog === true) {
        return "Good Dog!"
    }
    else {
        return "Bad Dog!"
    }
}

function changeStatus(dogId, goodOrBad) {
    const params = {
        isGoodDog: goodOrBad
    };

    const options = {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    };

    fetch(`http://localhost:3000/pups/${parseInt(dogId)}`, options)
    .then(resp => resp.json())
    .then(dog => showDog(dog))
}
