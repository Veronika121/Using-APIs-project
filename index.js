let request = {
  value: '',
  isResults: true,
  listOfMeals: [],
};

function createAndAppend(name, parent) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  return elem;
}

async function fetchData(url) {
  const fetchedData = await fetch(url);
  if (fetchedData.ok) {
    const parsedData = await fetchedData.json();
    if (!parsedData.meals) {
      request.isResults = false;
      throw new Error(`Try to find something else!`);
    }
    request.isResults = true;
    return parsedData;
  } else {
    throw new Error(`Request to ${url} failed`);
  }
}

function showResults(meals) {
  const errDiv = document.querySelector('#error');
  errDiv.textContent = '';
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
  const ul = createAndAppend('ul', showDiv);
  meals.forEach((meal) => {
    const li = createAndAppend('li', ul);
    li.textContent = meal.strMeal;
    li.className = 'link';
    li.addEventListener('click', () => {
      showOneMeal(meal);
    });
  });
}

function showOneMeal(meal) {
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
  const searchField = document.getElementById('searchField');
  searchField.value = '';

  const backToResults = createAndAppend('div', showDiv);
  const span = createAndAppend('span', backToResults);
  backToResults.id = 'back';
  span.textContent = 'Back to the search results';
  span.className = 'link';
  backToResults.addEventListener('click', () => {
    showResults(request.listOfMeals);
  });

  const h2 = createAndAppend('h2', showDiv);
  h2.textContent = meal.strMeal;

  const img = createAndAppend('img', showDiv);
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;

  const description = createAndAppend('div', showDiv);
  description.id = 'description';

  getListOfIngredients(meal, description);

  const h3 = createAndAppend('h3', description);
  h3.textContent = 'Instruction';

  const p = createAndAppend('p', description);
  p.textContent = meal.strInstructions;
}

function getListOfIngredients(meal, description) {
  const listOfIngredients = createAndAppend('ul', description);
  listOfIngredients.id = 'listOfIngredients';

  const mealArr = Object.entries(meal);
  const ingredients = [];
  const measure = [];

  for (const [key, value] of mealArr) {
    if (value && key.includes('strIngredient') && value.trim().length > 0) {
      ingredients.push(value);
    }
  }
  for (const [key, value] of mealArr) {
    if (value && key.includes('strMeasure') && value.trim().length > 0) {
      measure.push(value);
    }
  }
  for (let i = 0; i < ingredients.length; i++) {
    const li = createAndAppend('li', listOfIngredients);
    li.textContent = `${ingredients[i]}: ${measure[i]}`;
  }
}

function renderError(error) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
  const errorP = createAndAppend('p', errorDiv);
  errorP.textContent = error;
}

async function main() {
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const searchField = document.getElementById('searchField');
  let token = 0;

  searchField.addEventListener('input', () => {
    clearTimeout(token);
    if (searchField.value.trim().length < 2) {
      return;
    }
    if (
      searchField.value.trim().includes(request.value) &&
      request.isResults === false
    ) {
      return;
    }

    token = setTimeout(async () => {
      request.value = searchField.value;
      try {
        const parsedData = await fetchData(url + searchField.value);
        request.listOfMeals = parsedData.meals;
        showResults(parsedData.meals);
      } catch (error) {
        renderError(error);
      }
    }, 300);
  });
}

window.addEventListener('load', main);
