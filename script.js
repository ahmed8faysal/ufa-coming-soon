// --- INTERACTIVE PARTICLE BACKGROUND SCRIPT ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let mouse = { x: null, y: null, radius: (canvas.height/110) * (canvas.width/110) };

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height/110) * (canvas.width/110);
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
        if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10) { this.x += 5; }
            if(mouse.x > this.x && this.x > this.size * 10) { this.x -= 5; }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10) { this.y += 5; }
            if(mouse.y > this.y && this.y > this.size * 10) { this.y -= 5; }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * .4) - .2;
        let directionY = (Math.random() * .4) - .2;
        let color = 'rgba(249, 115, 22, 0.8)'; // Orange
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = `rgba(251, 191, 36, ${opacityValue})`; // Amber
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();


// --- COUNTDOWN TIMER SCRIPT ---
const countDownDate = new Date();
countDownDate.setDate(countDownDate.getDate() + 90);
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = '<div class="text-2xl font-bold">We are live!</div>';
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    daysEl.innerHTML = String(days).padStart(2, '0');
    hoursEl.innerHTML = String(hours).padStart(2, '0');
    minutesEl.innerHTML = String(minutes).padStart(2, '0');
    secondsEl.innerHTML = String(seconds).padStart(2, '0');
}, 1000);

// --- FORM SUBMISSION SCRIPT ---
const subscribeForm = document.getElementById('subscribeForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = emailInput.value;
    if (email && validateEmail(email)) {
        formMessage.textContent = 'Thank you! We will notify you at launch.';
        emailInput.value = '';
        setTimeout(() => { formMessage.textContent = ''; }, 5000);
    } else {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.classList.add('text-red-400');
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.classList.remove('text-red-400');
        }, 3000);
    }
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// --- GEMINI API FEATURE SCRIPT ---
const suggestBtn = document.getElementById('suggestBtn');
const interestInput = document.getElementById('interestInput');
const suggestionsContainer = document.getElementById('suggestions');
const skillDetailsContainer = document.getElementById('skill-details');
const apiKey = ""; // This will be handled by the environment

const showLoading = (element, text = '') => {
    element.innerHTML = `<div class="flex flex-col items-center justify-center gap-2"><div class="loader"></div><p class="text-sm text-gray-400">${text}</p></div>`;
};

const fetchWithBackoff = async (apiUrl, payload, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) return response.json();
            if (response.status >= 400 && response.status < 500) break;
        } catch (error) {}
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
    return null;
};

suggestBtn.addEventListener('click', async () => {
    const interest = interestInput.value.trim();
    if (!interest) {
        suggestionsContainer.innerHTML = `<p class="text-red-400">Please enter an interest.</p>`;
        return;
    }

    showLoading(suggestionsContainer, 'Thinking...');
    skillDetailsContainer.style.opacity = '0';
    
    const prompt = `Based on the interest "${interest}", suggest three specific, modern skills a teenager in Bangladesh could learn for a successful career. Return ONLY a valid JSON array of strings. Example: ["Web Development", "Digital Marketing", "Graphic Design"]`;
    
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: { type: "ARRAY", items: { type: "STRING" } }
        }
    };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const result = await fetchWithBackoff(apiUrl, payload);

    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        try {
            const skills = JSON.parse(result.candidates[0].content.parts[0].text);
            displaySkills(skills);
        } catch (e) {
            suggestionsContainer.innerHTML = `<p class="text-red-400">Sorry, couldn't generate suggestions. Try another interest.</p>`;
        }
    } else {
        suggestionsContainer.innerHTML = `<p class="text-red-400">Sorry, something went wrong. Please try again later.</p>`;
    }
});

const displaySkills = (skills) => {
    suggestionsContainer.innerHTML = '';
    skills.forEach(skill => {
        const button = document.createElement('button');
        button.textContent = skill;
        button.className = 'bg-gray-700 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors';
        button.onclick = () => getSkillDetails(skill);
        suggestionsContainer.appendChild(button);
    });
};

const getSkillDetails = async (skill) => {
    skillDetailsContainer.style.opacity = '1';
    showLoading(skillDetailsContainer, `Explaining "${skill}"...`);

    const prompt = `In 2-3 engaging sentences, explain why a teenager in Bangladesh should learn "${skill}". Focus on career opportunities and future growth within the country's tech and business landscape.`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const result = await fetchWithBackoff(apiUrl, payload);

    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        skillDetailsContainer.innerHTML = `<p class="text-lg text-amber-300">${result.candidates[0].content.parts[0].text}</p>`;
    } else {
        skillDetailsContainer.innerHTML = `<p class="text-red-400">Could not fetch details for this skill.</p>`;
    }
};
