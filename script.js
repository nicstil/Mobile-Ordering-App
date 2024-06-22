import { menuArray } from "/data.js";

// DOM Initialization

const mainContainer = document.getElementById("main-container");
const menuContainer = document.getElementById("menu-container");
const menuItemSelector = document.getElementById("menuItem-selector");
const orderContainer = document.getElementById("order-container");
const orderLineItem = document.getElementById("order-line-item");
const removeBtn = document.getElementById("order-remove");
const completeOrderBtn = document.getElementById("complete-order");
const cardDetailsModal = document.getElementById("card-details-modal");
const paymentForm = document.getElementById("payment-form");
const paymentFormName = document.getElementById("payment-form-name");
const payOrderBtn = document.getElementById("pay-order");
const thankYouStatement = document.getElementById("thankyou");
const thankYouSaying = document.getElementById("thankyou-statement");
const orderHeadline = document.getElementById("order-headline");
const orderTotalPrice = document.getElementById("order-total-price");
let orderIncrement = 0;
let itemOrderedArray = [];
let totalPriceArray = [];
let menuOrderedArray = [];
let menuIdsToBeRemoved = [];
let totalPriceCalc = 0;
let payFormName = "";

// All menu items show up retrieved from menuArray when app is refreshed

function getMenuHtml(menuArray) {
  return menuArray
    .map((menuItem) => {
      const { name, ingredients, id, price, emoji } = menuItem;
      return `
            <section class="menu-item">
          <div class="menu-wo-divider">
            <img class="menu-icon" src="/images/${name}.png" alt="${emoji}" />
            <div class="menuItem-details">
              <span class="menuItem menuItem-name">${name}</span>
              <span class="menuItem menuItem-descr"
                >${ingredients}</span
              >
              <span class="menuItem menuItem-price">$${price}</span>
            </div>
            <div id="menuItem-selector">
              <p class="selector" data-menu="${id}">X</p>
            </div>
          </div>
          <hr class="menu-divider" />
        </section>`;
    })
    .join("");
}

menuContainer.innerHTML = getMenuHtml(menuArray);

// EVENT LISTENERS

// When the selector button on any menu item card is clicked, the menu item will be appended in the orderContainer. Total Price will be dynamic.//

document.addEventListener("click", function (e) {
  if (e.target.dataset.menu) {
    addMenuSelectionOrder(e.target.dataset.menu);
  }
});

// When user clicks on any Remove button on the order line items, the particular item will be removed from the Order, and the Total Price will be adjusted.

document.addEventListener("click", function (e) {
  if (e.target.dataset.remove) {
    removeMenuSelectionOrder(e.target.dataset.remove);
  }
});

// When user clicks on the "Complete Order" button, the Payment Modal will be visible and all elements within the Order Container will be hidden.

completeOrderBtn.addEventListener("click", showPaymentModal);

// When user clicks on the "Pay" button on the Payment Modal, the Payment Modal will be hidden and the "Thank You" statement will be visible

payOrderBtn.addEventListener("click", showThankYouStatement);

// prevent form default behavior when user clicks on "Pay" button

paymentForm.addEventListener("submit", function (e) {
  e.preventDefault();
});

function addMenuSelectionOrder(menuId) {
  let menuSelected = menuArray.filter(function (menu) {
    return menu.id === menuId;
  });

  if (orderIncrement === 0) {
    renderMenuOrder(menuSelected);
    menuOrderedArray.push(menuSelected);
    menuOrderedArray = menuOrderedArray.flat();
    updateTotalPrice(menuOrderedArray);
    menuSelected = [];
    orderIncrement++;
    itemOrderedArray.push(menuId);
    orderHeadline.classList.remove("hidden");
    completeOrderBtn.classList.remove("hidden");
  } else if (orderIncrement > 0 && !itemOrderedArray.includes(menuId)) {
    orderIncrement++;
    itemOrderedArray.push(menuId);
    renderMenuOrder(menuSelected);
    menuOrderedArray.push(menuSelected);
    menuOrderedArray = menuOrderedArray.flat();
    updateTotalPrice(menuOrderedArray);
    menuSelected = [];
  }
}

function removeMenuSelectionOrder(menuId) {
  orderLineItem.innerHTML = ``;
  menuIdsToBeRemoved.push(menuId);
  let menuToBeRendered = menuArray.filter(
    (menu) => !menuIdsToBeRemoved.includes(menu.id)
  );
  renderMenuOrder(menuToBeRendered);
  updateTotalPrice(menuToBeRendered);
}

function updateTotalPrice(orders) {
  totalPriceArray = [];
  orders.forEach(function (item) {
    totalPriceArray.push(item.price);
  });
  totalPriceCalc = totalPriceArray.reduce(function (total, price) {
    return total + price;
  });
  orderTotalPrice.innerHTML = ` <span class="order-totalPrice" id="totalPrice">Total Price:</span>
          <span class="order-price" id="total-price">$${totalPriceCalc}</span>
      `;
}

function renderMenuOrder(orders) {
  if (orders.length === 0) {
    location.reload();
  }
  orders.forEach(function (item) {
    const newLineItem = document.createElement("div");
    newLineItem.classList.add("order-line-item");
    newLineItem.innerHTML = `<span class="order-item">${item.name}</span>
<button id="order-remove" class="order-remove" data-remove="${item.id}">remove</button>
<span class="order-price">$${item.price}</span>`;
    orderLineItem.appendChild(newLineItem);
  });
}

function showPaymentModal() {
  orderHeadline.classList.add("hidden");
  completeOrderBtn.classList.add("hidden");
  orderTotalPrice.style.display = "none";
  orderLineItem.style.display = "none";
  cardDetailsModal.style.display = "inline";
}

function showThankYouStatement() {
  cardDetailsModal.style.display = "none";
  thankYouStatement.style.display = "inline-block";
  thankYouSaying.classList.remove("hidden");
  payFormName = paymentFormName.value;
  thankYouSaying.textContent = `Thanks ${payFormName}! Your order is on its way!`;
}
