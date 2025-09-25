let allRecipes = [];

        window.showPage = function(pageId, recipe = null) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');

            if (pageId === 'recipe-detail-page' && recipe) {
                displayRecipeDetails(recipe);
            }
        }

        function showMessage(message) {
            document.getElementById('modal-message').textContent = message;
            document.getElementById('message-modal').classList.remove('hidden');
        }

        window.hideMessage = function() {
            document.getElementById('message-modal').classList.add('hidden');
        }

        function loadRecipes() {
            try {
                const recipesJSON = localStorage.getItem('recipes');
                allRecipes = recipesJSON ? JSON.parse(recipesJSON) : [];
                displayRecipes(allRecipes);
            } catch (error) {
                console.error("Error loading recipes from localStorage: ", error);
                allRecipes = [];
                showMessage("Failed to load recipes. Data may be corrupted.");
            }
        }

        function saveRecipes() {
            localStorage.setItem('recipes', JSON.stringify(allRecipes));
        }

        function displayRecipes(recipes) {
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = '';
            
            if (recipes.length === 0) {
                recipeList.innerHTML = `<p class="text-center text-gray-500 col-span-full">No recipes found. Add one to get started!</p>`;
                return;
            }

            recipes.forEach(recipe => {
                const imageUrl = recipe.imageUrl || `https://placehold.co/600x400/FF6347/fff?text=${encodeURIComponent(recipe.name)}`;

                const recipeCard = document.createElement('div');
                recipeCard.className = 'cursor-pointer bg-gray-50 rounded-xl shadow-md p-4 transition duration-300 transform hover:scale-105 hover:shadow-lg';
                recipeCard.innerHTML = `
                    <img src="${imageUrl}" alt="${recipe.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/94A3B8/fff?text=No+Image'" class="w-full h-40 object-cover rounded-lg mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">${recipe.name}</h3>
                `;
                recipeCard.onclick = () => showPage('recipe-detail-page', recipe);
                recipeList.appendChild(recipeCard);
            });
        }
        
        function displayRecipeDetails(recipe) {
            const detailContent = document.getElementById('recipe-detail-content');
            
            const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('') : `<li>${recipe.ingredients}</li>`;
            const instructions = Array.isArray(recipe.instructions) ? recipe.instructions.map(inst => `<li>${inst}</li>`).join('') : `<li>${recipe.instructions}</li>`;
            const imageUrl = recipe.imageUrl || `https://placehold.co/600x400/FF6347/fff?text=${encodeURIComponent(recipe.name)}`;
            
            detailContent.innerHTML = `
                <div class="recipe-card">
                    <h2 class="text-3xl font-bold text-red-600 mb-4">${recipe.name}</h2>
                    <img src="${imageUrl}" alt="${recipe.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/94A3B8/fff?text=No+Image'" class="w-full h-auto rounded-lg shadow-md mb-6">
                    <div class="mb-6">
                        <h3 class="text-2xl font-semibold border-b-2 border-red-300 pb-2 mb-3">Ingredients</h3>
                        <ul class="list-disc pl-5 text-lg text-gray-700 leading-relaxed space-y-2">
                            ${ingredients}
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-2xl font-semibold border-b-2 border-red-300 pb-2 mb-3">Instructions</h3>
                        <ol class="list-decimal pl-5 text-lg text-gray-700 leading-relaxed space-y-2">
                            ${instructions}
                        </ol>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('add-recipe-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('recipe-name').value;
            const ingredients = document.getElementById('ingredients').value.split('\n').filter(line => line.trim() !== '');
            const instructions = document.getElementById('instructions').value.split('\n').filter(line => line.trim() !== '');
            const imageUrl = document.getElementById('image-url').value;

            if (!name || ingredients.length === 0 || instructions.length === 0) {
                showMessage('Please fill out all required fields.');
                return;
            }

            const newRecipe = { name, ingredients, instructions, imageUrl };
            allRecipes.push(newRecipe);
            saveRecipes();
            document.getElementById('add-recipe-form').reset();
            showPage('contents-page');
            showMessage('Recipe added successfully!');
        });
        
        window.searchRecipes = function() {
            const query = document.getElementById('search-input').value.toLowerCase();
            const filteredRecipes = allRecipes.filter(recipe => {
                const nameMatch = recipe.name.toLowerCase().includes(query);
                const ingredientsMatch = Array.isArray(recipe.ingredients) ? recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) : false;
                return nameMatch || ingredientsMatch;
            });
            displayRecipes(filteredRecipes);
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadRecipes();
            showPage('contents-page');
        });