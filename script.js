const pizzaOptions = [
  {
    id: 1,
    name: 'Margherita Deluxe',
    category: 'Classic',
    basePrice: 16.9,
    ingredients: [
      { name: 'Mozzarella', icon: '🧀', color: '#f5d76e', price: 2.2 },
      { name: 'Basil', icon: '🌿', color: '#5da66f', price: 1.4 },
      { name: 'Tomato', icon: '🍅', color: '#d94645', price: 1.8 },
      { name: 'Olive', icon: '🫒', color: '#303130', price: 1.6 },
    ],
  },
  {
    id: 2,
    name: 'Pepperoni Fire',
    category: 'Spicy',
    basePrice: 18.4,
    ingredients: [
      { name: 'Pepperoni', icon: '🌶️', color: '#d74545', price: 2.8 },
      { name: 'Mozzarella', icon: '🧀', color: '#f5d76e', price: 2.2 },
      { name: 'Onion', icon: '🧅', color: '#d9c3ff', price: 1.5 },
      { name: 'Chili', icon: '🔥', color: '#f9692d', price: 1.9 },
    ],
  },
  {
    id: 3,
    name: 'Veggie Supreme',
    category: 'Fresh',
    basePrice: 17.8,
    ingredients: [
      { name: 'Mushroom', icon: '🍄', color: '#d9d3cb', price: 2.1 },
      { name: 'Bell Pepper', icon: '🫑', color: '#63bf68', price: 1.8 },
      { name: 'Olive', icon: '🫒', color: '#2d2c2d', price: 1.6 },
      { name: 'Basil', icon: '🌿', color: '#5ca56d', price: 1.4 },
    ],
  },
  {
    id: 4,
    name: 'Truffle Melt',
    category: 'Premium',
    basePrice: 21.5,
    ingredients: [
      { name: 'Truffle', icon: '✨', color: '#d7b7ff', price: 3.4 },
      { name: 'Mozzarella', icon: '🧀', color: '#f5d76e', price: 2.2 },
      { name: 'Mushroom', icon: '🍄', color: '#d9d3cb', price: 2.1 },
      { name: 'Basil', icon: '🌿', color: '#62b66d', price: 1.4 },
    ],
  },
];

const ingredientPool = [
  { name: 'Mozzarella', icon: '🧀', color: '#f5d76e', price: 2.2 },
  { name: 'Pepperoni', icon: '🌶️', color: '#d74545', price: 2.8 },
  { name: 'Basil', icon: '🌿', color: '#62b66d', price: 1.4 },
  { name: 'Tomato', icon: '🍅', color: '#d94645', price: 1.8 },
  { name: 'Olive', icon: '🫒', color: '#2d2c2d', price: 1.6 },
  { name: 'Mushroom', icon: '🍄', color: '#d9d3cb', price: 2.1 },
  { name: 'Onion', icon: '🧅', color: '#d9c3ff', price: 1.5 },
  { name: 'Bell Pepper', icon: '🫑', color: '#63bf68', price: 1.8 },
  { name: 'Truffle', icon: '✨', color: '#d7b7ff', price: 3.4 },
  { name: 'Chili', icon: '🔥', color: '#f9692d', price: 1.9 },
];

const menuList = document.getElementById('menuList');
const ingredientPicker = document.getElementById('ingredientPicker');
const pizzaName = document.getElementById('pizzaName');
const pizzaPrice = document.getElementById('pizzaPrice');
const totalPrice = document.getElementById('totalPrice');
const summaryList = document.getElementById('summaryList');
const pizzaVisual = document.getElementById('pizzaVisual');
const pizzaOrbit = document.getElementById('pizzaOrbit');
const aiAssistant = document.getElementById('aiAssistant');
const assistantBody = document.getElementById('assistantBody');
const assistantInput = document.getElementById('assistantInput');
const authModal = document.getElementById('authModal');

