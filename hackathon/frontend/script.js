// ========== NUTRIGUARD + GLOBAL FOOD SECURITY HEATMAP (100% INTEGRATED) ==========
// 👇 YOUR ORIGINAL LOGIC (UNCHANGED - 100% SAFE)
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

let mapInstance = null; // Global map reference

function computeDemo() {
    const prod = clamp(parseFloat(document.getElementById('prod').value || "0"), 0, 200);
    const storage = clamp(parseFloat(document.getElementById('storage').value || "0"), 0, 24);
    const reliab = clamp(parseFloat(document.getElementById('reliab').value || "0"), 0, 100);
    const access = clamp(parseFloat(document.getElementById('access').value || "0"), 0, 100);

    const prodScore = prod >= 100 ? 1 : prod / 100;
    const storeScore = Math.min(storage / 6, 1);
    const reliabScore = reliab / 100;
    const accessStress = access / 100;
    const accessScore = 1 - accessStress;

    const fsi = (0.30 * prodScore + 0.20 * storeScore + 0.25 * reliabScore + 0.25 * accessScore) * 100;

    let risk = "Stable", color = "#32e685", advice = "Country shows relatively stable food security. Maintain diversified trade links and continuous monitoring.";

    if (fsi < 40) {
        risk = "Critical"; color = "#ff4b6e";
        advice = "High crisis risk: increase strategic reserves, expand social protection, and coordinate urgent international aid.";
    } else if (fsi < 60) {
        risk = "Fragile"; color = "#ffb347";
        advice = "Significant vulnerability: diversify import sources, scale safety nets, and improve storage capacity.";
    } else if (fsi < 75) {
        risk = "Moderate"; color = "#ffd86b";
        advice = "Moderate risk: strengthen early‑warning systems and invest in climate‑resilient production.";
    }

    // 🔥 YOUR UPDATES (UNCHANGED)
    document.getElementById('demoFSI').textContent = fsi.toFixed(1);
    const riskEl = document.getElementById('demoRisk');
    riskEl.textContent = risk; riskEl.style.color = color;
    document.getElementById('demoAdvice').textContent = advice;

    const heroFSI = document.getElementById('heroFSI');
    if (heroFSI) heroFSI.textContent = fsi.toFixed(1);

    // 🌾 ALL YOUR EXISTING FEATURES (UNCHANGED)
    updateSupplyChain(prod, storage, reliab);
    updateWasteTracker(fsi);
    updatePolicyRecommendations(fsi, risk);
    updateRiskIndicator(risk, color, fsi);

    // 🔥 UPDATE MAP WITH CURRENT FSI (NEW INTEGRATION)
    updateMapWithFSI(fsi, risk, color);

    // 🔥 NEW NUTRITION FEATURES
    updateNutrition(fsi, prod, access);
}

// 🔥 🌍 GLOBAL FOOD SECURITY HEATMAP INTEGRATION
function initGlobalHeatmap() {
    // Create map container if not exists
    if (!document.getElementById('globalHeatmap')) {
        const mapDiv = document.createElement('div');
        mapDiv.id = 'globalHeatmap';
        mapDiv.style.cssText = 'height: 500px; width: 100%; margin: 20px 0; border-radius: 12px; border: 2px solid #e5e7eb;';
        document.getElementById('demo')?.parentNode?.insertBefore(mapDiv, document.getElementById('demo'));
    }

    // Load Leaflet CDN dynamically
    if (typeof L === 'undefined') {
        loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', initMap);
        loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    } else {
        initMap();
    }
}

function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

