const ingredientInput = document.getElementById('ingredient-input');
const ingredientList = document.getElementById('ingredient-list');
const ustensilInput = document.getElementById('ustensil-input');
const ustensilList = document.getElementById('ustensil-list');
const applianceInput = document.getElementById('appliance-input');
const applianceList = document.getElementById('appliance-list');
const tagContainer = document.getElementById('tagContainer');
let selectedTags = {
  ingredients: [],
  ustensils: [],
  appliances: []
};

// Ajouter un tag
function addTag(type, value) {
  if (!selectedTags[type].includes(value)) {
    selectedTags[type].push(value);
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.setAttribute('data-type', type);
    
    const tagText = document.createElement('span');
    tagText.textContent = value;
    tagText.className = 'tag-text';

    const removeIcon = document.createElement('span');
    removeIcon.textContent = 'x';
    removeIcon.className = 'remove-tag';
    removeIcon.addEventListener('click', () => removeTag(type, value, tag));

    tag.appendChild(tagText);
    tag.appendChild(removeIcon);
    tagContainer.appendChild(tag);
    updateRecipes();
  }
}

// Supprimer un tag
function removeTag(type, value, tagElement) {
  selectedTags[type] = selectedTags[type].filter(tag => tag !== value);
  tagElement.remove();
  updateRecipes();
}

function updateDropdownItems(filteredRecipes) {
  const ingredients = [...new Set(filteredRecipes.flatMap(recipe => recipe.ingredients.map(i => i.ingredient)))];
  const ustensils = [...new Set(filteredRecipes.flatMap(recipe => recipe.ustensils))];
  const appliances = [...new Set(filteredRecipes.map(recipe => recipe.appliance))];

  updateDropdownList('ingredients', ingredientList, ingredients);
  updateDropdownList('ustensils', ustensilList, ustensils);
  updateDropdownList('appliances', applianceList, appliances);
}

function updateDropdownList(type, listElement, items) {
  listElement.innerHTML = '';
  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'dropdown-item';
    itemElement.textContent = item;
    itemElement.addEventListener('click', () => addTag(type, item));
    listElement.appendChild(itemElement);
  });
}


// Fonction pour mettre à jour les recettes en fonction des tags et de la barre de recherche
function updateRecipes() {
  const searchTerm = searchBar.value.toLowerCase();
  const data = getData();
  const filteredRecipes = data.filter(recipe => {
    const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ingredient =>
        ingredient.ingredient.toLowerCase().includes(searchTerm)
      ) || recipe.ustensils.some(ustensil =>
        ustensil.toLowerCase().includes(searchTerm)
      ) || recipe.appliance.toLowerCase().includes(searchTerm);

    // Vérifier la concordance avec les tags
    const matchesTags = selectedTags.ingredients.every(tag =>
      recipe.ingredients.some(ingredient =>
        ingredient.ingredient.toLowerCase() === tag.toLowerCase()
      )
    ) && selectedTags.ustensils.every(tag =>
      recipe.ustensils.some(ustensil =>
        ustensil.toLowerCase() === tag.toLowerCase()
      )
    ) && selectedTags.appliances.every(tag =>
      recipe.appliance.toLowerCase() === tag.toLowerCase()
    );

    return matchesSearchTerm && matchesTags;
  });

  displayRecipes(filteredRecipes);
  updateDropdownItems(filteredRecipes);
}


// Fonction pour afficher les éléments disponibles dans la liste déroulante
function displayDropdownItems(type, listElement, inputElement) {
  inputElement.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    listElement.innerHTML = '';
    const data = getData();
    let items = [];
    if (type === 'ingredients') {
      items = [...new Set(data.flatMap(recipe => recipe.ingredients.map(i => i.ingredient)))];
    } else if (type === 'ustensils') {
      items = [...new Set(data.flatMap(recipe => recipe.ustensils))];
    } else if (type === 'appliances') {
      items = [...new Set(data.map(recipe => recipe.appliance))];
    }
    items.filter(item => item.toLowerCase().includes(value)).forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'dropdown-item';
      itemElement.textContent = item;
      itemElement.addEventListener('click', () => addTag(type, item));
      listElement.appendChild(itemElement);
    });
  });
}

// Initialisation des éléments des dropdowns
displayDropdownItems('ingredients', ingredientList, ingredientInput);
displayDropdownItems('ustensils', ustensilList, ustensilInput);
displayDropdownItems('appliances', applianceList, applianceInput);

// Gestionnaire d'événements pour la barre de recherche
searchBar.addEventListener('input', () => {
  updateRecipes();
});

// Initialisation des recettes et des dropdowns
document.addEventListener("DOMContentLoaded", () => {
  updateRecipes();
});