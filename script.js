/**
 * script.js - JSON-Driven vCard Personal Portfolio
 * Dynamically loads content from data.json for effortless updates via GitHub
 */

'use strict';

let globalPortfolioData = null;

// --- Sidebar Toggle Functionality (Mobile) ---
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    const btnSpan = sidebarBtn.querySelector("span");
    if (sidebar.classList.contains("active")) {
      btnSpan.textContent = "Hide Contacts";
    } else {
      btnSpan.textContent = "Show Contacts";
    }
  });
}

// --- Dynamic Content Rendering from data.json ---
async function loadPortfolioData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error("Failed to load data.json");
    const data = await response.json();
    globalPortfolioData = data;

    renderProfile(data.profile);
    renderStats(data.stats);
    renderAbout(data.about);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderInsights(data.insights);

    // Initialize Filter & Modal listeners after DOM rendering
    initPortfolioFilters();
    initProjectModals();
  } catch (err) {
    console.warn("Using fallback static DOM content or error loading data.json:", err);
    initPortfolioFilters();
    initProjectModals();
  }
}

// --- Render Functions ---
function renderProfile(profile) {
  if (!profile) return;
  const nameEl = document.querySelector(".name");
  const titleEl = document.querySelector(".title");
  const statusBadge = document.querySelector(".status-badge");
  const avatarImg = document.getElementById("user-avatar");
  const downloadCvBtn = document.querySelector(".download-cv-btn");

  if (nameEl) nameEl.textContent = profile.name;
  if (titleEl) titleEl.textContent = profile.title;
  if (avatarImg && profile.avatar) avatarImg.src = profile.avatar;
  if (downloadCvBtn && profile.resumeUrl) downloadCvBtn.href = profile.resumeUrl;
  if (statusBadge) statusBadge.innerHTML = `<i class="fa-solid fa-circle"></i> ${profile.status || "Available"}`;

  // Contacts
  const contactsList = document.querySelector(".contacts-list");
  if (contactsList) {
    contactsList.innerHTML = `
      <li class="contact-item">
        <div class="icon-box"><i class="fa-regular fa-envelope"></i></div>
        <div class="contact-info">
          <p class="contact-title">Email</p>
          <a href="mailto:${profile.email}" class="contact-link">${profile.email}</a>
        </div>
      </li>
      <li class="contact-item">
        <div class="icon-box"><i class="fa-solid fa-location-dot"></i></div>
        <div class="contact-info">
          <p class="contact-title">Location</p>
          <address>${profile.location}</address>
        </div>
      </li>
      <li class="contact-item">
        <div class="icon-box"><i class="fa-solid fa-graduation-cap"></i></div>
        <div class="contact-info">
          <p class="contact-title">Education</p>
          <p class="contact-text">${profile.education}</p>
        </div>
      </li>
    `;
  }

  // Socials
  const socialList = document.querySelector(".social-list");
  if (socialList && profile.socials) {
    socialList.innerHTML = profile.socials.map(soc => `
      <li class="social-item">
        <a href="${soc.url}" target="_blank" class="social-link" title="${soc.platform}">
          <i class="${soc.icon}"></i>
        </a>
      </li>
    `).join("");
  }
}

function renderStats(stats) {
  if (!stats) return;
  const container = document.querySelector(".stats-overview");
  if (!container) return;
  container.innerHTML = stats.map(stat => `
    <div class="stat-card">
      <div class="stat-icon"><i class="${stat.icon}"></i></div>
      <div class="stat-data">
        <span class="stat-number">${stat.number}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    </div>
  `).join("");
}

