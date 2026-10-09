/**
 * Interactive Self-Test Quiz & Exam Prep
 * Fully implements all 19 questions from Alberta Apprenticeship ILM 310305e (pages 55-61)
 * Includes immediate technical grading, answer key explanations, and score tracking.
 */

export class SelfTestQuiz {
  constructor(containerElement) {
    this.container = containerElement;
    this.userAnswers = {};
    this.submitted = false;

    this.questions = [
      {
        id: 1,
        title: "1. Definition of Cascade Control",
        prompt: "What is the technical definition of cascade control in process automation?",
        options: [
          "Any control scheme where two valves are operated in split-range sequence.",
          "Any control scheme in which the output of one controller is used as the setpoint input of another controller.",
          "A feedback control loop where feedforward disturbance rejection is added to the valve.",
          "A control strategy where two controllers simultaneously manipulate the same final control element."
        ],
        correct: 1,
        explanation: "ILM Definition (p. 2, 60): Cascade control is any control scheme in which the output of one controller is used as the setpoint of another controller."
      },
      {
        id: 2,
        title: "2. Advantages of Cascade Control",
        prompt: "Which of the following is NOT an advantage of a cascade control scheme over conventional single-loop control?",
        options: [
          "Minimizes or eliminates the effects of disturbances to the manipulated variable before they reach the primary variable.",
          "Improves the speed of response of the primary control loop.",
          "Eliminates the need for a secondary transmitter or secondary process penetration.",
          "Handles and isolates non-linearities (like valve stiction) in the slave loop so they do not upset the master loop."
        ],
        correct: 2,
        explanation: "ILM Answer (p. 9, 60): Cascade control requires at least two measurements, requiring an additional transmitter and process penetration (an added cost, not an elimination)."
      },
      {
        id: 3,
        title: "3. Loop Speed Requirements",
        prompt: "For two loops to be successfully coupled in cascade control, what loop speed requirement must be met?",
        options: [
          "The secondary loop must be at least 3 to 5 times faster than the primary loop.",
          "The primary loop must be at least 3 times faster than the secondary loop.",
          "Both loops must have identical natural frequencies of oscillation to prevent resonance.",
          "The speed of the loops does not matter as long as derivative action is enabled on both."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 9-10, 60): The secondary loop should be at least three times faster than the primary loop. This is determined by comparing their first order time constants or natural frequencies."
      },
      {
        id: 4,
        title: "4. Most Common Cascade Loop in Industry",
        prompt: "What is the single most common secondary loop found in industrial cascade control?",
        options: [
          "Orifice plate flow control loop (FIC)",
          "Thermocouple temperature loop (TIC)",
          "Smart valve positioner on a pneumatic control valve",
          "Level transmitter buoyancy displacer (LIC)"
        ],
        correct: 2,
        explanation: "ILM Answer (p. 10, 60): A valve positioner is the most common secondary loop. It acts as a high-gain, proportional-only controller positioning the valve stem."
      },
      {
        id: 5,
        title: "5. Valve Positioner & Stiction in Temperature Loops",
        prompt: "How does a valve positioner mitigate packing friction / stiction in a slow temperature process?",
        options: [
          "It completely lubricates the packing to physically eliminate static friction.",
          "It increases the frequency of stick-slip oscillations so the rapid cycles are filtered and damped out by the process.",
          "It shifts the valve failure mode from Air-to-Open to Air-to-Close.",
          "It adds large integral action to ramp actuator pressure slowly."
        ],
        correct: 1,
        explanation: "ILM Answer (p. 11, 60): A valve positioner does not stop stick-slip, but it shortens the period so that the faster oscillations are damped out by the process without affecting the primary variable."
      },
      {
        id: 6,
        title: "6. Valve Positioners on Fast Flow Loops",
        prompt: "Why is a valve positioner often NOT beneficial on a liquid flow control loop?",
        options: [
          "Flow valves cannot accept pneumatic positioners.",
          "The primary flow loop dynamics are in milliseconds (faster than the actuator's seconds), so positioners offer no speed advantage.",
          "Flow loops require Air-to-Close valves exclusively.",
          "Positioners cause flow cavitation."
        ],
        correct: 1,
        explanation: "ILM Answer (p. 11): In a flow loop, the speed of the primary flow measurement is milliseconds, whereas the actuator takes seconds. The primary loop is already faster than the secondary loop."
      },
      {
        id: 7,
        title: "7. Heat Exchanger Controller Actions (Fig 47)",
        prompt: "In a steam reboiler with an Air-to-Open (ATO, fail closed) steam valve heating product liquid, what actions are required for TIC-101 and FIC-101?",
        options: [
          "TIC-101: Direct Acting | FIC-101: Direct Acting",
          "TIC-101: Reverse Acting | FIC-101: Reverse Acting",
          "TIC-101: Reverse Acting | FIC-101: Direct Acting",
          "TIC-101: Direct Acting | FIC-101: Reverse Acting"
        ],
        correct: 1,
        explanation: "ILM Answer (p. 16, 56, 60): When temperature rises, heat must decrease (Reverse). For an ATO valve, when flow rises above SP, controller must decrease output to close valve (Reverse). Both are Reverse Acting."
      },
      {
        id: 8,
        title: "8. Bumpless Transfer in Full Manual (Fig 13)",
        prompt: "When both primary and secondary controllers are in MANUAL mode, which variables track each other to ensure bumpless transfer?",
        options: [
          "SP2 tracks PV2, SP1 tracks PV1, and CO1 tracks PV2",
          "SP1 tracks CO2, and PV1 tracks PV2",
          "CO1 tracks SP1, and CO2 tracks SP2",
          "No variables track each other in manual"
        ],
        correct: 0,
        explanation: "ILM Answer (p. 19, 56, 60): SP2 tracks PV2 (secondary bumpless transfer), SP1 tracks PV1, and Primary Output CO1 tracks Secondary PV (PV2)."
      },
      {
        id: 9,
        title: "9. Primary Initialized Manual Adjustments",
        prompt: "When the primary controller is in Initialized Manual mode (secondary in Auto), what can the operator adjust on the primary controller?",
        options: [
          "The operator cannot adjust Primary CO because it is tracking the secondary loop.",
          "The operator can adjust Primary CO directly to open the valve.",
          "The operator can adjust the tuning gain of the primary loop.",
          "The operator can override the secondary process variable."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 20, 57, 60): When in initialized manual mode, the primary controller's output tracks the secondary controller, so the operator cannot adjust its output."
      },
      {
        id: 10,
        title: "10. Reasons for Initialized Manual Mode",
        prompt: "List two primary reasons why a digital primary controller automatically enters Initialized Manual mode:",
        options: [
          "Secondary controller is placed in Manual OR Secondary controller is placed in local Automatic.",
          "Primary transmitter fails OR Steam header pressure rises.",
          "Valve stiction occurs OR Operator presses reset button.",
          "Process variable exceeds 100% OR Derivative time is set to zero."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 19-20, 57, 60): The primary controller enters initialized manual whenever the secondary controller is not in cascade mode (i.e. Secondary is in Manual or local Auto)."
      },
      {
        id: 11,
        title: "11. Prevention of Reset Windup via External Feedback",
        prompt: "How is integral reset windup prevented in the primary controller of a pneumatic or analog cascade scheme?",
        options: [
          "By venting the nozzle-flapper assembly to atmosphere.",
          "By connecting the primary controller's reset bellows to External Feedback (EF) from the secondary PV.",
          "By turning off integral action whenever error is positive.",
          "By using only derivative control in the primary loop."
        ],
        correct: 1,
        explanation: "ILM Answer (p. 25, 57, 60): Reset windup is prevented by connecting the primary controller's bias bellows to the secondary process variable (External Feedback EF)."
      },
      {
        id: 12,
        title: "12. Time Constant Reduction Formula",
        prompt: "What mathematical formula describes how the effective closed loop time constant (CLTC) of the inner loop is reduced?",
        options: [
          "CLTC = tau_p / (1 + |Kc * Kp|)",
          "CLTC = tau_p * (1 + |Kc * Kp|)",
          "CLTC = sqrt(tau_p * Kc)",
          "CLTC = tau_p - (Kc / Kp)"
        ],
        correct: 0,
        explanation: "ILM Answer (p. 24, 28): CLTC = tau_p / (1 + |Kc * Kp|). Increasing proportional gain Kc in the secondary controller shrinks the effective time constant."
      },
      {
        id: 13,
        title: "13. Sequence for Tuning Cascade Control Systems",
        prompt: "What is the proper industrial procedure for tuning a cascade control system?",
        options: [
          "Tune outer loop first in automatic, then engage inner loop in cascade.",
          "Tune from the inside out: Put outer loop in manual, tune inner loop first, put inner loop in cascade, then tune outer loop.",
          "Tune both controllers simultaneously using maximum proportional gain.",
          "Tune inner loop with outer loop set to high integral action."
        ],
        correct: 1,
        explanation: "ILM Answer (p. 31, 57, 61): A cascade control system is tuned from the inside out: outer loop in manual, tune inner loop for 1/4 decay, put inner loop in cascade, then tune outer loop."
      },
      {
        id: 14,
        title: "14. Secondary Controller Mode Selection",
        prompt: "Why is Proportional-only (P-only) control generally recommended for the secondary controller in cascade systems?",
        options: [
          "Because offset in the secondary variable does not affect the primary variable, and P-only is more stable with higher allowed gain.",
          "Because integral action cannot be programmed into digital slave controllers.",
          "Because P-only control prevents valve movement entirely.",
          "Because secondary transmitters cannot calculate error."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 30, 42): Proportional-only control is recommended because secondary offset is compensated by the primary master loop, and integral action decreases stability and limits usable gain."
      },
      {
        id: 15,
        title: "15. Diagnostic Scenario (Figure 29)",
        prompt: "An operator notices the steam control valve is rapidly oscillating in cascade mode, but the product temperature remains completely steady. What is the fault?",
        options: [
          "The primary temperature controller is unstable.",
          "The secondary flow controller is unstable and needs re-tuning (gain too high).",
          "The temperature transmitter has failed open.",
          "The steam valve is stuck shut."
        ],
        correct: 1,
        explanation: "ILM Answer (p. 38, 58, 61): The secondary loop is unstable. Because the secondary loop is fast, it cycles without affecting the primary variable, causing unnecessary valve wear."
      },
      {
        id: 16,
        title: "16. Diagnostic Scenario (Figure 30)",
        prompt: "A load disturbance causes growing, rolling oscillations in the primary temperature that are amplified by the secondary flow controller. What is the fault?",
        options: [
          "The primary controller is improperly tuned and causing system instability.",
          "The secondary controller gain is too low.",
          "The control valve packing is slipping.",
          "The feed pump has tripped."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 39, 58, 61): The primary controller's tuning causes the instability of the primary controlled variable, which is amplified by the secondary loop."
      },
      {
        id: 17,
        title: "17. Non-Linearity in Control Valve Installed Characteristic",
        prompt: "If the installed characteristic of the control valve is non-linear, which loop must compensate for this?",
        options: [
          "The secondary (inner) control loop, via multipoint characterization f(x) or adaptive gain.",
          "The primary (outer) control loop only.",
          "Neither loop, because cascade control eliminates physical valve non-linearities automatically.",
          "The feed pump variable frequency drive."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 49, 58, 61): The inner loop contains the valve, so the inner loop must compensate via multipoint characterization f(x), adaptive control, or detuning."
      },
      {
        id: 18,
        title: "18. Non-Linearity in Primary Process",
        prompt: "If the process characteristic of the primary heat transfer process is non-linear, which loop must compensate?",
        options: [
          "The primary (outer) control loop, via multipoint characterization or adaptive control.",
          "The secondary flow control loop.",
          "The pneumatic valve positioner.",
          "The steam trap on the condensate line."
        ],
        correct: 0,
        explanation: "ILM Answer (p. 50-51, 58, 61): The primary process non-linearity is outside the inner loop; therefore, the primary loop must compensate via multipoint characterization f(x) or detuning."
      },
      {
        id: 19,
        title: "19. Multilevel Cascade Control",
        prompt: "In a 4-level industrial cascade scheme (ILM Figure 9), what is the correct hierarchy from inner-most to outer-most?",
        options: [
          "Level 1: Valve Positioner -> Level 2: Flow Controller -> Level 3: Secondary Temp -> Level 4: Primary Temp",
          "Level 1: Primary Temp -> Level 2: Secondary Temp -> Level 3: Flow Controller -> Level 4: Valve Positioner",
          "Level 1: Flow Controller -> Level 2: Primary Temp -> Level 3: Valve Positioner -> Level 4: Secondary Temp",
          "Level 1: Steam Header -> Level 2: Diaphragm -> Level 3: Flange -> Level 4: Reboiler"
        ],
        correct: 0,
        explanation: "ILM Answer (p. 14): Level 1 is the valve positioner, Level 2 is flow controller FIC-101, Level 3 is furnace temp TIC-201, and Level 4 is master regenerator temp TIC-101."
      }
    ];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <h3>ILM 310305e Comprehensive Self-Test & Exam Prep</h3>
          <p class="quiz-subtext">
            Test your knowledge across all 5 learning objectives using the official Alberta Apprenticeship curriculum questions. Submit for instant grading and technical explanations!
          </p>
          <div class="quiz-score-banner" id="quiz-banner" style="display: none;">
            <div class="banner-score">Your Score: <span id="quiz-final-score">0</span> / 19 (<span id="quiz-final-pct">0%</span>)</div>
            <div class="banner-status" id="quiz-banner-status">Pass / Fail</div>
          </div>
        </div>

        <div class="quiz-questions-list">
          ${this.questions.map((q, idx) => `
            <div class="quiz-q-card" id="q-card-${q.id}">
              <div class="q-title">${q.title}</div>
              <div class="q-prompt">${q.prompt}</div>
              <div class="q-options">
                ${q.options.map((opt, optIdx) => `
                  <label class="q-option-label" id="opt-label-${q.id}-${optIdx}">
                    <input type="radio" name="question-${q.id}" value="${optIdx}" class="q-radio" data-qid="${q.id}" data-oidx="${optIdx}">
                    <span class="q-opt-text">${opt}</span>
                  </label>
                `).join('')}
              </div>
              <div class="q-feedback" id="feedback-${q.id}" style="display: none;"></div>
            </div>
          `).join('')}
        </div>

        <div class="quiz-actions-bar">
          <button class="btn-action primary lg" id="btn-submit-quiz">Submit All Answers for Grading</button>
          <button class="btn-action" id="btn-reset-quiz">Reset Quiz</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const radios = this.container.querySelectorAll('.q-radio');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const qId = parseInt(e.target.dataset.qid, 10);
        const optIdx = parseInt(e.target.dataset.oidx, 10);
        this.userAnswers[qId] = optIdx;
      });
    });

    document.getElementById('btn-submit-quiz')?.addEventListener('click', () => {
      this.gradeQuiz();
    });

    document.getElementById('btn-reset-quiz')?.addEventListener('click', () => {
      this.userAnswers = {};
      this.submitted = false;
      this.render();
    });
  }

  gradeQuiz() {
    let score = 0;
    this.submitted = true;

    this.questions.forEach(q => {
      const card = document.getElementById(`q-card-${q.id}`);
      const feedback = document.getElementById(`feedback-${q.id}`);
      const userAns = this.userAnswers[q.id];

      // Reset options styles
      for (let i = 0; i < q.options.length; i++) {
        const lbl = document.getElementById(`opt-label-${q.id}-${i}`);
        if (lbl) lbl.className = 'q-option-label';
      }

      if (userAns !== undefined) {
        if (userAns === q.correct) {
          score++;
          card.classList.add('correct');
          card.classList.remove('incorrect');
          const correctLbl = document.getElementById(`opt-label-${q.id}-${q.correct}`);
          if (correctLbl) correctLbl.classList.add('chosen-correct');
          if (feedback) {
            feedback.style.display = 'block';
            feedback.className = 'q-feedback correct';
            feedback.innerHTML = `✓ <strong>Correct!</strong> ${q.explanation}`;
          }
        } else {
          card.classList.add('incorrect');
          card.classList.remove('correct');
          const chosenLbl = document.getElementById(`opt-label-${q.id}-${userAns}`);
          if (chosenLbl) chosenLbl.classList.add('chosen-wrong');
          const correctLbl = document.getElementById(`opt-label-${q.id}-${q.correct}`);
          if (correctLbl) correctLbl.classList.add('correct-answer');
          if (feedback) {
            feedback.style.display = 'block';
            feedback.className = 'q-feedback incorrect';
            feedback.innerHTML = `✗ <strong>Incorrect.</strong> ${q.explanation}`;
          }
        }
      } else {
        card.classList.add('incorrect');
        if (feedback) {
          feedback.style.display = 'block';
          feedback.className = 'q-feedback incorrect';
          feedback.innerHTML = `⚠️ <strong>Unanswered.</strong> Correct answer is: "${q.options[q.correct]}".<br>${q.explanation}`;
        }
      }
    });

    const pct = Math.round((score / this.questions.length) * 100);
    const banner = document.getElementById('quiz-banner');
    const finalScore = document.getElementById('quiz-final-score');
    const finalPct = document.getElementById('quiz-final-pct');
    const bannerStatus = document.getElementById('quiz-banner-status');

    if (banner) banner.style.display = 'flex';
    if (finalScore) finalScore.textContent = score;
    if (finalPct) finalPct.textContent = `${pct}%`;
    if (bannerStatus) {
      if (pct >= 80) {
        bannerStatus.textContent = '🎉 Mastery Achieved! Excellent understanding of Cascade Control.';
        bannerStatus.className = 'banner-status pass';
      } else if (pct >= 65) {
        bannerStatus.textContent = '👍 Pass (Review sections on loop speed and tuning diagnostics).';
        bannerStatus.className = 'banner-status pass';
      } else {
        bannerStatus.textContent = '📚 Review Recommended (Re-visit Objectives 2, 3, and 4).';
        bannerStatus.className = 'banner-status fail';
      }
    }

    // Scroll to top banner
    banner?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
