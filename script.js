// ─── Constants ───────────────────────────────────────────────────────────────
const BREAKPOINT_MOBILE = 800;
const NAVBAR_SCROLL_THRESHOLD = 120;

const DISPLAY_TYPES = {
  HORIZONTAL_CARD: "horizontal-card",
  VERTICAL_CARD: "vertical-card",
  IMAGE_ONLY: "image-only",
};

// ─── Tag icon map ─────────────────────────────────────────────────────────────
const TAG_ICONS = {
  photography: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.434 3C15.136 3 15.787 3.369 16.148 3.971L16.921 5.257C17.011 5.408 17.174 5.5 17.35 5.5H19C20.657 5.5 22 6.843 22 8.5V18C22 19.657 20.657 21 19 21H5C3.343 21 2 19.657 2 18V8.5C2 6.843 3.343 5.5 5 5.5H6.65C6.826 5.5 6.989 5.408 7.079 5.257L7.852 3.971C8.213 3.369 8.864 3 9.566 3H14.434ZM12 8.5C9.515 8.5 7.5 10.515 7.5 13C7.5 15.485 9.515 17.5 12 17.5C14.485 17.5 16.5 15.485 16.5 13C16.5 10.515 14.485 8.5 12 8.5ZM12 10.5C13.381 10.5 14.5 11.619 14.5 13C14.5 14.381 13.381 15.5 12 15.5C10.619 15.5 9.5 14.381 9.5 13C9.5 11.619 10.619 10.5 12 10.5Z"/></svg>`,
  seo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3C4.134 3 1 6.134 1 10C1 13.866 4.134 17 8 17H9.071C9.024 16.673 9 16.34 9 16C9 15.66 9.024 15.327 9.071 15H8C5.239 15 3 12.761 3 10C3 7.239 5.239 5 8 5H16C18.761 5 21 7.239 21 10C21 10.343 20.966 10.678 20.9 11.001C21.485 11.575 21.97 12.251 22.326 13C22.758 12.091 23 11.074 23 10C23 6.134 19.866 3 16 3H8ZM16 13C14.343 13 13 14.343 13 16C13 17.657 14.343 19 16 19C17.657 19 19 17.657 19 16C19 14.343 17.657 13 16 13ZM11 16C11 13.239 13.239 11 16 11C18.761 11 21 13.239 21 16C21 17.019 20.695 17.967 20.172 18.757L22.707 21.293L21.293 22.707L18.757 20.172C17.967 20.695 17.019 21 16 21C13.239 21 11 18.761 11 16Z"/></svg>`,
  writing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.939 14.033C6.707 14.656 6.51 15.233 6.334 15.816C7.293 15.119 8.435 14.677 9.752 14.512C12.265 14.198 14.498 12.539 15.628 10.454L14.172 8.999L15.585 7.584C15.919 7.25 16.252 6.916 16.586 6.582C17.015 6.153 17.5 5.358 18.013 4.215C12.42 5.082 8.995 8.507 6.939 14.033ZM17 8.997L18 9.997C17 12.997 14 15.997 10 16.497C7.331 16.83 5.664 18.664 4.998 21.997H3C4 15.997 6 1.997 21 1.997C20.001 4.994 19.002 6.993 18.003 7.994C17.666 8.33 17.333 8.663 17 8.997Z"/></svg>`,
  editing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.728 9.576L14.314 8.162L5 17.476V18.89H6.414L15.728 9.576ZM17.142 8.162L18.556 6.748L17.142 5.334L15.728 6.748L17.142 8.162ZM7.243 20.89H3V16.647L16.435 3.212C16.825 2.822 17.458 2.822 17.849 3.212L20.677 6.041C21.068 6.431 21.068 7.064 20.677 7.455L7.243 20.89Z"/></svg>`,
};

// ─── Chart helpers ────────────────────────────────────────────────────────────
function getSegmentColor(ctx, hireDateIndex, beforeColor, afterColor) {
  const { p0DataIndex, p1DataIndex } = ctx;

  if (p0DataIndex === hireDateIndex - 1 && p1DataIndex === hireDateIndex) {
    const { chart } = ctx;
    const { ctx: canvasCtx, chartArea } = chart;
    if (!chartArea) return beforeColor;

    const meta = chart.getDatasetMeta(0).data;
    const gradient = canvasCtx.createLinearGradient(
      meta[hireDateIndex - 1].x,
      0,
      meta[hireDateIndex].x,
      0,
    );
    gradient.addColorStop(0, beforeColor);
    gradient.addColorStop(1, afterColor);
    return gradient;
  }
  return p0DataIndex < hireDateIndex ? beforeColor : afterColor;
}

