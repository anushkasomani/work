import { html, render } from 'lit-html';
import './App.css'

class RecipeBook {
  recipes = [];
  editingIndex = null;

  constructor() {
    this.loadRecipes();
    this.#render();
  }

  // Load recipes from local storage
  loadRecipes() {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    this.recipes = storedRecipes;
  }

  // Save recipes to local storage
  saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
  }

  // Handle input change for forms
  #handleInputChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  };

  // Handle adding or editing a recipe
  #handleFormSubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value.split(',');
    const instructions = document.getElementById('instructions').value;

    const newRecipe = { title, ingredients, instructions };

    if (this.editingIndex !== null) {
      this.recipes[this.editingIndex] = newRecipe;
      this.editingIndex = null;
    } else {
      this.recipes.push(newRecipe);
    }

    this.saveRecipes();
    this.#resetForm();
    this.#render();
  };

  // Reset form fields
  #resetForm() {
    document.getElementById('recipe-form').reset();
  }

  // Edit a recipe
  #editRecipe = (index) => {
    const recipe = this.recipes[index];
    this.editingIndex = index;
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients.join(',');
    document.getElementById('instructions').value = recipe.instructions;
    this.#render();
  };

  // Delete a recipe
  #deleteRecipe = (index) => {
    this.recipes.splice(index, 1);
    this.saveRecipes();
    this.#render();
  };

  // Render the UI
  #render() {
    const body = html`
      <div class="app">
        <h1>Recipe Book</h1>

        <form id="recipe-form" @submit="${this.#handleFormSubmit}">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Recipe Title"
            required
          />
          <textarea
            id="ingredients"
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            required
          ></textarea>
          <textarea
            id="instructions"
            name="instructions"
            placeholder="Instructions"
            required
          ></textarea>
          <button type="submit">Save Recipe</button>
        </form>

        <div class="recipe-list">
          ${this.recipes.map(
            (recipe, index) => html`
              <div class="recipe">
                <h3>${recipe.title}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <button @click="${() => this.#editRecipe(index)}">Edit</button>
                <button @click="${() => this.#deleteRecipe(index)}">Delete</button>
              </div>
            `
          )}
        </div>
      </div>
    `;

    render(body, document.getElementById('root'));
  }
}

export default RecipeBook;

const app = new RecipeBook();
