/**
 * script.js - vCard Personal Portfolio
 * Interactivity & Dynamic Features for Pranjal Jaiswal's Portfolio
 */

"use strict";

// --- Element Toggle Function ---
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// --- Sidebar Toggle Functionality (Mobile) ---
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
    const btnSpan = sidebarBtn.querySelector("span");
    if (sidebar.classList.contains("active")) {
      btnSpan.textContent = "Hide Contacts";
    } else {
      btnSpan.textContent = "Show Contacts";
    }
  });
}

// --- Navigation Tab Switching ---
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach((navLink) => {
  navLink.addEventListener("click", function () {
    const targetPage = this.getAttribute("data-nav-link");

    // Remove active class from all links and pages
    navigationLinks.forEach((link) => link.classList.remove("active"));
    pages.forEach((page) => page.classList.remove("active"));

    // Add active class to clicked link and target page
    this.classList.add("active");

    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
});

// --- Portfolio Filter Functionality ---
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () {
    const selectList = document.querySelector(".select-list");
    elementToggleFunc(selectList);
  });
}

// Filter Function
const filterFunc = function (selectedValue) {
  filterItems.forEach((item) => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (item.dataset.category.includes(selectedValue)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// Filter Button Click (Desktop)
let lastClickedBtn = filterBtn[0];

filterBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    const selectedValue = this.getAttribute("data-filter-btn");
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// Select Item Click (Mobile)
selectItems.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedValue = this.getAttribute("data-select-item");
    if (selectValue) selectValue.innerText = this.innerText;
    const selectList = document.querySelector(".select-list");
    if (selectList) selectList.classList.remove("active");
    filterFunc(selectedValue);

    // Sync desktop filter buttons
    filterBtn.forEach((btn) => {
      if (btn.getAttribute("data-filter-btn") === selectedValue) {
        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        btn.classList.add("active");
        lastClickedBtn = btn;
      }
    });
  });
});

// --- Project Details Database & Modal Popup ---
const projectDetails = {
  project1: {
    title: "Agent Task Tracker Dashboard",
    category: "Power BI & Viz / Automation",
    description:
      "Real-time performance tracking dashboard monitoring 15+ operational KPIs across 50+ service agents. Engine transforms 10,000+ daily raw call logs into clean metrics using Power Query ETL and custom VBA macros.",
    techStack: [
      "Power BI",
      "DAX",
      "Power Query",
      "VBA Macros",
      "Advanced Excel",
    ],
    githubUrl: "https://github.com/Pranjal098/Pranjal_Portfolio",
    iconClass: "fa-solid fa-chart-pie",
  },
  project2: {
    title: "E-Commerce Revenue EDA & RFM Analysis",
    category: "Python & EDA",
    description:
      "In-depth Exploratory Data Analysis on 100,000+ transactional records using Python (Pandas, Seaborn). Performed RFM (Recency, Frequency, Monetary) segmentation to identify high-value buyer cohorts and drive revenue optimization.",
    techStack: [
      "Python",
      "Pandas",
      "NumPy",
      "Seaborn",
      "SQL",
      "RFM Segmentation",
    ],
    githubUrl: "https://github.com/Pranjal098/Pranjal_Portfolio",
    iconClass: "fa-brands fa-python",
  },
  project3: {
    title: "Excel Shorts Studio",
    category: "Automation & Content Engine",
    description:
      "Automated browser-based content generation engine producing 9:16 vertical Excel tips for YouTube Shorts. Features animated spreadsheet canvas, synchronized text-to-speech audio, and automatic YouTube metadata generation.",
    techStack: [
      "JavaScript",
      "HTML5 Canvas",
      "Web Audio API",
      "CSS Animations",
      "YouTube API",
    ],
    githubUrl: "https://github.com/Pranjal098/Pranjal_Portfolio",
    iconClass: "fa-solid fa-video",
  },
  project4: {
    title: "EduSphere Course Comparator",
    category: "Widescreen Analytics UI",
    description:
      "Desktop-first interactive web application for comparing tech courses, tuition fees, placement stats, and curriculum depth. Built with reactive UI state and custom CSS glassmorphism.",
    techStack: [
      "HTML5",
      "CSS3 Glassmorphism",
      "JavaScript ES6+",
      "Data Modeling",
    ],
    githubUrl: "https://github.com/Pranjal098/Pranjal_Portfolio",
    iconClass: "fa-solid fa-laptop-code",
  },
  project5: {
    title: "Real-Time SLA Alert Engine",
    category: "Automation & SQL",
    description:
      "SQL-backed automated alerting workflow engineered via Power Automate. Monitors database incident logs and broadcasts instant Slack/Teams alerts to management, cutting SLA incident resolution times by 40%.",
    techStack: ["SQL", "MySQL", "Power Automate", "VBA", "REST APIs"],
    githubUrl: "https://github.com/Pranjal098/Pranjal_Portfolio",
    iconClass: "fa-solid fa-bolt",
  },
};

const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalText = document.getElementById("modal-text");
const modalTech = document.getElementById("modal-tech");
const modalGithub = document.getElementById("modal-github");
const modalBanner = document.getElementById("modal-banner");

// Project Cards Click Trigger
const projectCards = document.querySelectorAll("[data-project-id]");

projectCards.forEach((card) => {
  card.addEventListener("click", function () {
    const projectId = this.getAttribute("data-project-id");
    const data = projectDetails[projectId];

    if (data && modalContainer) {
      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalText.innerHTML = `<p>${data.description}</p>`;

      // Render Tech Stack Badges
      modalTech.innerHTML = data.techStack
        .map(
          (tech) =>
            `<span class="skill-tag"><i class="fa-solid fa-check"></i> ${tech}</span>`,
        )
        .join("");

      if (data.githubUrl) {
        modalGithub.href = data.githubUrl;
        modalGithub.style.display = "inline-flex";
      } else {
        modalGithub.style.display = "none";
      }

      if (modalBanner) {
        modalBanner.innerHTML = `<div class="modal-icon-badge"><i class="${data.iconClass}"></i></div>`;
      }

      modalContainer.classList.add("active");
    }
  });
});

// Close Modal
const closeModal = function () {
  if (modalContainer) modalContainer.classList.remove("active");
};

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (overlay) overlay.addEventListener("click", closeModal);

// --- Contact Form Submission & Toast ---
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast-notification");
const toastMessage = document.getElementById("toast-message");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = contactForm.querySelector("[name='fullname']").value;

    // Show Toast
    if (toast) {
      toastMessage.textContent = `Thank you, ${name}! Your message has been received.`;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 4000);
    }

    contactForm.reset();
  });
}