function buildLineDataset(data, hireDateIndex) {
  const before = "#758fb5";
  const after = "#90c8f3";
  return {
    label: "",
    data,
    segment: {
      borderColor: (ctx) => getSegmentColor(ctx, hireDateIndex, before, after),
      backgroundColor: (ctx) =>
        ctx.p0DataIndex < hireDateIndex
          ? "rgba(117,143,181,0.1)"
          : "rgba(144,200,243,0.1)",
    },
    borderWidth: 3,
    pointRadius: 5,
    pointBackgroundColor: (ctx) =>
      ctx.dataIndex < hireDateIndex ? before : after,
    pointBorderColor: "#fff",
    pointBorderWidth: 2,
    tension: 0.4,
  };
}

function buildBarDataset(data, hireDateIndex) {
  return {
    label: "",
    data,
    backgroundColor: (ctx) =>
      ctx.dataIndex < hireDateIndex ? "#758fb5da" : "#90c8f3da",
    borderColor: (ctx) =>
      ctx.dataIndex < hireDateIndex ? "#758fb5" : "#90c8f3ff",
    borderWidth: 2,
    borderRadius: 6,
  };
}

function getChartDefaults() {
  const poppins = "'Poppins', sans-serif";
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        align: "center",
        font: { size: 16, weight: "bold", family: poppins },
        padding: { top: 10, bottom: 6 },
      },
      subtitle: {
        display: true,
        align: "center",
        font: { size: 11, family: poppins, style: "italic" },
        color: "#777",
        padding: { bottom: 14 },
      },
      annotation: {
        annotations: {
          hireDate: {
            type: "line",
            xMin: 1.5,
            xMax: 1.5,
            borderColor: "#ef4444ab",
            borderWidth: 1.5,
            borderDash: [5, 5],
            drawTime: "beforeDatasetsDraw",
            label: {
              display: true,
              content: "Hired Q3 2025",
              position: "start",
              backgroundColor: "#ef4444",
              color: "#fff",
              font: { size: 11, weight: "bold", family: poppins },
              padding: { x: 6, y: 4 },
              yAdjust: 8,
            },
          },
        },
      },
    },
    layout: { padding: { left: 8, right: 8, top: 8, bottom: 8 } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        grace: "50%",
        ticks: { font: { family: poppins } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: poppins }, align: "center", padding: 2 },
        offset: true,
      },
    },
  };
}

// ─── WebsiteManager class ─────────────────────────────────────────────────────
class WebsiteManager {
  #elements;
  #charts = {};
  #modal;
  #socialItems = [];
  #mediaFilter = "image";

  constructor() {
    this.#elements = this.#cacheElements();
    this.#modal = this.#createModal();
    this.#init();
  }

