import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * LaTeX Formula Rendering and Interactive Equations Helper
 * Renders mathematical expressions using KaTeX with parameter highlighting
 */

export function renderFormula(elementOrId, latexString, displayMode = true) {
  const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!el) return;
  try {
    katex.render(latexString, el, {
      displayMode,
      throwOnError: false
    });
  } catch (err) {
    el.textContent = latexString;
    console.error('KaTeX render error:', err);
  }
}

export function createFormulaCard({ title, formulaLatex, explanation, variables = [] }) {
  const card = document.createElement('div');
  card.className = 'formula-card';

  const heading = document.createElement('h4');
  heading.textContent = title;
  card.appendChild(heading);

  const formulaContainer = document.createElement('div');
  formulaContainer.className = 'formula-display';
  katex.render(formulaLatex, formulaContainer, { displayMode: true, throwOnError: false });
  card.appendChild(formulaContainer);

  const desc = document.createElement('p');
  desc.className = 'formula-description';
  desc.innerHTML = explanation;
  card.appendChild(desc);

  if (variables.length > 0) {
    const list = document.createElement('ul');
    list.className = 'formula-vars';
    variables.forEach(v => {
      const item = document.createElement('li');
      const symbolSpan = document.createElement('span');
      symbolSpan.className = 'var-symbol';
      katex.render(v.symbol, symbolSpan, { displayMode: false, throwOnError: false });
      item.appendChild(symbolSpan);
      const textSpan = document.createElement('span');
      textSpan.className = 'var-desc';
      textSpan.innerHTML = `: ${v.desc}`;
      item.appendChild(textSpan);
      list.appendChild(item);
    });
    card.appendChild(list);
  }

  return card;
}
