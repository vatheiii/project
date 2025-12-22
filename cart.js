document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // GET PRODUCT FROM LOCAL STORAGE
  // ===============================
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  // ===============================
  // FLAVOR → SHOP MAP
  // ===============================
  const flavorStores = {
    chocolate: "Choco Heaven",
    vanilla: "Vanilla Delight",
    strawberry: "Berry Sweet",
    banana: "Sweet Corner",
    "salted-caramel": "Salty Bakery",
    lemon: "Citrus Cake Shop",
  };

  // ===============================
  // DISPLAY PRODUCT DETAILS
  // ===============================
  // fallback extractor (if flavor is missing)
  function extractFallbackFlavor() {
    const rawFlavor = product && product.flavor ? product.flavor : "";
    if (rawFlavor) return rawFlavor;
    const name = product && product.name ? product.name.toLowerCase() : "";
    // check known flavors
    for (const key of Object.keys(flavorStores)) {
      const plain = key.replace(/-/g, ' ');
      if (name.includes(plain)) return key;
    }
    // word before cake/gateau etc
    const m = name.match(/([a-z]+)\s+(?:cake|gateau|cupcake|muffin|slice|tart)/i);
    if (m) return m[1].toLowerCase();
    const first = name.split(' ')[0] || '';
    return first || '';
  }

  if (product) {
    document.getElementById("productImage").src = product.image;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = product.price;

    // Safely handle missing flavor
    const rawFlavor = product.flavor || "";
    let displayFlavor = rawFlavor ? rawFlavor : "Unknown";

    // if missing, try fallback extractor
    if (!rawFlavor) {
      const fb = extractFallbackFlavor();
      if (fb) {
        displayFlavor = fb.replace(/-/g, ' ');
        product.flavor = fb; // update product for future use
      }
    }

    // Capitalize display
    const displayCap = displayFlavor.charAt(0).toUpperCase() + displayFlavor.slice(1);
    document.getElementById("productFlavor").textContent = `Flavor: ${displayCap}`;

    const normalizedFlavor = product.flavor
      .toLowerCase()
      .replace(/\s+/g, "-");

    const storeName = normalizedFlavor ? (flavorStores[normalizedFlavor] || "Default Store") : "Default Store";
    document.getElementById("storeName").textContent = storeName;

    product.shop = storeName;


  }

  // ===============================
  // QUANTITY CONTROLS (FIXED)
  // ===============================
  let qty = 1;
  const qtyDisplay = document.getElementById("qty");
  const plusBtn = document.getElementById("plus");
  const minusBtn = document.getElementById("minus");

  qtyDisplay.textContent = qty;

  plusBtn.addEventListener("click", () => {
    qty++;
    qtyDisplay.textContent = qty;
  });

  minusBtn.addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtyDisplay.textContent = qty;
    }
  });

  // ===============================
  // ADD TO CART
  // ===============================
  document.querySelector(".add-cart").addEventListener("click", () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      name: product.name,
      price: product.price,
      shop: product.shop,
      flavor: product.flavor,
      image: product.image,
      quantity: qty,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart from ${product.shop}!`);
  });

  // ===============================
  // SHOW FLAVOR ON IMAGE CLICK
  // ===============================
  const productImage = document.getElementById("productImage");

  function showFlavorTooltip() {
    const flavor = product && product.flavor ? product.flavor : document.getElementById("productFlavor").textContent;
    let tooltip = document.getElementById("flavorTooltip");

    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "flavorTooltip";
      tooltip.className = "flavor-tooltip";
      document.body.appendChild(tooltip);
    }

    // clean up text (remove leading label if present)
    const text = String(flavor).replace(/^Flavor:\s*/i, '') || 'Unknown';
    tooltip.textContent = `Flavor: ${text}`;

    const rect = productImage.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    tooltip.style.left = `${rect.left + window.pageXOffset + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + scrollTop - 10}px`;

    tooltip.classList.add("visible");

    // auto-hide after 2.5s
    clearTimeout(tooltip._hideTimeout);
    tooltip._hideTimeout = setTimeout(() => tooltip.classList.remove("visible"), 2500);
  }

  if (productImage) {
    productImage.style.cursor = 'pointer';
    productImage.addEventListener('click', showFlavorTooltip);
  }

}); 