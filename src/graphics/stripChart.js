/**
 * High-performance Multi-Pen Canvas Strip Chart Recorder
 * Designed for industrial process automation monitoring
 */

export class StripChart {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    this.timeWindowMinutes = options.timeWindowMinutes || 10.0;
    this.yMin = options.yMin !== undefined ? options.yMin : 0.0;
    this.yMax = options.yMax !== undefined ? options.yMax : 160.0;
    this.yLabel = options.yLabel || 'Value';
    
    // Configurable pens
    this.pens = [
      { id: 'casPriPV', name: 'Cascade Temp PV (°C)', color: '#06b6d4', width: 2.5, visible: true, style: 'solid' },
      { id: 'casPriSP', name: 'Cascade Temp SP (°C)', color: '#38bdf8', width: 1.5, visible: true, style: 'dashed' },
      { id: 'convPV', name: 'Conventional Temp PV (°C)', color: '#f43f5e', width: 2.5, visible: true, style: 'solid' },
      { id: 'casSecPV', name: 'Steam Flow PV (%)', color: '#f59e0b', width: 2.0, visible: true, style: 'solid' },
      { id: 'casValvePos', name: 'Valve Stem (%)', color: '#10b981', width: 1.8, visible: false, style: 'solid' },
      { id: 'steamPressure', name: 'Steam Header Press (%)', color: '#a855f7', width: 1.8, visible: true, style: 'dotted' }
    ];

    this.dataPoints = [];
    this.paused = false;
    this.projectorMode = false;

    // Handle canvas resolution for crisp HiDPI screens
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  toggleProjectorMode() {
    this.projectorMode = !this.projectorMode;
    this.pens.forEach(p => {
      if (!p._baseWidth) p._baseWidth = p.width;
      p.width = this.projectorMode ? p._baseWidth * 1.7 : p._baseWidth;
    });
    this.render();
    return this.projectorMode;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  addPoint(point) {
    if (this.paused) return;
    this.dataPoints.push(point);
    // Keep reasonable history
    while (this.dataPoints.length > 2500) {
      this.dataPoints.shift();
    }
  }

  clear() {
    this.dataPoints = [];
    this.render();
  }

  setPenVisibility(penId, visible) {
    const pen = this.pens.find(p => p.id === penId);
    if (pen) pen.visible = visible;
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!w || !h) return;

    // Margins
    const padLeft = this.projectorMode ? 64 : 55;
    const padRight = 20;
    const padTop = 25;
    const padBottom = this.projectorMode ? 36 : 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Background
    ctx.fillStyle = '#0b0f19'; // Deep slate dark mode
    ctx.fillRect(0, 0, w, h);

    // Plot Area Background
    ctx.fillStyle = this.projectorMode ? '#0f172a' : '#111827';
    ctx.fillRect(padLeft, padTop, plotW, plotH);

    // Grid lines & Y-axis labels
    ctx.strokeStyle = this.projectorMode ? '#334155' : '#1f293d';
    ctx.lineWidth = this.projectorMode ? 1.5 : 1;
    ctx.fillStyle = this.projectorMode ? '#f1f5f9' : '#94a3b8';
    ctx.font = this.projectorMode ? 'bold 13px "JetBrains Mono", monospace' : '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yDivisions = 5;
    for (let i = 0; i <= yDivisions; i++) {
      const frac = i / yDivisions;
      const yVal = this.yMin + frac * (this.yMax - this.yMin);
      const yPos = padTop + plotH - frac * plotH;

      ctx.beginPath();
      ctx.moveTo(padLeft, yPos);
      ctx.lineTo(padLeft + plotW, yPos);
      ctx.stroke();

      ctx.fillText(yVal.toFixed(0), padLeft - (this.projectorMode ? 10 : 8), yPos);
    }

    // Time window calculation
    const latestTime = this.dataPoints.length > 0 ? this.dataPoints[this.dataPoints.length - 1].time : 0;
    const startTime = Math.max(0, latestTime - this.timeWindowMinutes);

    // Time axis X-divisions
    const xDivisions = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= xDivisions; i++) {
      const frac = i / xDivisions;
      const tVal = startTime + frac * (latestTime - startTime || this.timeWindowMinutes);
      const xPos = padLeft + frac * plotW;

      ctx.beginPath();
      ctx.moveTo(xPos, padTop);
      ctx.lineTo(xPos, padTop + plotH);
      ctx.stroke();

      ctx.fillText(`${tVal.toFixed(1)}m`, xPos, padTop + plotH + (this.projectorMode ? 10 : 8));
    }

    if (this.dataPoints.length < 2) return;

    // Clip to plot area
    ctx.save();
    ctx.beginPath();
    ctx.rect(padLeft, padTop, plotW, plotH);
    ctx.clip();

    // Draw Pens
    const timeSpan = Math.max(0.1, latestTime - startTime);

    for (const pen of this.pens) {
      if (!pen.visible) continue;

      ctx.strokeStyle = pen.color;
      ctx.lineWidth = pen.width;
      if (pen.style === 'dashed') {
        ctx.setLineDash([6, 4]);
      } else if (pen.style === 'dotted') {
        ctx.setLineDash([3, 3]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      let started = false;

      for (let i = 0; i < this.dataPoints.length; i++) {
        const pt = this.dataPoints[i];
        if (pt.time < startTime) continue;

        const xFrac = (pt.time - startTime) / timeSpan;
        const xPos = padLeft + xFrac * plotW;

        const val = pt[pen.id];
        if (val === undefined || isNaN(val)) continue;

        const yFrac = (val - this.yMin) / (this.yMax - this.yMin);
        const yPos = padTop + plotH - yFrac * plotH;

        if (!started) {
          ctx.moveTo(xPos, yPos);
          started = true;
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.stroke();
    }

    ctx.restore();

    // Border around plot
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(padLeft, padTop, plotW, plotH);
  }
}
