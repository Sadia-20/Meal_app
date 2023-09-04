// Check if the favoritesList array exists in local storage, create it if not
if (localStorage.getItem("favouritesList") === null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Function to fetch meals from the API
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Function to display a list of meals based on search input
function showListOfMeals() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";

    fetchMealsFromApi(url, inputValue).then((data) => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        isFav = true;
                    }
                }

                if (isFav) {
                    html += `
                        <div id="card" class="card card-1 mb-3 " style="width: 20rem; background: linear-gradient(135deg, red, rgba(255, 255, 255, 0));">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button id="main${element.idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${element.idMeal})" >Remove from Favorite</button>
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Details</button>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                        <div id="card" class="card mb-3" style="width: 20rem; ">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" >Add To Favorite</button>
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Details</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        } else {
            html += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <img src="./static/png/404-search page.png" alt="404 error image" width="80%">  
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

// Function to display meal details
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    await fetchMealsFromApi(url, id).then((data) => {
        html += `
            <div id="meal-details" class="mb-5">
                <a class="bg-danger btn float-right" href="./index.html" style="font-weight:bolder">X</a>
                <div id="meal-header" class="d-flex justify-content-around flex-wrap">
                    <div id="meal-thumbnail">
                        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
                    </div>
                    <div id="details">
                        <h3>${data.meals[0].strMeal}</h3>
                        <h6>Category : ${data.meals[0].strCategory}</h6>
                        <h6>Area : ${data.meals[0].strArea}</h6>
                    </div>
                </div>
                <div id="meal-instruction" class="mt-3">
                    <h5 class="text-center">Instruction</h5>
                    <p>${data.meals[0].strInstructions}</p>
                </div>
                <div class="text-center">
                    <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
                </div>
            </div>
        `;
    });

    document.getElementById("main").innerHTML = html;
}

// Function to display a list of favorite meals
async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (arr.length == 0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <img src="./static/png/404-favorite.png" alt="404 error png image" width="100%"> 
                </div>
            </div>
        `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url, arr[index]).then((data) => {
                html += `
                    <div id="card" class="card mb-3" style="width: 20rem;background: linear-gradient(135deg, red, rgba(255, 255, 255, 0));">
                        <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${data.meals[0].strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${data.meals[0].idMeal})" >Remove Favorite</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    }

    document.getElementById("favourites-body").innerHTML = html;
}

// Function to add and remove meals from/to the favorites list
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;

    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }

    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);

        // Show an alert indicating that the item has been removed
        window.alert("Removed from Favorites!");
    } else {
        arr.push(id);

        // Show an alert indicating that the item has been added
        window.alert("Added to Favorites!");
    }

    localStorage.setItem("favouritesList", JSON.stringify(arr));

    // Refresh the lists on the UI
    showListOfMeals();
    showFavMealList();
}