let selectedPizza = pizzaOptions[0];
let selectedSize = 'Regular';
let selectedIngredients = [...selectedPizza.ingredients];

function renderMenu() {
  menuList.innerHTML = pizzaOptions
    .map(
      (pizza) => `
        <article class="menu-card ${pizza.id === selectedPizza.id ? 'active' : ''}" data-id="${pizza.id}">
          <div class="card-top">
            <strong>${pizza.name}</strong>
            <span class="tag">${pizza.category}</span>
          </div>
          <div class="card-image"></div>
          <div class="card-meta">
            <span>${pizza.ingredients.length} toppings</span>
            <strong>$${pizza.basePrice.toFixed(2)}</strong>
          </div>
          <button type="button">Customize</button>
        </article>
      `
    )
    .join('');

  menuList.querySelectorAll('.menu-card').forEach((card) => {
    card.addEventListener('click', () => {
      const pizzaId = Number(card.dataset.id);
      const found = pizzaOptions.find((pizza) => pizza.id === pizzaId);
      if (!found) return;

      selectedPizza = found;
      selectedIngredients = [...found.ingredients];
      renderAll();
    });
  });
}

function renderIngredients() {
  ingredientPicker.innerHTML = ingredientPool
    .map((ingredient) => {
      const selected = selectedIngredients.some((item) => item.name === ingredient.name);
      return `
        <button type="button" class="ingredient-pill ${selected ? 'active' : ''}" data-name="${ingredient.name}">
          <div>
            <strong>${ingredient.name}</strong>
            <small>$${ingredient.price.toFixed(2)}</small>
          </div>
          <span>${ingredient.icon}</span>
        </button>
      `;
    })
    .join('');

  ingredientPicker.querySelectorAll('.ingredient-pill').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const ingredient = ingredientPool.find((item) => item.name === name);
      if (!ingredient) return;

      const exists = selectedIngredients.some((item) => item.name === name);
      if (exists) {
        selectedIngredients = selectedIngredients.filter((item) => item.name !== name);
      } else {
        selectedIngredients = [...selectedIngredients, ingredient];
      }

      renderAll();
    });
  });
}

function getSizeMultiplier(size) {
  const map = { Regular: 1, Large: 1.3, Family: 1.6 };
  return map[size] || 1;
}

function renderSummary() {
  const ingredientCost = selectedIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
  const subtotal = selectedPizza.basePrice + ingredientCost;
  const dynamicTotal = subtotal * getSizeMultiplier(selectedSize);

  pizzaName.textContent = selectedPizza.name;
  pizzaPrice.textContent = `$${selectedPizza.basePrice.toFixed(2)}`;
  totalPrice.textContent = `$${dynamicTotal.toFixed(2)}`;

  const lines = [
    { label: `${selectedPizza.name}`, value: `$${selectedPizza.basePrice.toFixed(2)}` },
    { label: `${selectedSize} size`, value: `x${getSizeMultiplier(selectedSize).toFixed(2)}` },
    ...selectedIngredients.map((ingredient) => ({
      label: ingredient.name,
      value: `$${ingredient.price.toFixed(2)}`,
    })),
  ];

  summaryList.innerHTML = lines
    .map(
      (line) => `
        <li>
          <span>${line.label}</span>
          <strong>${line.value}</strong>
        </li>
      `
    )
    .join('');
}

function renderPizzaVisual() {
  const positions = [
    { x: 50, y: 16 },
    { x: 73, y: 32 },
    { x: 82, y: 53 },
    { x: 72, y: 76 },
    { x: 50, y: 84 },
    { x: 26, y: 76 },
    { x: 18, y: 53 },
    { x: 26, y: 31 },
  ];

  pizzaVisual.innerHTML = selectedIngredients
    .map((ingredient, index) => {
      const pos = positions[index % positions.length];
      const angle = (index * 52) % 360;
      return `
        <div
          class="pizza-ingredient"
          style="
            left:${pos.x}%;
            top:${pos.y}%;
            background:${ingredient.color};
            transform: rotate(${angle}deg) translate(0, 0);
          "
          title="${ingredient.name}"
        >${ingredient.icon}</div>
      `;
    })
    .join('');

  pizzaOrbit.style.transform = `rotate(${selectedIngredients.length * 12}deg)`;
}

