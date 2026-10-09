# Cascade Control Interactive Simulation Studio (ILM 310305e)

An industrial-grade, web-based interactive 3D process simulation and study guide built for **Alberta Apprenticeship and Industry Training (AIT) Instrument Technician Third Period - ILM 310305e: Cascade Control**.

Ready to host directly on **GitHub Pages**.

---

## 🌟 Key Features

### 1. Interactive 3D Process Simulations (WebGL / Three.js)
- **Shell-and-Tube Reboiler & Distillation Column (Figures 1, 3, 10, 22)**:
  - 3D cutaway heat exchanger shell with internal tube bundle.
  - Thermal gradient dynamic color-mapping: blue (cool liquid) $\to$ amber/red (hot reboiler bottoms).
  - Volumetric steam particle stream entering the shell, throttling in real time with steam flow $PV_2$.
  - Rotating pressure gauge needle reflecting steam supply header fluctuations.
  - Full mouse orbit controls: rotate, pan, and zoom.
- **Pneumatic Control Valve & Smart Positioner Cutaway (Figures 5, 11, 16)**:
  - Cutaway diaphragm dome, heavy actuator range spring, valve stem travel indicator scale ($0-100\%$).
  - Packing gland friction visualizer demonstrating **stick-slip stiction**.
  - Smart valve positioner (FY-101) with mechanical feedback arm tracking valve stem motion.
- **Catalyst Regeneration Furnace (Figures 8, 18, 20, 31)**:
  - Direct-fired combustion chamber with animated flame particle intensity scaling with fuel flow.
  - Regenerator vessel with thermocouple temperature indicators ($TT-101$ & $TT-201$).

### 2. Dual Real-Time Physics & PID Engines (60 Hz ODE Solvers)
- **Cascade Loop vs Conventional Single-Loop Side-by-Side Comparison**:
  - Live industrial multi-pen canvas strip chart comparing both loops simultaneously.
  - **Disturbance Injection**: Simulate a $-30\%$ steam supply pressure drop or cold feed surge. Watch the cascade inner flow loop ($FIC-101$) instantly open the valve to shield the column temperature, while the conventional loop allows the temperature to plummet by $45^\circ\text{C}$!
- **Authentic DCS Controller Faceplates (TIC-101 & FIC-101)**:
  - Real-time PV, SP, and CO bar meters.
  - Mode switches: `MAN`, `AUTO`, `CAS`.
  - Incremental bumpless bump buttons ($\pm 1^\circ\text{C}$, $\pm 5^\circ\text{C}$).
  - Remote Setpoint (RSP) link and External Feedback (EF) indicators.

### 3. LaTeX Mathematical Markup (KaTeX)
- **Effective Closed-Loop Time Constant ($\tau_{eff}$ / CLTC)**:
  $$\tau_{eff} = \frac{\tau_p}{1 + |K_c K_p|}$$
  Interactive calculator demonstrating how high inner loop gain $K_c$ reduces the furnace time constant from $8.8\text{ min}$ down to $2.0\text{ min}$, speeding up response time from $31\text{ min}$ to $19\text{ min}$.
- **Disturbance Attenuation Closed-Loop Transfer Function**:
  $$\frac{Y_1(s)}{D_2(s)} = \frac{G_{p1}(s) G_{p2}(s)}{1 + G_{c2}(s)G_{p2}(s) + G_{c1}(s)G_{c2}(s)G_{p2}(s)G_{p1}(s)}$$
- **Quarter Amplitude Decay (DR = 0.25)** and **IMC / Ziegler-Nichols tuning formulas**:
  $$K_c = \frac{0.6 \tau_p}{K_p \tau_d}, \quad T_i = \tau_p$$

### 4. Interactive Learning Modules
- **Objective 1 & 5**: Authentic ISA 5.1 P&ID schematic with interactive instrument bubbles ($TIC-101, FIC-101, TT-101, FT-101, FY-101$) and block diagrams.
- **Objective 2**: Controller Actions (Direct vs Reverse) for Air-to-Open (ATO) vs Air-to-Close (ATC) valves, the 4 cascade mode permutations, and External Feedback (EF) anti-reset windup protection.
- **Objective 3**: Response speed studio with live step response curves and speed ratio verification ($\tau_{outer} \ge 3 \times \tau_{inner}$).
- **Objective 4**: Inside-out tuning workflow, IMC calculator, and the **Industrial Instability Diagnostic Simulator** (differentiating inner loop valve chatter from outer loop rolling instability).
- **Comprehensive Self-Test**: Complete 19-question exam prep directly from ILM 310305e with instant grading and technical explanations.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open in browser at http://localhost:5173
```

---

## 🧪 Testing

The application includes unit tests (Vitest) and end-to-end browser tests (Playwright):

```bash
# Run unit & physics simulation tests
npm run test

# Run full end-to-end browser UI tests
npx playwright test
```

---

## 🌐 Deploying to GitHub Pages

1. **Automated Deployment (GitHub Actions)**:
   - A workflow is pre-configured in `.github/workflows/deploy.yml`.
   - In your GitHub repository settings, go to **Settings > Pages > Build and deployment > Source** and select **GitHub Actions**.
   - Push your code to `main` and GitHub will automatically build and host the app!

2. **Manual Static Build**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be in the `dist/` directory, ready to deploy to any static host.

*(Note: In compliance with project guidelines, the PDF file `310305e.pdf` is strictly excluded via `.gitignore` and is never committed or published).*
