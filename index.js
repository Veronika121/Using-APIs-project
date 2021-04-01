let request = {
  value: '',
  isResults: true,
};

async function fetchData(url) {
  try {
    const fetchedData = await fetch(url);

    if (fetchedData.ok) {
      const parsedData = await fetchedData.json();
      console.log('parsedData:');
      console.log(parsedData);
      if (!parsedData.meals) {
        console.log('no food');
        request.isResults = false; //We change isResults

        throw new Error(`Try to find something else!`);
      }

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
    const showDiv = document.getElementById('dish-list');
    showDiv.textContent = '';
    const ul = document.createElement('ul');

    data.meals.forEach((element) => {
      const li = document.createElement('li');
      li.textContent = element.strMeal;
      ul.appendChild(li);
    });
    showDiv.appendChild(ul);
    /* const img = document.createElement('img');
  img.src = data.meals[0].strMealThumb;
  img.alt = data.meals[0].strMeal;
  showDiv.appendChild(img);*/
    const errDiv = document.querySelector('#error');
    errDiv.textContent = '';
  } catch (error) {
    console.log('error in showMenu', error);
  }
}

function renderError(error) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
  const errorP = document.createElement('p');
  errorP.textContent = error;
  errorDiv.appendChild(errorP);
  const showDiv = document.getElementById('dish-list');
  showDiv.textContent = '';
}

function main() {
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const searchField = document.getElementById('searchField');
  let token = 0;

  searchField.onkeyup = () => {
    clearTimeout(token);
    if (searchField.value.trim().length < 2) {
      return;
    }
    // if user got no results (we don't have the meal with this name) and
    //he is continuing to add some letters in the input field we stop this function
    if (
      searchField.value.trim().includes(request.value) &&
      request.isResults === false
    ) {
      return;
    }

    token = setTimeout(() => {
      request.value = searchField.value; //we change request.value
      fetchData(url + searchField.value);
    }, 500);
  };
}

window.addEventListener('load', main);