function renderAll() {
  renderMenu();
  renderIngredients();
  renderSummary();
  renderPizzaVisual();
}

renderAll();

document.querySelectorAll('.size-btn').forEach((button) => {
  button.addEventListener('click', () => {
    selectedSize = button.dataset.size;
    document.querySelectorAll('.size-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
    renderSummary();
  });
});

document.getElementById('placeOrderBtn').addEventListener('click', () => {
  const message = `Your ${selectedPizza.name} order for ${selectedSize.toLowerCase()} size is ready to go. Total: $${(
    selectedPizza.basePrice +
    selectedIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
  ).toFixed(2)}.`;

  addAssistantMessage(message, 'ai');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function addAssistantMessage(text, sender = 'ai') {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  assistantBody.appendChild(message);
  assistantBody.scrollTop = assistantBody.scrollHeight;
}

document.getElementById('sendAI').addEventListener('click', () => {
  const value = assistantInput.value.trim();
  if (!value) return;

  addAssistantMessage(value, 'user');
  assistantInput.value = '';

  const lower = value.toLowerCase();
  let reply = 'I recommend the Margherita Deluxe for a classic flavor, or the Pepperoni Fire if you want more heat.';

  if (lower.includes('delivery')) {
    reply = 'Your order normally arrives in 25–35 minutes. If there is a delay, I can help you track the driver or arrange a refund.';
  } else if (lower.includes('vegetarian') || lower.includes('veggie')) {
    reply = 'The Veggie Supreme is perfect for that. We can also remove cheese or add more basil if you want it lighter.';
  } else if (lower.includes('allergy') || lower.includes('gluten')) {
    reply = 'We can suggest a gluten-free crust and dairy-free alternatives. If you tell me your allergy, I can recommend the safest pizza.';
  } else if (lower.includes('price')) {
    reply = `Your current build is $${(
      selectedPizza.basePrice +
      selectedIngredients.reduce((sum, item) => sum + item.price, 0)
    ).toFixed(2)} for a ${selectedSize.toLowerCase()} pizza.`;
  }

  setTimeout(() => addAssistantMessage(reply, 'ai'), 200);
});

document.getElementById('assistantInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('sendAI').click();
  }
});

document.getElementById('aiTrigger').addEventListener('click', () => {
  aiAssistant.scrollIntoView({ behavior: 'smooth', block: 'end' });
  assistantInput.focus();
});

document.getElementById('closeAI').addEventListener('click', () => {
  aiAssistant.classList.add('hidden');
});

const authState = { mode: 'login' };

function openAuth(mode) {
  authState.mode = mode;
  authModal.classList.add('open');
  document.querySelectorAll('.tab-btn').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.authTab === mode);
  });
}

document.querySelectorAll('[data-open-auth]').forEach((button) => {
  button.addEventListener('click', () => openAuth(button.dataset.openAuth));
});

document.getElementById('closeAuth').addEventListener('click', () => {
  authModal.classList.remove('open');
});

document.querySelectorAll('.tab-btn').forEach((tab) => {
  tab.addEventListener('click', () => openAuth(tab.dataset.authTab));
});

authModal.addEventListener('click', (event) => {
  if (event.target === authModal) {
    authModal.classList.remove('open');
  }
});

document.getElementById('authForm').addEventListener('submit', (event) => {
  event.preventDefault();
  authModal.classList.remove('open');
  addAssistantMessage(`Welcome! Your ${authState.mode === 'login' ? 'login' : 'account creation'} is ready. You can now place your pizza order.`, 'ai');
});