function renderAbout(about) {
  if (!about) return;
  const aboutTextSec = document.querySelector(".about-text");
  if (aboutTextSec && about.paragraphs) {
    aboutTextSec.innerHTML = `
      <p class="highlight-lead">${about.paragraphs[0] ? about.paragraphs[0].replace(/<[^>]*>?/gm, '') : ''}</p>
      ${about.paragraphs.map(p => `<p>${p}</p>`).join("")}
    `;
  }

  // Services
  const serviceList = document.querySelector(".service-list");
  if (serviceList && about.services) {
    serviceList.innerHTML = about.services.map(serv => `
      <li class="service-item">
        <div class="service-icon-box"><i class="${serv.icon}"></i></div>
        <div class="service-content-box">
          <h4 class="h4 service-item-title">${serv.title}</h4>
          <p class="service-item-text">${serv.description}</p>
        </div>
      </li>
    `).join("");
  }

  // Highlights
  const testimonialsList = document.querySelector(".testimonials-list");
  if (testimonialsList && about.highlights) {
    testimonialsList.innerHTML = about.highlights.map(high => `
      <li class="testimonials-item">
        <div class="content-card">
          <div class="testimonials-avatar-box">
            <div class="testimonial-icon-circle"><i class="${high.icon}"></i></div>
          </div>
          <h4 class="h4 testimonials-item-title">${high.title}</h4>
          <div class="testimonials-text">
            <p>${high.description}</p>
          </div>
        </div>
      </li>
    `).join("");
  }
}

function renderExperience(experience) {
  if (!experience) return;
  const expContainer = document.querySelectorAll(".timeline-list")[0];
  if (!expContainer) return;

  expContainer.innerHTML = experience.map(exp => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${exp.role}</h4>
      <span class="timeline-company"><i class="fa-solid fa-building"></i> ${exp.company}</span>
      <span class="timeline-period"><i class="fa-regular fa-calendar"></i> ${exp.period}</span>
      <ul class="timeline-bullets">
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
      </ul>
    </li>
  `).join("");
}

function renderEducation(education) {
  if (!education) return;
  const eduContainer = document.querySelectorAll(".timeline-list")[1];
  if (!eduContainer) return;

  eduContainer.innerHTML = education.map(edu => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${edu.degree}</h4>
      <span class="timeline-company"><i class="fa-solid fa-university"></i> ${edu.institution}</span>
      <span class="timeline-period"><i class="fa-regular fa-star"></i> ${edu.score}</span>
      <p class="timeline-text">${edu.details}</p>
    </li>
  `).join("");
}

function renderSkills(skills) {
  if (!skills) return;
  const skillsList = document.querySelector(".skills-list");
  if (!skillsList) return;

  skillsList.innerHTML = skills.map(sk => `
    <li class="skills-item">
      <div class="title-wrapper">
        <h5 class="h5">${sk.name}</h5>
        <data value="${sk.level}">${sk.level}%</data>
      </div>
      <div class="skill-progress-bg">
        <div class="skill-progress-fill" style="width: ${sk.level}%;"></div>
      </div>
    </li>
  `).join("");
}

function renderProjects(projects) {
  if (!projects) return;
  const projectList = document.querySelector(".project-list");
  if (!projectList) return;

  projectList.innerHTML = projects.map(proj => `
    <li class="project-item active" data-filter-item data-category="${proj.category}" data-project-id="${proj.id}">
      <div class="project-card">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <i class="fa-regular fa-eye"></i>
          </div>
          <div class="project-preview-mockup ${proj.gradientClass}">
            <i class="${proj.iconClass} mockup-icon"></i>
            <span class="mockup-tag">${proj.mockupTag}</span>
          </div>
        </figure>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-category">${proj.categoryLabel}</p>
        <p class="project-desc">${proj.description}</p>
      </div>
    </li>
  `).join("");
}

function renderInsights(insights) {
  if (!insights) return;
  const blogList = document.querySelector(".blog-posts-list");
  if (!blogList) return;

  blogList.innerHTML = insights.map(b => `
    <li class="blog-post-item">
      <a href="#" class="blog-card" data-blog-modal="${b.id}">
        <figure class="blog-banner-box">
          <div class="blog-banner-placeholder ${b.gradientClass}">
            <i class="${b.iconClass}"></i>
          </div>
        </figure>
        <div class="blog-content">
          <div class="blog-meta">
            <p class="blog-category">${b.category}</p>
            <span class="dot"></span>
            <time>${b.date}</time>
          </div>
          <h3 class="h3 blog-item-title">${b.title}</h3>
          <p class="blog-text">${b.summary}</p>
        </div>
      </a>
    </li>
  `).join("");
}

