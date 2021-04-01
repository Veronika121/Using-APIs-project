async function fetchData(url) {
  try {
    const fetchedData = await fetch(url);

    if (fetchedData.ok) {
      const parsedData = await fetchedData.json();
      console.log('parsedData:');
      console.log(parsedData);
      if (!parsedData.meals) {
        console.log('no food');
        throw new Error(`Try to find something else!`);
      }
      console.log(
        "if parsedData.meals doesn't exist we shouldn't see this message (and we don't see it, it's good.",
      );
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
    console.log(
      "We are in showResults. But we shouldn't be here if parsedData.meals doesn't exist (because we trow error) ",
    );
    console.log('data length:');
    console.log(Object.keys(data).length);
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
  showResults({});
}

function main() {
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const searchField = document.getElementById('searchField');
  let token = 0;
  searchField.onkeyup = () => {
    clearTimeout(token);
    if (searchField.value.trim().length === 0) {
      return;
    }
    token = setTimeout(() => {
      fetchData(url + searchField.value);
    }, 250);
  };
}

window.addEventListener('load', main);
