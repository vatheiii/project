document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".product-item");
    const filterPanel = document.getElementById("filterPanel");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    // Known flavors used to detect flavor from name or alt when data-flavor is missing
    const knownFlavors = [
        'chocolate',
        'vanilla',
        'strawberry',
        'lemon',
        'salted-caramel',
        'salted caramel',
        'caramel',
        'banana'
    ];

    function detectFlavor(productEl) {
        // 1) prefer explicit data-flavor
        const ds = productEl.dataset.flavor;
        if (ds && String(ds).trim()) return String(ds).trim().toLowerCase();

        // 2) prepare searchable text (alt + name), normalize punctuation
        const alt = productEl.querySelector('img')?.alt || '';
        const name = productEl.querySelector('.product-name')?.textContent || '';
        const hayRaw = (alt + ' ' + name).toLowerCase();
        const hay = hayRaw.replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

        // 3) check known flavors (both hyphen and space forms)
        for (const f of knownFlavors) {
            const fNorm = f.toLowerCase().replace(/-/g, ' ').trim();
            if (hay.includes(f.toLowerCase()) || hay.includes(fNorm)) return fNorm.replace(/\s+/g, '-');
        }

        // 4) expanded synonyms / partial matches
        const synonyms = {
            choco: 'chocolate',
            choc: 'chocolate',
            caramel: 'salted-caramel',
            salt: 'salted-caramel',
            berry: 'strawberry',
            lemony: 'lemon'
        };

        const tokens = hay.split(' ');
        for (const token of tokens) {
            for (const key in synonyms) {
                if (token === key || token.startsWith(key)) return synonyms[key];
            }
        }

        // 5) last-resort heuristic: take the word before common cake words
        const fallbackMatch = hay.match(/([a-z-]+)\s+(?:cake|gateau|cupcake|muffin|slice|tart|gateaux|gateau)/i);
        if (fallbackMatch) {
            const candidate = fallbackMatch[1];
            // map candidate via synonyms if possible
            if (synonyms[candidate]) return synonyms[candidate];
            // if candidate looks like a known flavor word, normalize
            for (const f of knownFlavors) {
                const fNorm = f.toLowerCase().replace(/-/g, ' ').trim();
                if (fNorm === candidate || fNorm.includes(candidate) || candidate.includes(fNorm)) return fNorm.replace(/\s+/g, '-');
            }
            // otherwise return candidate (normalized)
            return candidate.replace(/\s+/g, '-');
        }

        // debug info for development (visible in browser console)
        console.debug('detectFlavor: no match', { dataset: ds, alt, name, hay });

        // not found
        return '';
    }

    // CLICK PRODUCT → OPEN PRODUCT PAGE
    products.forEach(product => {
        product.addEventListener("click", () => {
            const flavor = detectFlavor(product);

            const productData = {
                image: product.querySelector("img").src,
                name: product.querySelector(".product-name").textContent,
                price: product.querySelector(".product-price").textContent.replace("$", ""),
                flavor: flavor
            };

            // Save debug info to localStorage to help diagnose detection issues
            const debugInfo = {
                detectedFlavor: flavor,
                datasetFlavor: product.dataset.flavor || null,
                imgAlt: product.querySelector('img')?.alt || null,
                name: product.querySelector('.product-name')?.textContent || null,
                rawHay: ((product.querySelector('img')?.alt || '') + ' ' + (product.querySelector('.product-name')?.textContent || '')).toLowerCase()
            };

            localStorage.setItem("selectedProductDebug", JSON.stringify(debugInfo));
            localStorage.setItem("selectedProduct", JSON.stringify(productData));
            window.location.href = "cart.html";
        });
    });

    // FILTER PANEL TOGGLE
    applyFilterBtn.addEventListener("click", () => {
        filterPanel.style.display =
            filterPanel.style.display === "block" ? "none" : "block";
    });

    const getCheckedValues = name =>
        [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(cb => cb.value);

    const filterProducts = () => {
        const searchText = searchInput.value.toLowerCase();
        const selectedSizes = getCheckedValues("size");
        const selectedFlavors = getCheckedValues("flavor");

        products.forEach(product => {
            const name = product.querySelector(".product-name").textContent.toLowerCase();
            const size = product.dataset.size;
            const flavor = product.dataset.flavor;

            const matchesSearch = name.includes(searchText);
            const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(size);
            const matchesFlavor = selectedFlavors.length === 0 || selectedFlavors.includes(flavor);

            product.style.display =
                matchesSearch && matchesSize && matchesFlavor ? "block" : "none";
        });
    };

    searchBtn.addEventListener("click", filterProducts);
    applyFilterBtn.addEventListener("click", filterProducts);
});