// --- Navigation Tab Switching ---
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(navLink => {
  navLink.addEventListener("click", function () {
    const targetPage = this.getAttribute("data-nav-link");

    navigationLinks.forEach(link => link.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    this.classList.add("active");

    pages.forEach(page => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
});

// --- Portfolio Filters Setup ---
function initPortfolioFilters() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  if (select) {
    select.onclick = function () {
      const selectList = document.querySelector(".select-list");
      if (selectList) selectList.classList.toggle("active");
    };
  }

  const filterFunc = function (selectedValue) {
    filterItems.forEach(item => {
      if (selectedValue === "all") {
        item.classList.add("active");
      } else if (item.dataset.category.includes(selectedValue)) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.onclick = function () {
      const selectedValue = this.getAttribute("data-filter-btn");
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    };
  });

  selectItems.forEach(item => {
    item.onclick = function () {
      const selectedValue = this.getAttribute("data-select-item");
      if (selectValue) selectValue.innerText = this.innerText;
      const selectList = document.querySelector(".select-list");
      if (selectList) selectList.classList.remove("active");
      filterFunc(selectedValue);
    };
  });
}

// --- Project Details Modal ---
function initProjectModals() {
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalText = document.getElementById("modal-text");
  const modalTech = document.getElementById("modal-tech");
  const modalGithub = document.getElementById("modal-github");
  const modalDemo = document.getElementById("modal-demo");
  const modalBanner = document.getElementById("modal-banner");
  const modalDashboardContainer = document.getElementById("modal-dashboard-container");
  const embedFrameWrapper = document.getElementById("embed-frame-wrapper");

  const projectCards = document.querySelectorAll("[data-project-id]");

  projectCards.forEach(card => {
    card.onclick = function () {
      const projectId = this.getAttribute("data-project-id");
      let data = null;

      if (globalPortfolioData && globalPortfolioData.projects) {
        data = globalPortfolioData.projects.find(p => p.id === projectId);
      }

      if (data && modalContainer) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.categoryLabel || data.category;
        modalText.innerHTML = `<p>${data.fullDescription || data.description}</p>`;

        modalTech.innerHTML = (data.techStack || [])
          .map(tech => `<span class="skill-tag"><i class="fa-solid fa-check"></i> ${tech}</span>`)
          .join("");

        // Handle Live Embedded Dashboard (Power BI iframe or Web Embed)
        if (modalDashboardContainer && embedFrameWrapper) {
          if (data.embedUrl) {
            embedFrameWrapper.innerHTML = `<iframe src="${data.embedUrl}" allowfullscreen="true" title="${data.title}"></iframe>`;
            modalDashboardContainer.style.display = "block";
          } else {
            embedFrameWrapper.innerHTML = "";
            modalDashboardContainer.style.display = "none";
          }
        }

        if (modalDemo) {
          if (data.demoUrl) {
            modalDemo.href = data.demoUrl;
            modalDemo.style.display = "inline-flex";
          } else {
            modalDemo.style.display = "none";
          }
        }

        if (modalGithub) {
          if (data.githubUrl) {
            modalGithub.href = data.githubUrl;
            modalGithub.style.display = "inline-flex";
          } else {
            modalGithub.style.display = "none";
          }
        }

        if (modalBanner) {
          modalBanner.innerHTML = `<div class="modal-icon-badge"><i class="${data.iconClass}"></i></div>`;
        }

        modalContainer.classList.add("active");
      }
    };
  });

  const closeModal = function () {
    if (modalContainer) modalContainer.classList.remove("active");
  };

  if (modalCloseBtn) modalCloseBtn.onclick = closeModal;
  if (overlay) overlay.onclick = closeModal;
}

// --- Contact Form Handling ---
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast-notification");
const toastMessage = document.getElementById("toast-message");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = contactForm.querySelector("[name='fullname']").value;

    if (toast) {
      toastMessage.textContent = `Thank you, ${name}! Your message has been received.`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4000);
    }
    contactForm.reset();
  });
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", loadPortfolioData);
