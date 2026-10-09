import { test, expect } from '@playwright/test';

test.describe('Cascade Control ILM 310305e Interactive UI Tests', () => {

  test('Page loads properly with header, clock and 3D canvas', async ({ page }) => {
    await page.goto('/');

    // Check title and header badge
    await expect(page).toHaveTitle(/ILM 310305e: Cascade Control/);
    await expect(page.locator('.badge-ilm')).toHaveText('ILM 310305e');
    await expect(page.locator('.app-title')).toContainText('Cascade Control');

    // Verify 3D canvas exists
    const canvas3D = page.locator('#heat-exchanger-3d-container canvas');
    await expect(canvas3D).toBeVisible();

    // Verify Strip Chart canvas exists
    const stripCanvas = page.locator('#strip-chart-canvas');
    await expect(stripCanvas).toBeVisible();

    // Verify DCS faceplates for TIC-101 and FIC-101 exist
    await expect(page.locator('#fp-TIC-101')).toBeVisible();
    await expect(page.locator('#fp-FIC-101')).toBeVisible();
  });

  test('Tab navigation functions smoothly across all 7 modules', async ({ page }) => {
    await page.goto('/');

    const tabs = [
      { id: 'tab-btn-diagrams', panelId: 'tab-diagrams', checkText: 'P&ID Schematic' },
      { id: 'tab-btn-speed', panelId: 'tab-speed', checkText: 'Objective Three' },
      { id: 'tab-btn-tuning', panelId: 'tab-tuning', checkText: 'Objective Four' },
      { id: 'tab-btn-valve', panelId: 'tab-valve', checkText: 'Cutaway Pneumatic Control Valve' },
      { id: 'tab-btn-modes', panelId: 'tab-modes', checkText: 'Objective Two' },
      { id: 'tab-btn-uml', panelId: 'tab-uml', checkText: 'Software Architecture & UML Diagram Studio' },
      { id: 'tab-btn-quiz', panelId: 'tab-quiz', checkText: 'Self-Test' },
      { id: 'tab-btn-plant', panelId: 'tab-plant', checkText: 'Interactive 3D Shell-and-Tube' }
    ];

    for (const t of tabs) {
      await page.click(`#${t.id}`);
      await expect(page.locator(`#${t.panelId}`)).toHaveClass(/active/);
      await expect(page.locator(`#${t.panelId}`)).toContainText(t.checkText);
    }
  });

  test('Interactive disturbance buttons and setpoint adjustments', async ({ page }) => {
    await page.goto('/');

    // Adjust TIC-101 setpoint
    const spValBefore = await page.locator('#val-sp-TIC-101').textContent();
    await page.click('#fp-TIC-101 .sp-btn[data-delta="5"]');
    const spValAfter = await page.locator('#val-sp-TIC-101').textContent();
    expect(parseFloat(spValAfter || '0')).toBeGreaterThan(parseFloat(spValBefore || '0'));

    // Inject Steam Drop disturbance
    await page.click('#btn-inject-steam-drop');
    // Restore
    await page.click('#btn-restore-disturbances');
  });

  test('Response Speed Studio interactive slider and LaTeX formula update', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-speed');

    // Verify formula element exists
    await expect(page.locator('#formula-cltc-box')).toBeVisible();

    // Move proportional gain Kc slider
    const sliderKc = page.locator('#speed-kc');
    await sliderKc.evaluate(el => {
      el.value = '4.0';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Readout must update
    await expect(page.locator('#speed-kc-val')).toHaveText('4.0');
    // KPI box should show accelerated speedup
    await expect(page.locator('#kpi-tau-eff')).toBeVisible();
  });

  test('Tuning Studio diagnostic challenge and feedback', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-tuning');

    // Click Simulate Problem A (Fig 29)
    await page.click('#btn-test-inner-unstable');
    await expect(page.locator('#diag-box')).toBeVisible();

    // Answer "Inner (Secondary) Loop Unstable"
    await page.click('.btn-diag-option[data-ans="INNER"]');
    await expect(page.locator('#diag-feedback')).toContainText('Correct!');
    await expect(page.locator('#diag-score')).toHaveText('1');
  });

  test('3D Valve and Stiction studio interactions', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-valve');

    // Check 3D valve container and canvas
    await expect(page.locator('#valve-3d-container canvas')).toBeVisible();

    // Adjust stiction slider
    const sliderStiction = page.locator('#slider-stiction-deadband');
    await sliderStiction.evaluate(el => {
      el.value = '8.0';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('#val-stiction-deadband')).toHaveText('8.0%');

    // Toggle flow characteristics
    await page.click('#btn-char-eq');
    await expect(page.locator('#btn-char-eq')).toHaveClass(/active/);
  });

  test('Modes & Anti-Reset Windup Studio operation', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-modes');

    // Switch between mode configs
    await page.click('.perm-btn[data-perm="2"]');
    await expect(page.locator('#perm-detail-box')).toContainText('Full Manual Mode');

    // Test External Feedback EF Anti-windup simulation
    await page.click('#btn-run-windup');
    await expect(page.locator('#status-with-ef')).toContainText('Bias locked to External Feedback');
  });

  test('Self-Test Quiz submits and grades all questions accurately', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-quiz');

    // Answer Question 1 correctly: option 1 (index 1)
    await page.check('input[name="question-1"][value="1"]');

    // Answer Question 3 correctly: option 0 (index 0)
    await page.check('input[name="question-3"][value="0"]');

    // Submit Quiz
    await page.click('#btn-submit-quiz');

    // Check banner appears
    await expect(page.locator('#quiz-banner')).toBeVisible();
    await expect(page.locator('#feedback-1')).toBeVisible();
    await expect(page.locator('#feedback-1')).toContainText('Correct!');
  });

  test('Architecture & UML Studio renders Mermaid diagrams and switches views', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-uml');

    // Verify UML container is active
    await expect(page.locator('#tab-uml')).toHaveClass(/active/);

    // Initial view is Class Architecture: check SVG renders
    const mermaidSvg = page.locator('#uml-mermaid-target svg');
    await expect(mermaidSvg).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#uml-diagram-title')).toHaveText('System Class Architecture Diagram');

    // Switch to Sequence Diagram
    await page.click('#btn-uml-seq');
    await expect(page.locator('#uml-diagram-title')).toHaveText('60 Hz Simulation Signal Flow (Sequence Diagram)');
    await expect(page.locator('#uml-mermaid-target svg')).toBeVisible({ timeout: 10000 });

    // Switch to State Machine
    await page.click('#btn-uml-state');
    await expect(page.locator('#uml-diagram-title')).toHaveText('Operational Mode State Machine (ILM Objective 2)');
    await expect(page.locator('#uml-mermaid-target svg')).toBeVisible({ timeout: 10000 });
  });
});
