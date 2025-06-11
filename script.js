// 🔥 Firebase Configuration — REPLACE THIS WITH YOUR CONFIG!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 🔌 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// 👤 Auth Functions
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Signup successful!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Login successful!"))
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => alert("Logged out"));
}

// 🧾 DOM Elements
const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');

// 📥 Add Recipe Handler
function addRecipeHandler(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const ingredients = document.getElementById('ingredients').value;
  const instructions = document.getElementById('instructions').value;

  const newRecipeRef = db.ref('recipes').push();
  newRecipeRef.set({ title, ingredients, instructions });

  recipeForm.reset();
}
recipeForm.addEventListener('submit', addRecipeHandler);

// 🧠 Edit Recipe
function editRecipe(id, title, ingredients, instructions) {
  document.getElementById('title').value = title;
  document.getElementById('ingredients').value = ingredients;
  document.getElementById('instructions').value = instructions;

  recipeForm.removeEventListener('submit', addRecipeHandler);

  recipeForm.addEventListener('submit', function updateRecipe(e) {
    e.preventDefault();
    db.ref('recipes/' + id).update({
      title: document.getElementById('title').value,
      ingredients: document.getElementById('ingredients').value,
      instructions: document.getElementById('instructions').value,
    });
    recipeForm.reset();
    recipeForm.removeEventListener('submit', updateRecipe);
    recipeForm.addEventListener('submit', addRecipeHandler);
  });
}

// ❌ Delete Recipe
function deleteRecipe(id) {
  db.ref('recipes/' + id).remove();
}

// 👀 Show Recipes (after login)
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('recipe-form').style.display = 'block';

    db.ref('recipes').on('value', snapshot => {
      recipeList.innerHTML = '';
      snapshot.forEach(child => {
        const recipe = child.val();
        const key = child.key;

        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
          <h3>${recipe.title}</h3>
          <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
          <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
          <button class="delete-btn" onclick="deleteRecipe('${key}')">Delete</button>
          <button class="edit-btn" onclick="editRecipe('${key}', \`${recipe.title}\`, \`${recipe.ingredients}\`, \`${recipe.instructions}\`)">Edit</button>
        `;
        recipeList.appendChild(div);
      });
    });
  } else {
    document.getElementById('recipe-form').style.display = 'none';
    recipeList.innerHTML = "<p>Please log in to see your recipes.</p>";
  }
});