  // ── DOM cache ──────────────────────────────────────────────────────────────
  #cacheElements() {
    return {
      menuToggle: document.querySelector(".menu-toggle"),
      navList: document.querySelector(".nav-list"),
      sidebar: document.querySelector(".sidebar-nav"),
      navOverlay: document.querySelector(".nav-overlay"),
      clientBlogsGrid: document.querySelector("#client-blogs .works-grid"),
      socialGrid: document.querySelector("#social-showcase .works-grid"),
      mediaFilterButtons: document.querySelectorAll(".media-filter-btn"),
      redesignGrid: document.querySelector("#site-redesigns .works-grid"),
      resultsContainer: document.querySelector("#results .results-container"),
    };
  }

  // ── Modal ──────────────────────────────────────────────────────────────────
  #createModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image preview");

    const closeBtn = document.createElement("span");
    closeBtn.className = "modal__close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("tabindex", "0");
    closeBtn.setAttribute("aria-label", "Close image preview");

    const image = document.createElement("img");
    image.className = "modal__image";
    image.alt = "";

    modal.append(closeBtn, image);
    document.body.appendChild(modal);
    return { element: modal, closeBtn, image };
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  #init() {
    this.#setupEventListeners();
    this.loadContent();
    this.#updateActiveNavLink();
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  #setupEventListeners() {
    const { menuToggle, navList, navOverlay, mediaFilterButtons } =
      this.#elements;

    menuToggle?.addEventListener("click", () => this.#toggleMobileNav());
    navOverlay?.addEventListener("click", () => this.#closeMobileNav());

    navList?.addEventListener("click", (e) => {
      if (e.target.tagName === "A") this.#closeMobileNav();
    });

    // Throttled scroll
    let scrollTick = false;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(() => {
          this.#handleNavbarScroll();
          this.#updateActiveNavLink();
          scrollTick = false;
        });
      },
      { passive: true },
    );

    // Debounced resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > BREAKPOINT_MOBILE) this.#closeMobileNav();
      }, 150);
    });

    // Modal
    this.#modal.closeBtn.addEventListener("click", () => this.#closeModal());
    this.#modal.closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") this.#closeModal();
    });
    this.#modal.element.addEventListener("click", (e) => {
      if (e.target === this.#modal.element) this.#closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.#closeModal();
        if (window.innerWidth <= BREAKPOINT_MOBILE) this.#closeMobileNav();
      }
    });

    // Media filter
    mediaFilterButtons?.forEach((btn) => {
      btn.addEventListener("click", (e) => this.#handleMediaFilter(e));
    });
  }

  // ── Mobile nav ─────────────────────────────────────────────────────────────
  #toggleMobileNav() {
    this.#elements.sidebar.classList.contains("active")
      ? this.#closeMobileNav()
      : this.#openMobileNav();
  }

  #openMobileNav() {
    const { sidebar, menuToggle, navOverlay } = this.#elements;
    sidebar.classList.add("active");
    menuToggle.classList.add("active");
    navOverlay.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  #closeMobileNav() {
    const { sidebar, menuToggle, navOverlay } = this.#elements;
    sidebar.classList.remove("active");
    menuToggle.classList.remove("active");
    navOverlay.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // ── Media filter ───────────────────────────────────────────────────────────
  #handleMediaFilter(e) {
    const button = e.currentTarget;
    const filterType = button.dataset.filter;
    if (!filterType || filterType === this.#mediaFilter) return;

    this.#mediaFilter = filterType;

    // Update button states
    this.#elements.mediaFilterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filterType;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const grid = this.#elements.socialGrid;
    const filtered = this.#socialItems.filter(
      (i) => i.mediaType === filterType,
    );

    grid.style.transition = "opacity 0.2s ease";
    grid.style.opacity = "0";

    setTimeout(() => {
      this.#renderSection(filtered, grid);
      grid.style.opacity = "1";
    }, 200);
  }

  // ── Modal ──────────────────────────────────────────────────────────────────
  showModal(src, alt = "") {
    this.#modal.image.src = src;
    this.#modal.image.alt = alt;
    this.#modal.element.classList.add("active");
    document.body.style.overflow = "hidden";
    this.#modal.closeBtn.focus();
  }

  #closeModal() {
    this.#modal.element.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ── Navbar scroll ──────────────────────────────────────────────────────────
  #handleNavbarScroll() {
    this.#elements.sidebar?.classList.toggle(
      "navbar-scroll",
      window.scrollY > NAVBAR_SCROLL_THRESHOLD,
    );
  }

  // ── Active nav link ────────────────────────────────────────────────────────
  #updateActiveNavLink() {
    const navLinks = Array.from(
      this.#elements.navList?.querySelectorAll("a") ?? [],
    );
    if (!navLinks.length) return;

    const scrollY = window.scrollY + 120;
    let activeId = null;

    document
      .querySelectorAll("section")
      .forEach(({ offsetParent, offsetTop, offsetHeight, id }) => {
        if (!offsetParent) return;
        if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight)
          activeId = id;
      });

    if (activeId) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href")?.endsWith(`#${activeId}`),
        );
      });
    }
  }

  // ── Chart: stat cards ──────────────────────────────────────────────────────
  #createStatsRow(stats) {
    const row = document.createElement("div");
    row.className = "stats-row";

    stats.forEach(({ value, label, note }) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML = `
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
        <div class="stat-card__note">${note}</div>
      `;
      row.appendChild(card);
    });

    return row;
  }

  // ── Chart: group container ─────────────────────────────────────────────────
  #createChartGroup(group, labels, defaults) {
    const wrapper = document.createElement("div");
    wrapper.className = "chart-group";
    if (group.id) wrapper.id = group.id;

    // Group header
    if (group.title || group.description) {
      const header = document.createElement("div");
      header.className = "section-header";

      if (group.title) {
        const t = document.createElement("h3");
        t.className = "section-header__title";
        t.textContent = group.title;
        header.appendChild(t);
      }
      if (group.description) {
        const d = document.createElement("p");
        d.className = "section-header__description";
        d.textContent = group.description;
        header.appendChild(d);
      }

      wrapper.appendChild(header);
    }

    // Stat cards
    if (Array.isArray(group.stats) && group.stats.length) {
      wrapper.appendChild(this.#createStatsRow(group.stats));
    }

    // Charts grid
    const grid = document.createElement("div");
    grid.className = "charts-grid";

    group.charts.forEach((cfg) => {
      const chartWrapper = document.createElement("div");
      chartWrapper.className = "chart-wrapper";

      const canvas = document.createElement("canvas");
      const chartId = `${group.id}-${cfg.id}`;
      canvas.id = chartId;

      chartWrapper.appendChild(canvas);
      grid.appendChild(chartWrapper);

      // Build chart after canvas is in DOM
      requestAnimationFrame(() => {
        const dataset =
          cfg.type === "bar"
            ? buildBarDataset(cfg.data, cfg.hireDateIndex)
            : buildLineDataset(cfg.data, cfg.hireDateIndex);

        const options = JSON.parse(JSON.stringify(defaults)); // deep clone
        options.plugins.title.text = cfg.title ?? "";
        options.plugins.subtitle.text = cfg.subTitle ?? "";
        options.plugins.subtitle.display = Boolean(cfg.subTitle);

        this.#charts[chartId] = new Chart(canvas, {
          type: cfg.type,
          data: { labels, datasets: [dataset] },
          options,
        });
      });
    });

    wrapper.appendChild(grid);
    return wrapper;
  }

  // ── Charts: init from data ─────────────────────────────────────────────────
  #initCharts(chartGroups) {
    if (!this.#elements.resultsContainer || !Array.isArray(chartGroups)) return;

    const labels = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
    const defaults = getChartDefaults();

    this.#elements.resultsContainer.innerHTML = "";

    chartGroups.forEach((group) => {
      this.#elements.resultsContainer.appendChild(
        this.#createChartGroup(group, labels, defaults),
      );
    });
  }

  // ── Redesign section ───────────────────────────────────────────────────────
  #renderRedesignSection(items, container) {
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = "";

    const frag = document.createDocumentFragment();
    items.forEach((item, i) =>
      frag.appendChild(this.#createRedesignElement(item, i)),
    );
    container.appendChild(frag);
  }

  #createRedesignElement(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "redesign-item";

    if (item.title || item.description) {
      const info = document.createElement("div");
      info.className = "section-header";

      if (item.title) {
        const t = document.createElement("h3");
        t.className = "section-header__title";
        t.textContent = item.title;
        info.appendChild(t);
      }
      if (item.description) {
        const d = document.createElement("p");
        d.className = "section-header__description";
        d.textContent = item.description;
        info.appendChild(d);
      }
      wrapper.appendChild(info);
    }

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "comparison-slider-wrapper";

    const slider = document.createElement("img-comparison-slider");
    slider.className = "comparison-slider";
    slider.value = 50;

    // Before
    const beforeDiv = document.createElement("div");
    beforeDiv.slot = "first";
    beforeDiv.className = "before-container";
    const beforeImg = document.createElement("img");
    beforeImg.src = item.beforeImage;
    beforeImg.alt = `${item.title ?? "Site"} — Before`;
    beforeImg.loading = "lazy";
    beforeDiv.appendChild(beforeImg);

    // After (image or video)
    const afterDiv = document.createElement("div");
    afterDiv.slot = "second";
    afterDiv.className = "after-container";

    if (item.afterImage?.toLowerCase().endsWith(".webm")) {
      const v = document.createElement("video");
      v.src = item.afterImage;
      v.autoplay = v.loop = v.muted = v.playsInline = true;
      afterDiv.appendChild(v);
    } else {
      const afterImg = document.createElement("img");
      afterImg.src = item.afterImage;
      afterImg.alt = `${item.title ?? "Site"} — After`;
      afterImg.loading = "lazy";
      afterDiv.appendChild(afterImg);
    }

    slider.appendChild(beforeDiv);
    slider.appendChild(afterDiv);

    // Labels
    const beforeLabel = Object.assign(document.createElement("div"), {
      className: "comparison-label comparison-label--before",
      textContent: "Before",
    });
    const afterLabel = Object.assign(document.createElement("div"), {
      className: "comparison-label comparison-label--after",
      textContent: "After",
    });

    sliderWrapper.append(slider, beforeLabel, afterLabel);
    wrapper.appendChild(sliderWrapper);

    const syncLabels = () => {
      beforeLabel.style.opacity = slider.value > 15 ? "1" : "0";
      afterLabel.style.opacity = slider.value < 85 ? "1" : "0";
    };
    syncLabels();
    slider.addEventListener("slide", syncLabels);
    slider.addEventListener("change", syncLabels);

    return wrapper;
  }

  // ── Generic section render ─────────────────────────────────────────────────
  #renderSection(items, container) {
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = "";
    if (!items.length) return;

    const frag = document.createDocumentFragment();
    items.forEach((item) => frag.appendChild(this.#createItemElement(item)));
    container.appendChild(frag);
  }

  #createItemElement(item) {
    switch (item.displayType ?? DISPLAY_TYPES.IMAGE_ONLY) {
      case DISPLAY_TYPES.HORIZONTAL_CARD:
        return this.#createFullCard(item, true);
      case DISPLAY_TYPES.VERTICAL_CARD:
        return this.#createFullCard(item, false);
      default:
        return this.#createImageOnlyCard(item);
    }
  }

  // ── Card builders ──────────────────────────────────────────────────────────
  #createImageOnlyCard(item) {
    const card = document.createElement("div");
    card.className = "card card--image-only";

    if (item.mediaType === "video") {
      const v = document.createElement("video");
      v.src = item.media;
      v.className = "card__image";
      v.controls = v.muted = v.playsInline = true;
      card.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = item.media;
      img.alt = item.description ?? "Social media post";
      img.loading = "lazy";
      img.className = "card__image";
      card.addEventListener("click", () => this.showModal(item.media, img.alt));
      card.appendChild(img);
    }

    return card;
  }

  #createFullCard(item, isHorizontal) {
    const card = document.createElement("a");
    card.className = `card${isHorizontal ? " card--horizontal" : ""}`;

    if (item.link) {
      card.href = item.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.style.cursor = "default";
      card.onclick = (e) => e.preventDefault();
    }

    if (item.media) {
      const img = document.createElement("img");
      img.src = item.media;
      img.alt = item.title ?? "Article thumbnail";
      img.loading = "lazy";
      img.className = "card__image";
      card.appendChild(img);
    }

    card.appendChild(this.#createCardContent(item));
    return card;
  }

  #createCardContent(item) {
    const content = document.createElement("div");
    content.className = "card__content";

    if (item.title) {
      const t = document.createElement("h3");
      t.className = "card__title";
      t.textContent = item.title;
      content.appendChild(t);
    }
    if (item.description) {
      const d = document.createElement("p");
      d.className = "card__description";
      d.textContent = item.description;
      content.appendChild(d);
    }
    if (Array.isArray(item.tags) && item.tags.length) {
      content.appendChild(this.#createTagList(item.tags));
    }
    return content;
  }

  #createTagList(tags) {
    const list = document.createElement("div");
    list.className = "tag-list";

    tags.forEach((text) => {
      const tag = document.createElement("div");
      tag.className = "tag";
      const icon = TAG_ICONS[text.toLowerCase()] ?? "";
      tag.innerHTML = icon ? icon + text : "";
      if (!icon) tag.textContent = text;
      list.appendChild(tag);
    });

    return list;
  }

  // ── Data fetch ─────────────────────────────────────────────────────────────
  async loadContent() {
    try {
      const res = await fetch("data.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.socialMedia) {
        this.#socialItems = data.socialMedia;
        const initial = this.#socialItems.filter(
          (i) => i.mediaType === this.#mediaFilter,
        );
        this.#renderSection(initial, this.#elements.socialGrid);
      }

      if (data.articles) {
        this.#renderSection(data.articles, this.#elements.clientBlogsGrid);
      }

      if (data.siteRedesigns) {
        this.#renderRedesignSection(
          data.siteRedesigns,
          this.#elements.redesignGrid,
        );
      }

      if (data.chartGroups) {
        this.#initCharts(data.chartGroups);
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    }
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => new WebsiteManager());
