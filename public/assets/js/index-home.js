const currencyApiKey = document?.body?.dataset?.currencyApiKey || "";

const productDataset = [
  {
    id: 1,
    name: "Lámpara Origami Nórdica",
    category: "Decoración",
    description:
      "Iluminación ambiental hecha a mano con papel reciclado tratado.",
    price: 180,
    rating: 4.8,
    tags: ["eco", "hecho a mano", "lounge"],
    image:
      "https://images.unsplash.com/photo-1505692794400-5e0cc1ee5631?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Silla Curve Pro",
    category: "Mobiliario",
    description:
      "Diseño ergonómico con espuma de memoria certificada y tela antimanchas.",
    price: 650,
    rating: 4.9,
    tags: ["ergonómico", "premium"],
    image:
      "https://images.unsplash.com/photo-1505692794400-1c17fc19c32a?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    id: 3,
    name: "Set Cerámico Selva",
    category: "Cocina",
    description:
      "Colección de vajilla esmaltada con pigmentos orgánicos duraderos.",
    price: 220,
    rating: 4.6,
    tags: ["artesanal", "colección"],
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    id: 4,
    name: "Auriculares Cloud Acoustic",
    category: "Tecnología",
    description:
      "Cancelación inteligente y 32h de autonomía con carga rápida USB-C.",
    price: 320,
    rating: 4.7,
    tags: ["wireless", "audio hi-fi"],
    image:
      "https://images.unsplash.com/photo-1518444028785-8fbcd101ebb9?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    id: 5,
    name: "Essential Oil Diffuser Quartz",
    category: "Wellness",
    description:
      "Difusor ultrasónico en cuarzo blanco con modulación de luz ambiente.",
    price: 150,
    rating: 4.5,
    tags: ["zen", "aroma"],
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    id: 6,
    name: "Escritorio Elevate Studio",
    category: "Mobiliario",
    description:
      "Base motorizada, madera certificada FSC y controlador táctil.",
    price: 980,
    rating: 4.9,
    tags: ["smart", "home office"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    id: 7,
    name: "Colección Textil Andes",
    category: "Decoración",
    description: "Plaids y cojines elaborados con fibras recicladas de alpaca.",
    price: 260,
    rating: 4.4,
    tags: ["sostenible", "colección"],
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    id: 8,
    name: "Smart Garden V2",
    category: "Tecnología",
    description:
      "Huerto interior con sensores de humedad y app móvil sincronizada.",
    price: 540,
    rating: 4.7,
    tags: ["eco", "smart"],
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    id: 9,
    name: "Juego de Vasos Boreal",
    category: "Cocina",
    description: "Cristal templado con efecto degradado y borde pulido a mano.",
    price: 110,
    rating: 4.3,
    tags: ["edición limitada", "arte"],
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
];

function catalogApp() {
  return {
    products: productDataset,
    featuredProducts: productDataset.filter((product) => product.featured),
    filteredProducts: [],
    categories: [...new Set(productDataset.map((product) => product.category))],
    tags: [...new Set(productDataset.flatMap((product) => product.tags))],
    searchQuery: "",
    selectedCategory: "all",
    selectedTags: [],
    priceCap: 1200,
    sortOption: "featured",
    hasActiveFilters: false,
    activeFilterLabels: [],
    highlightedProduct: productDataset[0],
    fuse: null,
    swiperInstance: null,
    currencyOptions: [
      { code: "PEN", symbol: "S/", label: "Soles peruanos" },
      { code: "USD", symbol: "$", label: "Dólar estadounidense" },
      { code: "EUR", symbol: "€", label: "Euro" },
    ],
    selectedCurrency: "PEN",
    currencySymbols: {
      PEN: "S/",
      USD: "$",
      EUR: "€",
    },
    exchangeRates: { PEN: 1 },
    currencyMenuOpen: false,

    init() {
      // Registrar plugins de GSAP
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }

      this.filteredProducts = [...this.products];
      this.highlightedProduct = this.getHighlightedProduct();
      this.createFuseInstance();
      this.fetchExchangeRates();
      this.$nextTick(() => {
        this.initSwiper();
        // Pequeño retardo para asegurar que el DOM esté listo
        setTimeout(() => {
          this.animateHero();
          this.animateFilters();
        }, 100);
      });
    },

    async fetchExchangeRates() {
      // Tasas de respaldo por si falla la API (aproximados)
      const fallbackRates = {
        USD: 0.27,
        EUR: 0.25,
      };

      if (!currencyApiKey) {
        console.warn("Currency API key no definido, usando tasas offline");
        this.exchangeRates = { ...this.exchangeRates, ...fallbackRates };
        return;
      }

      const targets = this.currencyOptions
        .filter((option) => option.code !== "PEN")
        .map((option) => option.code)
        .join(",");
      if (!targets) return;

      try {
        const response = await fetch(
          `https://api.currencyapi.com/v3/latest?base_currency=PEN&currencies=${targets}`,
          {
            headers: {
              apikey: currencyApiKey,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Currency API error: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.data) {
          Object.entries(data.data).forEach(([code, value]) => {
            this.exchangeRates[code] = value.value;
          });
        }
      } catch (error) {
        // Silenciar error en consola para no alarmar al usuario, ya que usamos fallback
        // console.warn('Error al obtener tipos de cambio (usando valores offline):', error.message);
        this.exchangeRates = { ...this.exchangeRates, ...fallbackRates };
      }
    },

    createFuseInstance() {
      this.fuse = new Fuse(this.products, {
        includeScore: true,
        threshold: 0.3,
        keys: ["name", "description", "category", "tags"],
      });
    },

    getHighlightedProduct() {
      return [...this.products].sort((a, b) => b.rating - a.rating)[0];
    },

    filterProducts() {
      let results = [...this.products];

      const query = this.searchQuery.trim();
      if (query.length > 1 && this.fuse) {
        results = this.fuse.search(query).map((match) => match.item);
      }

      if (this.selectedCategory !== "all") {
        results = results.filter(
          (product) => product.category === this.selectedCategory
        );
      }

      if (this.selectedTags.length) {
        results = results.filter((product) =>
          this.selectedTags.every((tag) => product.tags.includes(tag))
        );
      }

      if (this.priceCap) {
        results = results.filter((product) => product.price <= this.priceCap);
      }

      results = this.sortResults(results);

      this.filteredProducts = results;
      this.highlightedProduct = results[0] || this.getHighlightedProduct();
      this.hasActiveFilters = this.computeHasActiveFilters();
      this.activeFilterLabels = this.computeActiveFilterLabels();

      this.$nextTick(() => this.animateProducts());
    },

    sortResults(list) {
      const sorted = [...list];
      switch (this.sortOption) {
        case "price-asc":
          return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
          return sorted.sort((a, b) => b.price - a.price);
        case "rating":
          return sorted.sort((a, b) => b.rating - a.rating);
        default:
          return sorted;
      }
    },

    computeHasActiveFilters() {
      return (
        this.searchQuery.trim().length > 1 ||
        this.selectedCategory !== "all" ||
        this.selectedTags.length > 0 ||
        this.priceCap < 1200 ||
        this.sortOption !== "featured"
      );
    },

    computeActiveFilterLabels() {
      const chips = [];
      if (this.searchQuery.trim().length > 1) {
        chips.push(`Búsqueda: "${this.searchQuery.trim()}"`);
      }
      if (this.selectedCategory !== "all") {
        chips.push(`Categoría: ${this.selectedCategory}`);
      }
      if (this.selectedTags.length) {
        this.selectedTags.forEach((tag) => chips.push(`#${tag}`));
      }
      if (this.priceCap < 1200) {
        chips.push(`≤ ${this.formatCurrency(this.priceCap)}`);
      }
      if (this.sortOption !== "featured") {
        const labelMap = {
          "price-asc": "Precio ↑",
          "price-desc": "Precio ↓",
          rating: "Mejor valorados",
        };
        chips.push(labelMap[this.sortOption]);
      }
      return chips;
    },

    resetFilters() {
      this.searchQuery = "";
      this.selectedCategory = "all";
      this.selectedTags = [];
      this.priceCap = 1200;
      this.sortOption = "featured";
      this.filterProducts();
    },

    changeCurrency(code) {
      this.selectedCurrency = code;
      this.currencyMenuOpen = false;
      this.filteredProducts = [...this.filteredProducts];
    },

    convertToSelectedCurrency(value) {
      const rate = this.exchangeRates[this.selectedCurrency] ?? 1;
      return value * rate;
    },

    formatCurrency(value) {
      const converted = this.convertToSelectedCurrency(value);
      const amount = Math.round(converted * 100);
      const dineroInstance = Dinero({
        amount,
        currency: this.selectedCurrency,
      }).setLocale("es-PE");
      const formatPattern = `${
        this.currencySymbols[this.selectedCurrency] || ""
      }0,0.00`;
      return dineroInstance.toFormat(formatPattern);
    },

    initSwiper() {
      if (this.swiperInstance) {
        this.swiperInstance.destroy(true, true);
      }
      this.swiperInstance = new Swiper(".featured-swiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        breakpoints: {
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2.5 },
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    },

    animateHero() {
      const heroWrapper = document.querySelector(".hero-section");
      heroWrapper?.classList.add("is-hydrated");

      // Asegurar que los elementos sean visibles antes de animar si GSAP falla
      if (typeof gsap === "undefined") return;

      gsap.fromTo(
        [".hero-section h1", ".hero-section p", ".hero-card"],
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "all", // Limpiar propiedades después de la animación para evitar conflictos CSS
        }
      );
    },

    animateFilters() {
      if (typeof gsap === "undefined") return;

      // Usar fromTo para asegurar el estado final
      gsap.fromTo(
        ".filter-panel",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".filter-panel",
            start: "top 90%", // Disparar un poco antes
            toggleActions: "play none none reverse",
          },
          onComplete: () => {
            // Asegurar visibilidad al terminar
            gsap.set(".filter-panel", { opacity: 1, clearProps: "transform" });
          },
        }
      );
    },

    animateProducts() {
      const cards = document.querySelectorAll(".product-card");
      if (typeof gsap === "undefined" || !cards.length) return;

      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    },
  };
}

window.catalogApp = catalogApp;
