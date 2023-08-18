# Potato Recipes Platform

## Description

A platform where users can explore, create, and share potato recipes. Users can also manage their favorite potato recipes and potatoes.

## User Stories

- As a user, I want to sign up with a new account so that I can start using the platform.
- As a user, I want to log in to my account to access personalized features.
- As a user, I want to edit my profile information and update my avatar.
- As a user, I want to view a list of potato recipes with images and titles.
- As a user, I want to view the details of a specific potato recipe, including ingredients and instructions.
- As a user, I want to add or remove potato recipes from my favorites.
- As a user, I want to view a list of potatoes with images and names.
- As a user, I want to view the details of a specific potato, including its origin and details.
- As a user, I want to add or remove potatoes from my favorites.
- As an admin, I want to add new potatoes to the platform.
- As an admin, I want to edit potato information, including images and details.
- As an admin, I want to delete potatoes from the platform.
- As a gourmet user, I want to view the recipe details, including images, ingredients, time and instructions.


## Tech Stack

- Node.js
- Express.js
- MongoDB
- Cloudinary (for image hosting)
- Handlebars (template engine)

## Setup Instructions

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Configure your MongoDB connection in `config/database.config.js`
4. Configure your Cloudinary API credentials in `middlewares/cloudinary.middlewares.js`
5. Run the server: `npm start`
6. Access the platform in your browser at http://localhost:3000

## API Routes

### Authentication

- `GET /auth/signup`: Render the signup view.
- `POST /auth/signup`: Process user registration.
- `GET /auth/login`: Render the login view.
- `POST /auth/login`: Process user login.
- `GET /auth/logout`: Log out the user.

### User Profile

- `GET /user/profile`: Render the user profile view.
- `GET /user/profile-update`: Render the profile update view.
- `POST /user/profile/update`: Update user profile information and avatar.
- `POST /user/addOrRemoveFavPotatoes/:potatoId`: Add or remove a potato from user's favorites.
- `POST /user/addOrRemoveFavRecipes/:recipeId`: Add or remove a recipe from user's favorites.

### Potatoes

- `GET /potatoes`: Render a list of potatoes.
- `POST /potatoes/addOrRemoveFavoritePotato/:potatoId`: Add or remove a potato from user's favorites.
- `GET /potatoes/:potatoId/details`: Render details of a specific potato.
- `GET /potatoes/:potatoId/edit`: Render edit view for a specific potato.
- `POST /potatoes/:potatoId/edit`: Edit a specific potato.
- `POST /potatoes/:potatoId/delete`: Delete a specific potato.
- `GET /potatoes/new-potato`: Render view to add a new potato.
- `POST /potatoes/new-potato`: Add a new potato to the platform.

### Recipes

- `GET /recipes`: Render a list of recipes.
- `POST /recipes/addOrRemoveFavoriteRecipe/:recipeId`: Add or remove a recipe from user's favorites.
- `GET /recipes/:recipeId/details`: Render details of a specific recipe.
- `GET /recipes/:recipeId/edit`: Render edit view for a specific recipe.
- `POST /recipes/:recipeId/edit`: Edit a specific recipe.
- `POST /recipes/:recipeId/delete`: Delete a specific recipe.
- `GET /recipes/new-recipe`: Render view to add a new recipe.
- `POST /recipes/new-recipe`: Add a new recipe to the platform.

## How to Contribute

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m "Add a new feature"`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request.

## Links

- [Trello Board](https://trello.com/b/mVigF2oq/proyecto-patata)
- [GitHub Repository](https://github.com/Naol75/proyecto-patata)
- [Deployed App](https://potato-app.adaptable.app)
- [Google Slides](Google_Slides_Link)

Feel free to contribute to the project and make it even better! Happy coding!