function initMap() {
    const mapDiv = document.getElementById('globalHeatmap');
    if (!mapDiv || mapInstance) return;

    // Initialize Leaflet map
    mapInstance = L.map('globalHeatmap').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap | NutriGuard FSI'
    }).addTo(mapInstance);

    // Global FSI data (Critical <50, Warning 50-70, Stable >70)
    const globalFSIData = {
        "India": { fsi: 68.5, status: "Warning", vuln: "High edible oil imports" },
        "Nigeria": { fsi: 42.1, status: "Critical", vuln: "Conflict zones" },
        "Ethiopia": { fsi: 35.8, status: "Critical", vuln: "Drought affected" },
        "Yemen": { fsi: 28.4, status: "Critical", vuln: "Import blockades" },
        "Brazil": { fsi: 78.2, status: "Stable", vuln: "Food exporter" },
        "USA": { fsi: 92.1, status: "Stable", vuln: "Self-sufficient" },
        "Pakistan": { fsi: 55.2, status: "Warning", vuln: "Flood risks" }
    };

    // Load world map data
    loadScript('https://d3js.org/d3.v7.min.js', () => {
        loadScript('https://unpkg.com/topojson@3', () => {
            d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(world => {
                const countries = topojson.feature(world, world.objects.countries);
                
                L.geoJSON(countries, {
                    style: feature => {
                        const name = feature.properties.name;
                        const data = globalFSIData[name] || { fsi: 85, status: "Stable", vuln: "Low risk" };
                        const color = data.fsi < 50 ? '#ff4b6e' : data.fsi < 70 ? '#ffb347' : '#32e685';
                        
                        return {
                            fillColor: color,
                            weight: 1,
                            opacity: 1,
                            color: 'white',
                            fillOpacity: 0.8
                        };
                    },
                    onEachFeature: (feature, layer) => {
                        const name = feature.properties.name;
                        const data = globalFSIData[name] || { fsi: 85, status: "Stable", vuln: "Low risk" };
                        
                        layer.bindPopup(`
                            <b>${name}</b><br>
                            FSI: ${data.fsi.toFixed(1)}<br>
                            Status: ${data.status}<br>
                            Risk: ${data.vuln}<br>
                            <em>Click for NutriGuard analysis</em>
                        `);
                        
                        layer.on('click', () => {
                            loadCountryData(name.toLowerCase().replace(' ', '-'));
                            showNotification(`🌍 Loaded ${name} FSI data into NutriGuard`);
                        });
                    }
                }).addTo(mapInstance);

                addMapLegend();
            });
        });
    });
}

function updateMapWithFSI(fsi, risk, color) {
    if (!mapInstance) return;
    
    // Highlight current country (India default)
    const highlightLayer = {
        fillColor: color,
        weight: 3,
        color: '#fff',
        fillOpacity: 0.9
    };
    
    // Add pulsing effect for current FSI
    const pulseLayer = L.circle([20.5937, 78.9629], { // India center
        radius: 800000 * (100 - fsi) / 100,
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 2,
        opacity: 0.8
    }).addTo(mapInstance);
    
    setTimeout(() => mapInstance.removeLayer(pulseLayer), 3000);
}

function addMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <div><i style="background:#32e685"></i> Stable (>70)</div>
            <div><i style="background:#ffb347"></i> Warning (50-70)</div>
            <div><i style="background:#ff4b6e"></i> Critical (<50)</div>
        `;
        div.style.cssText = 'background:white;padding:10px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.2);font:14px Arial;';
        return div;
    };
    legend.addTo(mapInstance);
}

// 🔥 ALL YOUR ORIGINAL NUTRITION FUNCTIONS (UNCHANGED)
function updateNutrition(fsi, prod, access) {
    const calories = Math.round(1800 + (fsi * 25));
    const protein = Math.round(35 + (fsi * 0.4));
    const iron = Math.round(8 + (fsi * 0.15));
    const vitamins = Math.round(40 + (fsi * 0.8));

    document.getElementById('caloriesCurrent') && (document.getElementById('caloriesCurrent').textContent = calories);
    document.getElementById('proteinCurrent') && (document.getElementById('proteinCurrent').textContent = protein);
    document.getElementById('ironCurrent') && (document.getElementById('ironCurrent').textContent = iron);
    document.getElementById('vitaminCurrent') && (document.getElementById('vitaminCurrent').textContent = vitamins);

    updateNutrient('calories', calories, 2400, 2100);
    updateNutrient('protein', protein, 60, 50);
    updateNutrient('iron', iron, 18, 14);
    updateNutrient('vitamin', vitamins, 100, 80);
}

function updateNutrient(type, current, target, goodThreshold) {
    const percent = Math.min(100, (current / target) * 100);
    const bar = document.getElementById(`${type}Bar`);
    const score = document.getElementById(`${type}Score`);
    
    if (bar) {
        bar.style.width = percent + '%';
        if (percent >= goodThreshold) {
            bar.className = 'nutri-fill nutri-good';
            score && (score.textContent = 'Good') && (score.style.color = '#10b981');
        } else if (percent >= 70) {
            bar.className = 'nutri-fill nutri-warning';
            score && (score.textContent = 'Warning') && (score.style.color = '#f59e0b');
        } else {
            bar.className = 'nutri-fill nutri-danger';
            score && (score.textContent = 'Critical') && (score.style.color = '#ef4444');
        }
    }
}

// 👇 ALL YOUR EXISTING FUNCTIONS (UNCHANGED - COMPLETE)
function updateSupplyChain(prod, storage, reliab) {
    const chainNodes = document.querySelectorAll('.chain-node');
    if (chainNodes.length >= 3) {
        chainNodes[0].querySelector('.metric-value')?.textContent = (prod/2).toFixed(0) + '%';
        chainNodes[1].querySelector('.metric-value')?.textContent = storage + 'mo';
        chainNodes[2].querySelector('.metric-value')?.textContent = (100-reliab).toFixed(0) + '%';
    }
}

function updateWasteTracker(fsi) {
    const wastePercent = Math.max(0, Math.round(100 - fsi));
    const wasteFill = document.querySelector('.waste-fill');
    if (wasteFill) {
        wasteFill.style.width = wastePercent + '%';
        wasteFill.setAttribute('data-percent', wastePercent);
    }
}

function updatePolicyRecommendations(fsi, risk) {
    const policies = {
        critical: [
            { text: "Emergency grain imports", impact: "+25 FSI", type: "positive" },
            { text: "Social protection expansion", impact: "+18 FSI", type: "positive" },
            { text: "Reduce food exports", impact: "-10% exports", type: "negative" }
        ],
        fragile: [
            { text: "Climate-resilient seeds", impact: "+15 FSI", type: "positive" },
            { text: "Storage infrastructure", impact: "+12 FSI", type: "positive" },
            { text: "Trade diversification", impact: "+20 reliab", type: "positive" }
        ],
        moderate: [
            { text: "Early warning systems", impact: "+8 FSI", type: "positive" },
            { text: "Crop insurance", impact: "+10 access", type: "positive" }
        ]
    };

    const policyList = document.querySelector('.policy-list') || createPolicyList();
    policyList.innerHTML = policies[risk.toLowerCase()]?.map(p => 
        `<div class="policy-impact"><span class="${p.type}">${p.impact}</span> ${p.text}</div>`
    ).join('') || '';
}

function createPolicyList() {
    const div = document.createElement('div');
    div.className = 'policy-list';
    document.querySelector('.hero-panel-inner')?.appendChild(div);
    return div;
}

function updateRiskIndicator(risk, color, fsi) {
    const indicator = document.querySelector('.risk-indicator') || createRiskIndicator();
    indicator.className = `risk-indicator risk-${risk.toLowerCase()}`;
    indicator.style.borderColor = color;
    indicator.querySelector('.risk-score')?.textContent = fsi.toFixed(1);
}

function createRiskIndicator() {
    const div = document.createElement('div');
    div.className = 'risk-indicator';
    div.innerHTML = `
        <div class="risk-icon">⚠️</div>
        <div>
            <div class="risk-title">Current Risk Level</div>
            <div class="risk-score"></div>
        </div>
    `;
    document.querySelector('.hero-title')?.parentNode?.insertBefore(div, document.querySelector('.hero-title').nextSibling);
    return div;
}

// 👇 ALL YOUR UTILITY FUNCTIONS (UNCHANGED)
function scrollToDemo() { document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToProblem() { document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

function switchHeroTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('tab-visible'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('tab-active'));
    document.getElementById(id)?.classList.add('tab-visible');
    document.querySelector(`.tab-button[data-tab="${id}"]`)?.classList.add('tab-active');
}

function bindAutoUpdate() {
    ['prod', 'storage', 'reliab', 'access'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', computeDemo);
    });
}

function loadCountryData(country) {
    const data = {
        india: { prod: 95, storage: 4, reliab: 85, access: 35 },
        nigeria: { prod: 90, storage: 3, reliab: 70, access: 40 },
        yemen: { prod: 65, storage: 1, reliab: 45, access: 75 },
        bangladesh: { prod: 88, storage: 2, reliab: 60, access: 55 },
        ethiopia: { prod: 75, storage: 2, reliab: 55, access: 65 },
        pakistan: { prod: 82, storage: 3, reliab: 62, access: 48 }
    };
    const countryData = data[country] || data.india;
    Object.keys(countryData).forEach(key => {
        document.getElementById(key).value = countryData[key];
    });
    computeDemo();
}

function simulateGlobalCrisis(type) {
    const crises = {
        drought: { prod: -25, storage: -1, reliab: -20, access: +15 },
        war: { prod: -15, storage: 0, reliab: -40, access: +30 },
        pricesurge: { prod: 0, storage: 0, reliab: -10, access: +25 }
    };
    
    const crisis = crises[type];
    ['prod', 'storage', 'reliab', 'access'].forEach(id => {
        const el = document.getElementById(id);
        const current = parseFloat(el.value);
        el.value = clamp(current + (id === 'prod' ? crisis.prod : 
                      id === 'storage' ? crisis.storage : 
                      id === 'reliab' ? crisis.reliab : crisis.access), 0, 100);
    });
    computeDemo();
    showNotification(`🌍 Global ${type} crisis simulated!`);
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: linear-gradient(135deg, var(--accent), var(--grain-gold));
        color: white; padding: 12px 20px; border-radius: 25px;
        box-shadow: 0 8px 32px rgba(16,185,129,0.4);
        z-index: 1000; font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

function createDynamicElements() {
    const demoSection = document.getElementById('demo');
    if (demoSection && !document.querySelector('.supply-chain')) {
        const chain = document.createElement('div');
        chain.className = 'supply-chain';
        chain.innerHTML = `
            <div class="chain-node chain-farm">
                <div>Farms</div><div class="metric-value">95%</div>
            </div>
            <div class="chain-flow"></div>
            <div class="chain-node chain-storage">
                <div>Storage</div><div class="metric-value">4mo</div>
            </div>
            <div class="chain-flow"></div>
            <div class="chain-node chain-market">
                <div>Markets</div><div class="metric-value">35%</div>
            </div>
        `;
        demoSection.appendChild(chain);
    }

    // 🔥 NUTRITION PANEL (UNCHANGED)
    if (demoSection && !document.getElementById('nutritionPanel')) {
        const nutritionHTML = `
            <div class="nutrition-panel" id="nutritionPanel">
                <div class="nutri-grid">
                    <div class="nutri-item nutri-calories">
                        <div class="nutri-icon">🔥</div>
                        <div class="nutri-label">Calories</div>
                        <div class="nutri-current" id="caloriesCurrent">2100</div>
                        <div class="nutri-reqd">kcal/day (Target: 2400)</div>
                        <div class="nutri-bar"><div class="nutri-fill" id="caloriesBar"></div></div>
                        <div class="nutri-score" id="caloriesScore">Good</div>
                    </div>
                    <div class="nutri-item nutri-protein">
                        <div class="nutri-icon">🥩</div>
                        <div class="nutri-label">Protein</div>
                        <div class="nutri-current" id="proteinCurrent">45</div>
                        <div class="nutri-reqd">g/day (Target: 60)</div>
                        <div class="nutri-bar"><div class="nutri-fill" id="proteinBar"></div></div>
                        <div class="nutri-score" id="proteinScore">Warning</div>
                    </div>
                    <div class="nutri-item nutri-iron">
                        <div class="nutri-icon">🩸</div>
                        <div class="nutri-label">Iron</div>
                        <div class="nutri-current" id="ironCurrent">12</div>
                        <div class="nutri-reqd">mg/day (Target: 18)</div>
                        <div class="nutri-bar"><div class="nutri-fill" id="ironBar"></div></div>
                        <div class="nutri-score" id="ironScore">Warning</div>
                    </div>
                    <div class="nutri-item nutri-vitamin">
                        <div class="nutri-icon">💊</div>
                        <div class="nutri-label">Vitamins</div>
                        <div class="nutri-current" id="vitaminCurrent">65</div>
                        <div class="nutri-reqd">%</div>
                        <div class="nutri-bar"><div class="nutri-fill" id="vitaminBar"></div></div>
                        <div class="nutri-score" id="vitaminScore">Good</div>
                    </div>
                </div>
            </div>
        `;
        demoSection.insertAdjacentHTML('beforeend', nutritionHTML);
    }
}

function saveDemoState() {
    const state = {
        prod: document.getElementById('prod').value,
        storage: document.getElementById('storage').value,
        reliab: document.getElementById('reliab').value,
        access: document.getElementById('access').value
    };
    localStorage.setItem('nutriguard_state', JSON.stringify(state));
}

// 🎯 COMPLETE INITIALIZATION WITH MAP
window.addEventListener('DOMContentLoaded', () => {
    computeDemo();
    bindAutoUpdate();
    
    ['prod', 'storage', 'reliab', 'access'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', saveDemoState);
    });
    
    createDynamicElements();
    initGlobalHeatmap(); // 🔥 NEW: Initialize interactive world map
});

// 🔥 MAP BUTTONS (Add these to your HTML)
function addMapControls() {
    const controls = `
        <div style="margin: 10px 0; text-align: center;">
            <button onclick="loadCountryData('india')" style="margin: 2px; padding: 8px 16px; background: #32e685; color: white; border: none; border-radius: 6px; cursor: pointer;">🇮🇳 India</button>
            <button onclick="loadCountryData('nigeria')" style="margin: 2px; padding: 8px 16px; background: #ff4b6e; color: white; border: none; border-radius: 6px; cursor: pointer;">🇳🇬 Nigeria</button>
            <button onclick="simulateGlobalCrisis('drought')" style="margin: 2px; padding: 8px 16px; background: #ffb347; color: white; border: none; border-radius: 6px; cursor: pointer;">🌾 Drought</button>
        </div>
    `;
    document.getElementById('globalHeatmap')?.insertAdjacentHTML('afterend', controls);
}
