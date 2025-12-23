// document.addEventListener("DOMContentLoaded", () => {
//   // Get orders from localStorage (cart)
//   const orders = JSON.parse(localStorage.getItem("cart")) || [];

//   // Get the container where orders will appear
//   const container = document.getElementById("ordersContainer");

//   if (orders.length === 0) {
//     const noOrders = document.createElement("div");
//     noOrders.className = "no-more";
//     noOrders.textContent = "No orders yet";
//     container.appendChild(noOrders);
//     return;
//   }

//   // Loop through orders and create cards
//   orders.forEach(order => {
//     const orderCard = document.createElement("div");
//     orderCard.classList.add("product-info"); // reuse product card styling

//     orderCard.innerHTML = `
//       <div class="product-media">
//         <img class="product-image" src="${order.image}" alt="${order.name}">
//       </div>
//       <div class="product-details">
//         <h3 class="storename">${order.shop || "Default Store"}</h3>
//         <h2>${order.name}</h2>
//         <p class="flavor">Flavor: ${order.flavor}</p>
//         <p class="price">Total: $${order.price}</p>
//         <p class="status ${order.status}">Status: ${order.status}</p>
//         <div class="quantity">
//         <p>Total</p>
//           <span>${order.quantity}</span>
//         <p>items</p>
//         </div>
//       </div>
//     `;

//     container.appendChild(orderCard);
//   });
// });


// document.addEventListener("DOMContentLoaded", () => {
//   // Get orders from localStorage (cart) or empty array
//   const orders = JSON.parse(localStorage.getItem("cart")) || [];
//   const container = document.getElementById("ordersContainer");

//   // Show a message if no orders exist
//   if (orders.length === 0) {
//     const noOrders = document.createElement("div");
//     noOrders.className = "no-more";
//     noOrders.textContent = "No orders yet";
//     container.appendChild(noOrders);
//     return;
//   }

//   // Loop through each order and create a card
//   orders.forEach(order => {
//     const orderCard = document.createElement("div");
//     orderCard.classList.add("product-info"); // reuse product card styling

//     // Ensure default values if missing
//     const storeName = order.shop || "Default Store";
//     const status = order.status || "Pending";
//     const flavor = order.flavor || "Unknown";
//     const price = order.price || 0;
//     const quantity = order.quantity || 1;
//     const image = order.image || "https://via.placeholder.com/120";

//     const totalPrice = (parseFloat(order.price) * parseInt(order.quantity)).toFixed(2);

//     orderCard.innerHTML = `
//       <div class="product-media">
//         <img class="product-image" src="${image}" alt="${order.name}">
//       </div>
//       <div class="product-details">
//         <h3 class="storename">${storeName}</h3>
//         <h2>${order.name}</h2>
//         <p class="flavor">Flavor: ${flavor}</p>
//         <p class="price">Total: $${price}</p>
//         <p class="status">${status}</p>
//         <div class="quantity">
//           <span>${quantity}</span> item(s)
//         </div>
//       </div>
//     `;

//     container.appendChild(orderCard);
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem("cart")) || [];

  // Get the container where orders will appear
  const container = document.getElementById("ordersContainer");

  // If no orders, show a message
  if (orders.length === 0) {
    const noOrders = document.createElement("div");
    noOrders.className = "no-more";
    noOrders.textContent = "No orders yet";
    container.appendChild(noOrders);
    return;
  }

  // Sort orders by date (oldest last)
  orders.sort((a, b) => {
    const dateA = new Date(a.date || 0); // fallback to 0 if no date
    const dateB = new Date(b.date || 0);
    return dateA - dateB; // oldest first
  });

  // Loop through orders and create cards
  orders.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("product-info");

    // Calculate total price
    const totalPrice = (order.price * order.quantity + 0.36).toFixed(2);

    orderCard.innerHTML = `
      <div class="product-media">
        <img class="product-image" src="${order.image}" alt="${order.name}">
      </div>
      <div class="product-details">
        <h3 class="storename">${order.shop || "Default Store"}</h3>
        <h2>${order.name}</h2>
        <p class="flavor">Flavor: ${order.flavor}</p>
        <p class="tax">Tax: $${(totalPrice * 0.07).toFixed(2)}</p>
        <p class="price">Total: $${totalPrice}</p>
  
        <p class="status">${order.status || "Pending"}</p>
        <p class="date">Date: ${order.date || new Date().toLocaleDateString()}</p>
        <div class="quantity">
          <p>Total</p>
          <span>${order.quantity}</span>
          <p>items</p>
        </div>
      </div>
    `;

    container.appendChild(orderCard);
  });
});
