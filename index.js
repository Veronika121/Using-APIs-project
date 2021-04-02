let request = {
  value: '',
  isResults: true,
};

async function fetchData(url) {
  try {
    console.log('we are in fetchData');
    const fetchedData = await fetch(url);

    if (fetchedData.ok) {
      const parsedData = await fetchedData.json();
      console.log('parsedData:');
      console.log(parsedData);
      if (!parsedData.meals) {
        console.log('no food');
        request.isResults = false; //We change isResults
        console.log('We changed request.isResult.  request:');
        console.log(request);

        throw new Error(`Try to find something else!`);
      }
      request.isResults = true; //We change isResults
      console.log('We changed request.isResult.  request:');
      console.log(request);
      await showResults(parsedData);
    } else {
      throw new Error(`Request to ${url} failed`);
    }
  } catch (err) {
    renderError(err);
  }
}

async function showResults(data) {
  try {
    console.log('we are in showResults');
    const errDiv = document.querySelector('#error');
    errDiv.textContent = '';
    const showDiv = document.getElementById('dish-list');
    showDiv.textContent = '';
    const ul = document.createElement('ul');

    data.meals.forEach((element) => {
      const li = document.createElement('li');
      li.textContent = element.strMeal;
      li.className = 'link';
      li.onclick = () => {
        showOneMeal(element);
      };
      ul.appendChild(li);
    });

    showDiv.appendChild(ul);
    console.log('ul: ');
    console.log(ul);
  } catch (error) {
    console.log('error in showMenu', error);
  }
}
//strMeal strMealThumb strInstructions

function showOneMeal(meal) {
  console.log('we are in showOneMeal');
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
  const searchField = document.getElementById('searchField');
  searchField.value = '';

  const h2 = document.createElement('h2');
  h2.textContent = meal.strMeal;
  showDiv.appendChild(h2);

  const img = document.createElement('img');
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;
  showDiv.appendChild(img);

  const description = document.createElement('div');
  description.id = 'description';
  showDiv.appendChild(description);
  console.log(description);

  const h3 = document.createElement('h3');
  h3.textContent = 'Instruction';
  description.appendChild(h3);

  const p = document.createElement('p');
  p.textContent = meal.strInstructions;
  description.appendChild(p);
}

function renderError(error) {
  console.log('we are in renderError');
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
  const errorP = document.createElement('p');
  errorP.textContent = error;
  errorDiv.appendChild(errorP);
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
}

function main() {
  console.log('we are in main()');
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const searchField = document.getElementById('searchField');
  let token = 0;

  searchField.oninput = () => {
    console.log('some key is pressed');
    clearTimeout(token);
    console.log('token is cleared');
    if (searchField.value.trim().length < 2) {
      console.log('less then 2 letters');
      return;
    }
    // if user got no results (we don't have the meal with this name) and
    //he is continuing to add some letters in the input field we stop this function
    if (
      searchField.value.trim().includes(request.value) &&
      request.isResults === false
    ) {
      console.log('request:');
      console.log(request);
      console.log('you continuing to add letters to unworking result');
      return;
    }

    token = setTimeout(() => {
      request.value = searchField.value; //we change request.value
      console.log('We changed request vaue. request:');
      console.log(request);
      fetchData(url + searchField.value);
    }, 300);
  };
}

window.addEventListener('load', main);
