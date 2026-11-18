// --- Events Array ---
const EVENTS = [
    { id: 1, name: "HackIEM 2026", date: "2026-09-26T09:00:00", venue: "AIML Lab, Gurukul Campus", category: "Technical", desc: "24-hour hackathon on applied machine learning. Teams of 2–4. Problem statements released at the opening ceremony; mentors available through the night." },
    { id: 2, name: "Hands-on Deep Learning with PyTorch", date: "2026-10-03T10:00:00", venue: "Lab 4, Ashram Building", category: "Workshop", desc: "Two-day workshop covering tensors, autograd, CNNs and a small speech-emotion classifier. Bring a laptop; no prior PyTorch experience needed." },
    { id: 3, name: "Guest lecture: Large language models for Indian languages", date: "2026-10-10T14:30:00", venue: "Seminar Hall, 2nd floor", category: "Lecture", desc: "An industry researcher discusses building and evaluating language models for low-resource Indic languages, followed by an open Q&A." },
    { id: 4, name: "Sharod Sandhya — cultural evening", date: "2026-10-16T17:00:00", venue: "Main Auditorium", category: "Cultural", desc: "Pre-Puja cultural evening with music, dance and drama performances by students of the department. Open to families." },
    { id: 5, name: "Line-follower robotics challenge", date: "2026-11-07T10:00:00", venue: "IoT Lab", category: "Technical", desc: "Build and race an autonomous line-following robot. Kits available on request; judging on speed, accuracy and build quality." },
    { id: 6, name: "Innovacion 2026 — annual tech fest", date: "2026-11-20T09:00:00", venue: "Gurukul Campus, all blocks", category: "Technical", desc: "Three days of coding contests, project exhibitions, paper presentations and gaming. The biggest event on the department calendar." }
];

// --- Render Dynamic Events & Registration Dropdown ---
function renderEvents(filter = "all") {
    const listEl = document.getElementById("eventList");
    const selectEl = document.getElementById("regEventSelect");

    listEl.innerHTML = "";
    selectEl.innerHTML = '<option value="">Select an event</option>';

    const filtered = filter === "all" ? EVENTS : EVENTS.filter(e => e.category === filter);

    filtered.forEach(ev => {
        const d = new Date(ev.date);
        const dayNum = d.getDate();
        const monthStr = d.toLocaleString('en', { month: 'short' });
        const yearNum = d.getFullYear();
        listEl.innerHTML += `
            <li class="event-card">
                <div class="event-date">
                    <span class="day">${dayNum}</span>
                    <span class="month">${monthStr} ${yearNum}</span>
                </div>
                <div class="event-info">
                    <span class="meta">${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${ev.venue}</span>
                    <h3>${ev.name}</h3>
                    <p>${ev.desc}</p>
                </div>
                <span class="event-badge">${ev.category}</span>
            </li>
        `;
    });

    // Fill registration form dropdown with all events
    EVENTS.forEach(ev => {
        selectEl.innerHTML += `<option value="${ev.name}">${ev.name}</option>`;
    });
}

// Filter button event listeners
document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        renderEvents(e.target.getAttribute("data-filter"));
    });
});

// --- Live Countdown & Clock ---
function getNextEvent() {
    const now = Date.now();
    return [...EVENTS]
        .filter(ev => new Date(ev.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || EVENTS[0];
}

function updateClockAndCountdown() {
    // Live Kolkata Clock
    const nowKolkata = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' });
    document.getElementById("liveClock").textContent = nowKolkata;

    // Countdown
    const next = getNextEvent();
    document.getElementById("nextEventName").textContent = next.name;

    let diff = new Date(next.date) - Date.now();
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById("cdDays").textContent = String(days).padStart(2, '0');
    document.getElementById("cdHours").textContent = String(hours).padStart(2, '0');
    document.getElementById("cdMins").textContent = String(mins).padStart(2, '0');
    document.getElementById("cdSecs").textContent = String(secs).padStart(2, '0');
}
setInterval(updateClockAndCountdown, 1000);

// --- Theme Toggle ---
const themeToggle = document.getElementById("themeToggle");
function applyTheme(mode) {
    const dark = mode === 'dark';
    document.body.classList.toggle('dark', dark);
    themeToggle.textContent = dark ? '☀' : '☾';
    localStorage.setItem('iem-theme', mode);
}

const savedTheme = localStorage.getItem('iem-theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
});

// --- Mobile Hamburger Menu ---
const hamburger = document.getElementById("hamburger");
const siteNav = document.getElementById("siteNav");
hamburger.addEventListener("click", () => {
    siteNav.classList.toggle("open");
});
siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => siteNav.classList.remove("open"));
});

// --- Form Validation Helper ---
function validateField(id, errId, condition, msg) {
    const val = document.getElementById(id).value.trim();
    const errEl = document.getElementById(errId);
    const inputEl = document.getElementById(id);

    let isValid = condition(val);
    if (!isValid) {
        inputEl.classList.add("is-invalid");
        errEl.textContent = msg;
    } else {
        inputEl.classList.remove("is-invalid");
        errEl.textContent = "";
    }
    return isValid;
}

// Registration Form Handler
document.getElementById("regForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const validName = validateField("regName", "errName", v => v.length >= 2, "Please enter your full name.");
    const validRoll = validateField("regRoll", "errRoll", v => /^\d{10}$/.test(v), "Roll number must be exactly 10 digits.");
    const validDept = validateField("regDept", "errDept", v => v !== "", "Select your department.");
    const validEmail = validateField("regEmail", "errEmail", v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v), "Enter a valid email address.");
    const validPhone = validateField("regPhone", "errPhone", v => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number.");

    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const errGender = document.getElementById("errGender");
    if (!genderChecked) { errGender.textContent = "Select an option."; } else { errGender.textContent = ""; }

    const validEvent = validateField("regEventSelect", "errEvent", v => v !== "", "Select an event to register.");

    if (validName && validRoll && validDept && validEmail && validPhone && genderChecked && validEvent) {
        document.getElementById("formSuccess").textContent = "Registration successful! Confirmation email sent.";
        this.reset();
    } else {
        document.getElementById("formSuccess").textContent = "";
    }
});

// Feedback Form Handler
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const validName = validateField("fbName", "errFbName", v => v.length >= 2, "Name is required.");
    const validEmail = validateField("fbEmail", "errFbEmail", v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v), "Valid email required.");
    const validMsg = validateField("fbMsg", "errFbMsg", v => v.length >= 15, "Message must be at least 15 characters.");

    if (validName && validEmail && validMsg) {
        alert("Thank you for your feedback!");
        this.reset();
    }
});

// Initialize on page load
renderEvents();
updateClockAndCountdown();
