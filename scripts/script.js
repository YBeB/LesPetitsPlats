const searchBar = document.querySelector(".search-bar");

function getData() {
  try {
    if (typeof recipes !== "undefined") {
      return recipes;
    } else {
      throw new Error("Tableau vide");
    }
  } catch (error) {
    console.error(
      "Une erreur est survenue lors du chargement des données",
      error
    );
    return [];
  }
}

function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "card";

  const recipeImage = document.createElement("img");
  recipeImage.src = `assets/${recipe.image}`;
  recipeImage.className = "recipe-image";
  card.appendChild(recipeImage);

  const recipeDescription = document.createElement("div");
  recipeDescription.className = "recipe-description";

  const recipeTitle = document.createElement("p");
  recipeTitle.className = "recipe-title";
  recipeTitle.textContent = recipe.name;
  recipeDescription.appendChild(recipeTitle);

  const recipeInstructionTitle1 = document.createElement("span");
  recipeInstructionTitle1.className = "recipe-instruction-title";
  recipeInstructionTitle1.textContent = "RECETTE";
  recipeDescription.appendChild(recipeInstructionTitle1);

  const recipeTutorial = document.createElement("p");
  recipeTutorial.className = "recipe-tutorial";
  recipeTutorial.textContent = recipe.description;
  recipeDescription.appendChild(recipeTutorial);

  const recipeInstructionTitle2 = document.createElement("span");
  recipeInstructionTitle2.className = "recipe-instruction-title";
  recipeInstructionTitle2.textContent = "Ingrédients";
  recipeDescription.appendChild(recipeInstructionTitle2);

  const recipeIngredientsAll = document.createElement("div");
  recipeIngredientsAll.className = "recipe-ingredients-all";

  recipe.ingredients.forEach((ingredient) => {
    const ingredientDiv = document.createElement("div");

    const ingredientName = document.createElement("p");
    ingredientName.className = "recipe-ingredients";
    ingredientName.textContent = ingredient.ingredient;
    ingredientDiv.appendChild(ingredientName);

    const ingredientQuantity = document.createElement("p");
    ingredientQuantity.className = "recipe-weight";
    ingredientQuantity.textContent = ingredient.quantity
      ? `${ingredient.quantity} ${ingredient.unit || ""}`
      : "";
    ingredientDiv.appendChild(ingredientQuantity);

    recipeIngredientsAll.appendChild(ingredientDiv);
  });

  recipeDescription.appendChild(recipeIngredientsAll);
  card.appendChild(recipeDescription);

  return card;
}
//Ici changement en methode ancienne (boucle)
function displayRecipes(recipes) {
  const recipeContainer = document.getElementById("recipe-container");
  recipeContainer.innerHTML = "";
  for (let i = 0; i < recipes.length; i++) {
    const recipeCard = createRecipeCard(recipes[i]);
    recipeContainer.appendChild(recipeCard);
  }
}



function filterRecipes(searchTerm) {
  const data = getData();
  const filteredRecipes = [];
  for (let i = 0; i < data.length; i++) {
    const recipe = data[i];
    const recipeNameMatch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    let ingredientMatch = false;

    for (let a = 0; a < recipe.ingredients.length; a++) {
      if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchTerm.toLowerCase())) {
        ingredientMatch = true;
        break;
      }
    }

    if (recipeNameMatch || ingredientMatch) {
      filteredRecipes.push(recipe);
    }
  }
  return filteredRecipes;
}

document.addEventListener("DOMContentLoaded", () => {
  const data = getData();
  displayRecipes(data);

  const searchBar = document.querySelector(".search-bar");

  searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value;
    if (searchTerm.length >= 3) {
      const filteredRecipes = filterRecipes(searchTerm);
      displayRecipes(filteredRecipes);
    } else {
      displayRecipes(data);
    }
  });
});
