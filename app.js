/**
 * ResumeFlow - Core Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const cvPreview = document.getElementById('cv-preview');

  // Tab Controls
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Repeating Lists Containers
  const experienceList = document.getElementById('experience-list');
  const educationList = document.getElementById('education-list');
  const projectList = document.getElementById('project-list');
  const skillsList = document.getElementById('skills-list');
  const certificationsList = document.getElementById('certifications-list');
  const languagesList = document.getElementById('languages-list');

  // Adding Items Buttons
  const btnAddExperience = document.getElementById('btn-add-experience');
  const btnAddEducation = document.getElementById('btn-add-education');
  const btnAddProject = document.getElementById('btn-add-project');
  const btnAddSkillGroup = document.getElementById('btn-add-skill-group');
  const btnAddCertification = document.getElementById('btn-add-certification');
  const btnAddLanguage = document.getElementById('btn-add-language');

  // Header Actions
  const btnLoadSample = document.getElementById('btn-load-sample');
  const btnClear = document.getElementById('btn-clear');
  const inputImport = document.getElementById('input-import');
  const btnExport = document.getElementById('btn-export');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  // Customization Controls
  const templateButtons = document.querySelectorAll('.selector-btn');
  const colorDots = document.querySelectorAll('.color-dot');
  const selectFont = document.getElementById('select-font');
  const selectMargins = document.getElementById('select-margins');
  const sliderZoom = document.getElementById('slider-zoom');
  const zoomLabel = document.getElementById('zoom-label');

  // Preview elements
  const pvName = document.getElementById('pv-name');
  const pvTitle = document.getElementById('pv-title');
  const pvContacts = document.getElementById('pv-contacts');
  const pvSummaryContent = document.getElementById('pv-summary-content');
  const pvExperienceList = document.getElementById('pv-experience-list');
  const pvEducationList = document.getElementById('pv-education-list');
  const pvProjectList = document.getElementById('pv-project-list');
  const pvSkillsList = document.getElementById('pv-skills-list');
  const pvCertificationsList = document.getElementById('pv-certifications-list');
  const pvLanguagesList = document.getElementById('pv-languages-list');

  // --- Sample Professional Data ---
  const SAMPLE_DATA = {
    profile: {
      name: "Sarah Johnson",
      title: "Operations Manager",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 234-5678",
      location: "Chicago, IL",
      website: "sarahjohnson.com",
      linkedin: "linkedin.com/in/sarahjohnson",
      github: "",
      summary: "Results-gic artmental collaboration."
    },
    experience: [
      {
        role: "Operations Manager",
        company: "Global Retail Solutions",
        location: "Chicago, IL",
        start: "Mar 2021",
        end: "Present",
        desc: "- Managed daily operations of 5 regional offices with 120+ staff members\n- Reduced operational costs by 25% through process optimization and vendor renegotiations\n- Implemented new inventory management system, improving order accuracy from 87% to 99%"
      },
      {
        role: "Assistant Operations Manager",
        company: "Bright Horizons Corp",
        location: "Detroit, MI",
        start: "Jun 2017",
        end: "Feb 2021",
        desc: "- Coordinated logistics for 3 warehouses, ensuring on-time delivery rate of 98%\n- Trained and supervised a team of 40 employees across multiple shifts\n- Developed standard operating procedures adopted company-wide"
      }
    ],
    education: [
      {
        degree: "MBA in Business Administration",
        school: "University of Michigan",
        location: "Ann Arbor, MI",
        start: "2015",
        end: "2017",
        desc: "Concentration in Operations Management. GPA: 3.7/4.0."
      },
      {
        degree: "B.A. in Business Studies",
        school: "Michigan State University",
        location: "East Lansing, MI",
        start: "2011",
        end: "2015",
        desc: "Graduated with Distinction."
      }
    ],
    projects: [
      {
        name: "Company-Wide Process Improvement Initiative",
        link: "",
        desc: "Led a cross-functional team to redesign core business workflows, resulting in 30% faster turnaround times and annual savings of $200K."
      },
      {
        name: "Community Outreach Program",
        link: "",
        desc: "Organized and managed a volunteer program with local non-profits, engaging 50+ employees and serving 1,000+ community members annually."
      }
    ],
    skills: [
      {
        groupName: "Management & Leadership",
        tags: "Team Leadership, Strategic Planning, Project Management, Budgeting, Staff Training"
      },
      {
        groupName: "Technical Skills",
        tags: "Microsoft Office Suite, SAP, Salesforce, Tableau, QuickBooks"
      },
      {
        groupName: "Soft Skills",
        tags: "Communication, Problem Solving, Negotiation, Time Management, Adaptability"
      }
    ],
    certifications: [
      {
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        date: "2023"
      },
      {
        name: "Lean Six Sigma Green Belt",
        issuer: "ASQ",
        date: "2022"
      }
    ],
    languages: [
      {
        name: "English",
        level: "Native"
      },
      {
        name: "French",
        level: "Intermediate"
      }
    ]
  };

  // --- Local State Settings ---
  let appState = {
    template: 'template-modern',
    color: 'sapphire',
    font: 'font-inter',
    margin: 'margin-normal',
    zoom: 100
  };

  // --- Initializing App ---
  init();

  function init() {
    // 1. Load customization options from localStorage if they exist
    loadSettingsFromStorage();

    // 2. Attach Event Handlers for UI tabs and settings
    setupTabControls();
    setupSettingControls();
    setupHeaderControls();
    setupListButtons();

    // 3. Attach Reactive Input Event Delegation
    document.querySelector('.editor-content-container').addEventListener('input', updateStateAndPreview);
    document.querySelector('.editor-content-container').addEventListener('change', updateStateAndPreview);

    // 4. Load saved CV data or inject default empty lists
    const savedData = localStorage.getItem('resumeFlow_cvData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        populateEditor(parsed);
      } catch (e) {
        console.error("Failed to parse cached CV data", e);
        clearAllData();
      }
    } else {
      // Default: Start with a clean empty canvas
      clearAllData();
    }

    // 5. Initialize icons
    lucide.createIcons();
  }

  // --- Settings Persistence ---
  function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('resumeFlow_settings');
    if (savedSettings) {
      try {
        appState = { ...appState, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }

    // Apply Settings to Controls
    // Template
    templateButtons.forEach(btn => {
      if (btn.getAttribute('data-template') === appState.template) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Color
    colorDots.forEach(dot => {
      if (dot.getAttribute('data-color') === appState.color) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Font
    selectFont.value = appState.font;

    // Margins
    selectMargins.value = appState.margin;

    // Zoom
    sliderZoom.value = appState.zoom;
    zoomLabel.innerText = `${appState.zoom}%`;

    // Apply classes to Preview Container
    updatePreviewClasses();
  }

  function saveSettingsToStorage() {
    localStorage.setItem('resumeFlow_settings', JSON.stringify(appState));
  }

  function updatePreviewClasses() {
    // Reset all customization classes
    cvPreview.className = 'cv-sheet';

    // Add active ones
    cvPreview.classList.add(appState.template);
    cvPreview.classList.add(appState.font);
    cvPreview.classList.add(appState.margin);
    cvPreview.classList.add(`color-theme-${appState.color}`);

    // Apply Zoom Transform
    const scale = appState.zoom / 100;
    // We update scale using style
    cvPreview.style.transform = `scale(${scale})`;

    // Add compensation margin to parent viewport container so scroll dimensions scale properly
    // Height of A4 sheet is 297mm. The scaled height is 297 * scale.
    // The margin bottom needs to offset the difference so scroll doesn't leave a huge blank space or clip the bottom.
    const viewportWrapper = cvPreview.parentElement;
    if (viewportWrapper) {
      const marginOffset = Math.max(0, (297 * (scale - 1)) * 3.7795); // Convert mm to approx px (3.7795 px/mm)
      cvPreview.style.marginBottom = `${marginOffset}px`;
    }
  }

  // --- Tab Switcher Logic ---
  function setupTabControls() {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(c => c.classList.remove('active'));

        // Activate selected
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // --- Settings UI Logic ---
  function setupSettingControls() {
    // Template Buttons
    templateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        templateButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.template = btn.getAttribute('data-template');
        saveSettingsToStorage();
        updatePreviewClasses();
      });
    });

    // Color Theme Picker
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        appState.color = dot.getAttribute('data-color');
        saveSettingsToStorage();
        updatePreviewClasses();
      });
    });

    // Font Select
    selectFont.addEventListener('change', () => {
      appState.font = selectFont.value;
      saveSettingsToStorage();
      updatePreviewClasses();
    });

    // Margin Select
    selectMargins.addEventListener('change', () => {
      appState.margin = selectMargins.value;
      saveSettingsToStorage();
      updatePreviewClasses();
    });

    // Zoom Slider
    sliderZoom.addEventListener('input', () => {
      appState.zoom = parseInt(sliderZoom.value);
      zoomLabel.innerText = `${appState.zoom}%`;
      saveSettingsToStorage();
      updatePreviewClasses();
    });
  }

  // --- Header Operations ---
  function setupHeaderControls() {
    btnLoadSample.addEventListener('click', loadSampleData);

    btnClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your resume details? This cannot be undone.')) {
        clearAllData();
      }
    });

    // PDF Print trigger
    btnDownloadPdf.addEventListener('click', () => {
      // Force zoom to 100% temporarily for a clean print trigger, then restore it
      const originalZoom = appState.zoom;
      appState.zoom = 100;
      updatePreviewClasses();

      setTimeout(() => {
        window.print();

        // Restore zoom
        appState.zoom = originalZoom;
        updatePreviewClasses();
      }, 250);
    });
  }

  // --- Form List Mutators ---
  function setupListButtons() {
    btnAddExperience.addEventListener('click', () => {
      addExperienceCard();
      updateStateAndPreview();
    });

    btnAddEducation.addEventListener('click', () => {
      addEducationCard();
      updateStateAndPreview();
    });

    btnAddProject.addEventListener('click', () => {
      addProjectCard();
      updateStateAndPreview();
    });

    btnAddSkillGroup.addEventListener('click', () => {
      addSkillGroupCard();
      updateStateAndPreview();
    });

    btnAddCertification.addEventListener('click', () => {
      addCertificationCard();
      updateStateAndPreview();
    });

    btnAddLanguage.addEventListener('click', () => {
      addLanguageCard();
      updateStateAndPreview();
    });
  }

  // --- Dynamic Repeating Cards (Editor DOM generators) ---

  function addExperienceCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card experience-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Job"><i data-lucide="trash-2"></i></button>
      <div class="card-order-controls">
        <button class="order-btn order-up" title="Move Up"><i data-lucide="arrow-up"></i></button>
        <button class="order-btn order-down" title="Move Down"><i data-lucide="arrow-down"></i></button>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="exp-role" placeholder="e.g. Project Manager" value="${data.role || ''}">
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" class="exp-company" placeholder="Acme Inc." value="${data.company || ''}">
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="exp-location" placeholder="City, State" value="${data.location || ''}">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="text" class="exp-start" placeholder="Jan 2020" value="${data.start || ''}">
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="text" class="exp-end" placeholder="Present" value="${data.end || ''}">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Description & Achievements</label>
        <textarea class="exp-desc" rows="4" placeholder="Describe your responsibilities and achievements (use bullet points starting with - or • for nice lists)...">${data.desc || ''}</textarea>
      </div>
    `;
    experienceList.appendChild(card);
    bindCardControls(card);
  }

  function addEducationCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card education-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Education"><i data-lucide="trash-2"></i></button>
      <div class="card-order-controls">
        <button class="order-btn order-up" title="Move Up"><i data-lucide="arrow-up"></i></button>
        <button class="order-btn order-down" title="Move Down"><i data-lucide="arrow-down"></i></button>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Degree / Qualification</label>
          <input type="text" class="edu-degree" placeholder="e.g. B.A. in Business" value="${data.degree || ''}">
        </div>
        <div class="form-group">
          <label>School / Institution</label>
          <input type="text" class="edu-school" placeholder="Boston University" value="${data.school || ''}">
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="edu-location" placeholder="Boston, MA" value="${data.location || ''}">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Start / Graduation Date</label>
            <input type="text" class="edu-end" placeholder="May 2018" value="${data.end || ''}">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Honors, GPA or Coursework</label>
        <input type="text" class="edu-desc" placeholder="GPA: 3.8/4.0. Dean's List." value="${data.desc || ''}">
      </div>
    `;
    educationList.appendChild(card);
    bindCardControls(card);
  }

  function addProjectCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card project-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Project"><i data-lucide="trash-2"></i></button>
      <div class="card-order-controls">
        <button class="order-btn order-up" title="Move Up"><i data-lucide="arrow-up"></i></button>
        <button class="order-btn order-down" title="Move Down"><i data-lucide="arrow-down"></i></button>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Project Name</label>
          <input type="text" class="proj-name" placeholder="e.g. Marketing Campaign" value="${data.name || ''}">
        </div>
        <div class="form-group">
          <label>Link (optional)</label>
          <input type="text" class="proj-link" placeholder="e.g. yoursite.com/project" value="${data.link || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="proj-desc" rows="3" placeholder="Briefly describe the project, your role, and the outcome...">${data.desc || ''}</textarea>
      </div>
    `;
    projectList.appendChild(card);
    bindCardControls(card);
  }

  function addSkillGroupCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card skill-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Skill Group"><i data-lucide="trash-2"></i></button>
      <div class="card-order-controls">
        <button class="order-btn order-up" title="Move Up"><i data-lucide="arrow-up"></i></button>
        <button class="order-btn order-down" title="Move Down"><i data-lucide="arrow-down"></i></button>
      </div>
      <div class="form-group">
        <label>Group Name</label>
        <input type="text" class="skill-group" placeholder="e.g. Technical Skills" value="${data.groupName || ''}">
      </div>
      <div class="form-group">
        <label>Skills (separated by commas)</label>
        <input type="text" class="skill-tags" placeholder="e.g. Leadership, Communication, Excel" value="${data.tags || ''}">
      </div>
    `;
    skillsList.appendChild(card);
    bindCardControls(card);
  }

  function addCertificationCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card certification-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Certification"><i data-lucide="trash-2"></i></button>
      <div class="form-group-row">
        <div class="form-group">
          <label>Certification Title</label>
          <input type="text" class="cert-name" placeholder="AWS Certified Solutions Architect" value="${data.name || ''}">
        </div>
        <div class="form-group">
          <label>Issuing Organization</label>
          <input type="text" class="cert-issuer" placeholder="Amazon Web Services" value="${data.issuer || ''}">
        </div>
        <div class="form-group" style="max-width: 100px;">
          <label>Year</label>
          <input type="text" class="cert-date" placeholder="2022" value="${data.date || ''}">
        </div>
      </div>
    `;
    certificationsList.appendChild(card);

    // Simplistic remove listener for mini cards
    card.querySelector('.card-remove-btn').addEventListener('click', () => {
      card.remove();
      updateStateAndPreview();
    });
  }

  function addLanguageCard(data = {}) {
    const card = document.createElement('div');
    card.className = 'repeating-card language-card';
    card.innerHTML = `
      <button class="card-remove-btn" title="Remove Language"><i data-lucide="trash-2"></i></button>
      <div class="form-group-row">
        <div class="form-group">
          <label>Language</label>
          <input type="text" class="lang-name" placeholder="French" value="${data.name || ''}">
        </div>
        <div class="form-group">
          <label>Proficiency</label>
          <input type="text" class="lang-level" placeholder="Full Professional / Conversational" value="${data.level || ''}">
        </div>
      </div>
    `;
    languagesList.appendChild(card);

    // Simplistic remove listener for mini cards
    card.querySelector('.card-remove-btn').addEventListener('click', () => {
      card.remove();
      updateStateAndPreview();
    });
  }

  // --- Repeating Card Utilities ---
  function bindCardControls(card) {
    // Remove Button
    card.querySelector('.card-remove-btn').addEventListener('click', () => {
      card.remove();
      updateStateAndPreview();
    });

    // Move Up Button
    card.querySelector('.order-up').addEventListener('click', () => {
      const parent = card.parentNode;
      const previous = card.previousElementSibling;
      if (previous) {
        parent.insertBefore(card, previous);
        updateStateAndPreview();
      }
    });

    // Move Down Button
    card.querySelector('.order-down').addEventListener('click', () => {
      const parent = card.parentNode;
      const next = card.nextElementSibling;
      if (next) {
        // insertBefore(node, target) puts node before target. To put it after, we put it before next's next sibling.
        parent.insertBefore(card, next.nextSibling);
        updateStateAndPreview();
      }
    });

    lucide.createIcons({
      attrs: {
        class: 'lucide'
      },
      nameAttr: 'data-lucide',
      node: card
    });
  }

  // --- Harvest values from DOM to structure ---
  function harvestData() {
    return {
      profile: {
        name: document.getElementById('profile-name').value,
        title: document.getElementById('profile-title').value,
        email: document.getElementById('profile-email').value,
        phone: document.getElementById('profile-phone').value,
        location: document.getElementById('profile-location').value,
        website: document.getElementById('profile-website').value,
        linkedin: document.getElementById('profile-linkedin').value,
        github: document.getElementById('profile-github').value,
        summary: document.getElementById('profile-summary').value
      },
      experience: Array.from(experienceList.querySelectorAll('.experience-card')).map(card => ({
        role: card.querySelector('.exp-role').value,
        company: card.querySelector('.exp-company').value,
        location: card.querySelector('.exp-location').value,
        start: card.querySelector('.exp-start').value,
        end: card.querySelector('.exp-end').value,
        desc: card.querySelector('.exp-desc').value
      })),
      education: Array.from(educationList.querySelectorAll('.education-card')).map(card => ({
        degree: card.querySelector('.edu-degree').value,
        school: card.querySelector('.edu-school').value,
        location: card.querySelector('.edu-location').value,
        end: card.querySelector('.edu-end').value,
        desc: card.querySelector('.edu-desc').value
      })),
      projects: Array.from(projectList.querySelectorAll('.project-card')).map(card => ({
        name: card.querySelector('.proj-name').value,
        link: card.querySelector('.proj-link').value,
        desc: card.querySelector('.proj-desc').value
      })),
      skills: Array.from(skillsList.querySelectorAll('.skill-card')).map(card => ({
        groupName: card.querySelector('.skill-group').value,
        tags: card.querySelector('.skill-tags').value
      })),
      certifications: Array.from(certificationsList.querySelectorAll('.certification-card')).map(card => ({
        name: card.querySelector('.cert-name').value,
        issuer: card.querySelector('.cert-issuer').value,
        date: card.querySelector('.cert-date').value
      })),
      languages: Array.from(languagesList.querySelectorAll('.language-card')).map(card => ({
        name: card.querySelector('.lang-name').value,
        level: card.querySelector('.lang-level').value
      }))
    };
  }

  // --- Populate Editor Inputs from Object ---
  function populateEditor(data) {
    // Profile
    document.getElementById('profile-name').value = data.profile?.name || '';
    document.getElementById('profile-title').value = data.profile?.title || '';
    document.getElementById('profile-email').value = data.profile?.email || '';
    document.getElementById('profile-phone').value = data.profile?.phone || '';
    document.getElementById('profile-location').value = data.profile?.location || '';
    document.getElementById('profile-website').value = data.profile?.website || '';
    document.getElementById('profile-linkedin').value = data.profile?.linkedin || '';
    document.getElementById('profile-github').value = data.profile?.github || '';
    document.getElementById('profile-summary').value = data.profile?.summary || '';

    // Clear repeating lists first
    experienceList.innerHTML = '';
    educationList.innerHTML = '';
    projectList.innerHTML = '';
    skillsList.innerHTML = '';
    certificationsList.innerHTML = '';
    languagesList.innerHTML = '';

    // Populate lists
    if (data.experience) data.experience.forEach(item => addExperienceCard(item));
    if (data.education) data.education.forEach(item => addEducationCard(item));
    if (data.projects) data.projects.forEach(item => addProjectCard(item));
    if (data.skills) data.skills.forEach(item => addSkillGroupCard(item));
    if (data.certifications) data.certifications.forEach(item => addCertificationCard(item));
    if (data.languages) data.languages.forEach(item => addLanguageCard(item));

    lucide.createIcons();
    updateStateAndPreview();
  }

  // --- Update State, Save to Cache, Render Preview ---
  function updateStateAndPreview() {
    const data = harvestData();

    // Save CV data to cache
    localStorage.setItem('resumeFlow_cvData', JSON.stringify(data));

    renderPreview(data);
  }

  // --- Render Preview DOM ---
  function renderPreview(data) {
    // 1. Profile Section
    pvName.innerText = data.profile.name || 'Your Full Name';
    pvTitle.innerText = data.profile.title || 'Professional Title';

    // Build Contacts Grid dynamically (only rendering items containing data)
    pvContacts.innerHTML = '';
    let hasContacts = false;

    const contactConfigs = [
      { key: 'email', icon: 'mail', prefix: 'mailto:' },
      { key: 'phone', icon: 'phone', prefix: 'tel:' },
      { key: 'location', icon: 'map-pin', prefix: null },
      { key: 'website', icon: 'globe', prefix: 'https://' },
      { key: 'linkedin', icon: 'linkedin', prefix: 'https://' },
      { key: 'github', icon: 'github', prefix: 'https://' }
    ];

    contactConfigs.forEach(conf => {
      const val = data.profile[conf.key];
      if (val && val.trim() !== '') {
        hasContacts = true;
        const item = document.createElement('div');
        item.className = 'cv-contact-item';

        let displayVal = val;
        // Clean URL visual prefixes for elegance
        if (conf.key === 'website' || conf.key === 'linkedin' || conf.key === 'github') {
          displayVal = val.replace(/^(https?:\/\/)?(www\.)?/, '');
        }

        if (conf.prefix) {
          const cleanLink = val.startsWith('http') || conf.key === 'email' || conf.key === 'phone'
            ? val
            : conf.prefix + val;
          item.innerHTML = `<i data-lucide="${conf.icon}"></i><a href="${cleanLink}" target="_blank">${displayVal}</a>`;
        } else {
          item.innerHTML = `<i data-lucide="${conf.icon}"></i><span>${displayVal}</span>`;
        }
        pvContacts.appendChild(item);
      }
    });

    if (hasContacts) {
      pvContacts.classList.remove('hidden');
    } else {
      pvContacts.classList.add('hidden');
    }

    // 2. Summary
    if (data.profile.summary && data.profile.summary.trim() !== '') {
      pvSummaryContent.innerText = data.profile.summary;
      document.getElementById('pv-section-summary').classList.remove('hidden');
    } else {
      document.getElementById('pv-section-summary').classList.add('hidden');
    }

    // 3. Work Experience
    pvExperienceList.innerHTML = '';
    if (data.experience && data.experience.length > 0) {
      document.getElementById('pv-section-experience').classList.remove('hidden');

      data.experience.forEach(exp => {
        // Skip if everything is empty
        if (!exp.role && !exp.company && !exp.location && !exp.start && !exp.end && !exp.desc) return;

        const item = document.createElement('div');
        item.className = 'pv-item';

        // Format description points
        let descHTML = '';
        if (exp.desc) {
          const lines = exp.desc.split('\n');
          const bulletPoints = [];
          let plainText = '';

          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
              bulletPoints.push(trimmed.substring(1).trim());
            } else if (trimmed !== '') {
              if (bulletPoints.length > 0) {
                // Renders previous bullets if there are non-bullet texts later
                descHTML += '<ul>' + bulletPoints.map(pt => `<li>${pt}</li>`).join('') + '</ul>';
                bulletPoints.length = 0;
              }
              plainText += `<p>${trimmed}</p>`;
            }
          });

          if (bulletPoints.length > 0) {
            descHTML += '<ul>' + bulletPoints.map(pt => `<li>${pt}</li>`).join('') + '</ul>';
          } else if (plainText !== '') {
            descHTML += plainText;
          }
        }

        item.innerHTML = `
          <div class="pv-item-header">
            <div class="pv-item-title-row">
              <span class="pv-item-title">${exp.role || 'Job Role'}</span>
              <span class="pv-item-subtitle">${exp.company || 'Company'}</span>
            </div>
            <div class="pv-item-meta">
              <span class="pv-item-date">${exp.start || ''} ${exp.start && exp.end ? '–' : ''} ${exp.end || ''}</span>
              <span class="pv-item-location">${exp.location || ''}</span>
            </div>
          </div>
          ${descHTML ? `<div class="pv-item-desc">${descHTML}</div>` : ''}
        `;
        pvExperienceList.appendChild(item);
      });
    } else {
      document.getElementById('pv-section-experience').classList.add('hidden');
    }

    // 4. Education
    pvEducationList.innerHTML = '';
    if (data.education && data.education.length > 0) {
      document.getElementById('pv-section-education').classList.remove('hidden');

      data.education.forEach(edu => {
        if (!edu.degree && !edu.school && !edu.location && !edu.end && !edu.desc) return;

        const item = document.createElement('div');
        item.className = 'pv-item';
        item.innerHTML = `
          <div class="pv-item-header">
            <div class="pv-item-title-row">
              <span class="pv-item-title">${edu.degree || 'Degree'}</span>
              <span class="pv-item-subtitle">${edu.school || 'School'}</span>
            </div>
            <div class="pv-item-meta">
              <span class="pv-item-date">${edu.end || ''}</span>
              <span class="pv-item-location">${edu.location || ''}</span>
            </div>
          </div>
          ${edu.desc ? `<div class="pv-item-desc">${edu.desc}</div>` : ''}
        `;
        pvEducationList.appendChild(item);
      });
    } else {
      document.getElementById('pv-section-education').classList.add('hidden');
    }

    // 5. Projects
    pvProjectList.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
      document.getElementById('pv-section-projects').classList.remove('hidden');

      data.projects.forEach(proj => {
        if (!proj.name && !proj.link && !proj.desc) return;

        const item = document.createElement('div');
        item.className = 'pv-item';
        item.innerHTML = `
          <div class="pv-item-header">
            <div class="pv-item-title-row">
              <span class="pv-item-title">${proj.name || 'Project Name'}</span>
              ${proj.link ? `<span class="pv-item-subtitle" style="font-size: 8.5pt;"><a href="${proj.link.startsWith('http') ? proj.link : 'https://' + proj.link}" target="_blank">${proj.link}</a></span>` : ''}
            </div>
          </div>
          ${proj.desc ? `<div class="pv-item-desc">${proj.desc}</div>` : ''}
        `;
        pvProjectList.appendChild(item);
      });
    } else {
      document.getElementById('pv-section-projects').classList.add('hidden');
    }

    // 6. Skills
    pvSkillsList.innerHTML = '';
    let hasSkills = false;
    if (data.skills && data.skills.length > 0) {
      data.skills.forEach(group => {
        if (!group.groupName && !group.tags) return;
        hasSkills = true;

        const item = document.createElement('div');
        item.className = 'pv-skill-group';

        const tagsHTML = group.tags
          ? group.tags.split(',')
            .map(t => t.trim())
            .filter(t => t !== '')
            .map(t => `<span class="pv-skill-badge">${t}</span>`)
            .join('')
          : '';

        item.innerHTML = `
          <div class="pv-skill-group-title">${group.groupName || 'Skill Area'}</div>
          <div class="pv-skills-tags">${tagsHTML}</div>
        `;
        pvSkillsList.appendChild(item);
      });
    }

    if (hasSkills) {
      document.getElementById('pv-section-skills').classList.remove('hidden');
    } else {
      document.getElementById('pv-section-skills').classList.add('hidden');
    }

    // 7. Certifications
    pvCertificationsList.innerHTML = '';
    if (data.certifications && data.certifications.length > 0) {
      document.getElementById('pv-section-certifications').classList.remove('hidden');

      data.certifications.forEach(cert => {
        if (!cert.name && !cert.issuer && !cert.date) return;

        const item = document.createElement('div');
        item.className = 'pv-item';
        item.innerHTML = `
          <div class="pv-item-header" style="margin-bottom: 0;">
            <div class="pv-item-title-row">
              <span class="pv-item-title" style="font-size: 9.5pt;">${cert.name || 'Certification'}</span>
              <span class="pv-item-subtitle" style="font-size: 8.5pt;">${cert.issuer || ''}</span>
            </div>
            <div class="pv-item-meta" style="font-size: 8.5pt;">
              <span class="pv-item-date">${cert.date || ''}</span>
            </div>
          </div>
        `;
        pvCertificationsList.appendChild(item);
      });
    } else {
      document.getElementById('pv-section-certifications').classList.add('hidden');
    }

    // 8. Languages
    pvLanguagesList.innerHTML = '';
    if (data.languages && data.languages.length > 0) {
      document.getElementById('pv-section-languages').classList.remove('hidden');

      data.languages.forEach(lang => {
        if (!lang.name && !lang.level) return;

        const item = document.createElement('div');
        item.className = 'pv-language-item';
        item.innerHTML = `
          <span class="pv-lang-name">${lang.name}</span>
          <span class="pv-lang-level">${lang.level || ''}</span>
        `;
        pvLanguagesList.appendChild(item);
      });
    } else {
      document.getElementById('pv-section-languages').classList.add('hidden');
    }

    // Dynamic grid adjustments based on template
    // In Modern and Creative templates, we hide empty panels or handle sidebars
    adjustBodyLayoutColumns(data);

    // Call Lucide to render icons added dynamically to preview contacts list
    lucide.createIcons({
      attrs: {
        class: 'lucide'
      },
      nameAttr: 'data-lucide',
      node: pvContacts
    });
  }

  // Fix grids when sidebar content is completely empty
  function adjustBodyLayoutColumns(data) {
    const hasRightCol =
      (data.education && data.education.length > 0) ||
      (data.skills && data.skills.length > 0) ||
      (data.certifications && data.certifications.length > 0) ||
      (data.languages && data.languages.length > 0);

    const bodyGrid = cvPreview.querySelector('.cv-body-grid');
    if (bodyGrid) {
      if (!hasRightCol && (appState.template === 'template-modern' || appState.template === 'template-creative')) {
        bodyGrid.style.gridTemplateColumns = '1fr';
      } else {
        // Reset to default grid layouts in CSS
        bodyGrid.style.gridTemplateColumns = '';
      }
    }
  }

  // --- Preload / Reset Helpers ---
  function loadSampleData() {
    populateEditor(SAMPLE_DATA);
  }

  function clearAllData() {
    const emptyData = {
      profile: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: []
    };
    populateEditor(emptyData);
  }
});
