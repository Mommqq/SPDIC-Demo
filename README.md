<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPDIC: Project Page</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Plotly.js -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <!-- MathJax (仅用于静态公式) -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        body { font-family: 'Times New Roman', serif; background-color:a #f8f9fa; color: #333; }
        
        .hero-section { background: #fff; padding: 50px 0 30px; border-bottom: 1px solid #e0e0e0; margin-bottom: 30px; }
        .paper-title { font-weight: bold; color: #2c3e50; }
        .authors { color: #555; font-size: 1.2rem; margin-top: 10px; }
        .affiliations { color: #777; font-size: 1.0rem; font-style: italic; margin-bottom: 15px;}
        
        .btn-github { background-color: #24292e; color: #fff; border-radius: 30px; padding: 8px 25px; transition: 0.2s; text-decoration: none; font-weight: bold;}
        .btn-github:hover { background-color: #444; color: #fff; }

        .card { border: none; box-shadow: 0 6px 18px rgba(0,0,0,0.06); margin-bottom: 20px; border-radius: 12px; }
        .card-header { background: #fff; border-bottom: 2px solid #f1f1f1; font-weight: bold; padding: 15px; }
        
        /* Explanation Box */
        #dynamicExplainer { border-left-width: 6px; transition: all 0.3s ease; font-size: 0.95rem; }
        
        .rho-min-label { font-family: 'Times New Roman', serif; font-style: italic; font-weight: bold; color: #555; }
        .math-box { background: #eef; padding: 10px; border-radius: 5px; border-left: 4px solid #0d6efd; font-size: 0.9rem; }
    </style>
</head>
<body>

<div class="hero-section text-center">
    <div class="container">
        <h1 class="paper-title">Perceptual Distributed Image Compression: Only Need Stochasticity</h1>
        <div class="authors">Guojun Xu<sup>1</sup>, Jianwen Xiang<sup>2</sup>, Mingyang Zhang<sup>3</sup>, Junwei Zhou<sup>4</sup></div>
        <div class="affiliations"><sup>1</sup>Wuhan University of Technology, <sup>2</sup>the School of Computer Science and Technology</div>
        <div class="mt-3">
            <a href="https://github.com/Mommqq/SPDIC" target="_blank" class="btn-github"><i class="fab fa-github me-2"></i>Code & Models</a>
        </div>
    </div>
</div>

<div class="container" style="max-width: 1200px;">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>Interactive Analysis</span>
            <small class="text-muted fw-normal">Dashed lines indicate regions outside the P-D equilibrium</small>
        </div>
        <div class="card-body">
            <div class="row">
                <!-- Controls -->
                <div class="col-lg-4 border-end">
                    <h5 class="mb-3 text-primary">Parameters</h5>
                    
                    <!-- Rho Slider -->
                    <label class="form-label fw-bold d-flex justify-content-between">
                        <span>Correlation &rho; (Bitrate)</span>
                        <span id="rhoVal" class="text-primary">0.50</span>
                    </label>
                    <input type="range" class="form-range" id="rhoSlider" min="0.1" max="0.98" step="0.01" value="0.5">
                    <div class="d-flex justify-content-between text-muted small mb-3">
                        <span class="rho-min-label">&rho;<sub>SI</sub> (0.1)</span>
                        <span>High (0.98)</span>
                    </div>

                    <hr>

                    <!-- Beta Slider -->
                    <label class="form-label fw-bold d-flex justify-content-between">
                        <span>Variance Scale &beta; (Texture)</span>
                        <span id="betaVal" class="text-danger">0.50</span>
                    </label>
                    <input type="range" class="form-range" id="betaSlider" min="0.05" max="1.5" step="0.01" value="0.5">
                    <div class="d-flex justify-content-between text-muted small mb-3">
                        <span>Blur (0.05)</span>
                        <span>Texture (1.0)</span>
                        <span>Noise (1.5)</span>
                    </div>

                    <!-- Explanation -->
                    <div id="dynamicExplainer" class="alert alert-secondary p-3">
                        <span id="statusTitle" class="fw-bold d-block mb-1">Status</span>
                        <span id="statusText">Adjust sliders...</span>
                    </div>
                    
                    <!-- Metrics -->
                    <div class="d-flex justify-content-between bg-light p-2 rounded border mt-3 text-center">
                        <div class="flex-fill border-end">D (MSE) <div id="valD" class="fw-bold">--</div></div>
                        <div class="flex-fill">P (Div) <div id="valP" class="fw-bold">--</div></div>
                    </div>

                    <!-- Static Formula (MathJax works here) -->
                    <div class="math-box mt-3">
                        $$ D = [(\beta - \rho)^2 + (1 - \rho^2)] \sigma^2 $$
                        $$ P = 0.5 [\ln(\beta^2) + \beta^{-2} - 1] $$
                    </div>
                </div>

                <!-- Plots -->
                <div class="col-lg-8">
                    <div class="row">
                        <div class="col-md-7"><div id="pdChart" style="height:450px;"></div></div>
                        <div class="col-md-5"><div id="distChart" style="height:450px;"></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const sigma2 = 1.0;

    // Formulas
    function getD(beta, rho) {
        return (Math.pow(beta - rho, 2) + (1 - Math.pow(rho, 2))) * sigma2;
    }
    function getP(beta) {
        let b = Math.max(beta, 0.01);
        return 0.5 * (Math.log(b * b) + 1.0/(b * b) - 1.0);
    }
    function gaussian(x, sigma) {
        return (1.0 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(x / sigma, 2));
    }

    // Logic for Explanation (Fixed Symbols)
    function updateExplanation(rho, beta) {
        const box = document.getElementById('dynamicExplainer');
        const title = document.getElementById('statusTitle');
        const text = document.getElementById('statusText');
        
        let stateClass = "alert-secondary"; 
        let header = "";
        let msg = "";
        const eps = 0.03; 

        if (Math.abs(beta - 1.0) <= eps) {
            stateClass = "alert-success"; 
            header = "🌟 Perfect Perception (Ours)";
            // Use &beta; &rarr; &rho; etc. for safe rendering
            msg = `<b>&beta; &approx; 1.0</b>. Optimal texture restoration. Perception P is minimized (P &rarr; 0).`;
            box.style.borderLeftColor = "#198754";
            box.style.backgroundColor = "#d1e7dd";
            box.style.color = "#0f5132";
        }
        else if (Math.abs(beta - rho) <= eps) {
            stateClass = "alert-primary";
            header = "📉 Distortion Optimized";
            msg = `<b>&beta; &approx; &rho;</b>. Minimum MSE. However, variance is suppressed (&beta; &lt; 1), causing blurring.`;
            box.style.borderLeftColor = "#0d6efd";
            box.style.backgroundColor = "#cff4fc";
            box.style.color = "#055160";
        }
        else if (beta < rho) {
            stateClass = "alert-dark"; 
            header = "⚠️ Variance Collapse (Outside Equilibrium)";
            msg = `<b>&beta; &lt; &rho;</b>. Dashed line region. Variance is overly suppressed. Suboptimal for both D and P.`;
            box.style.borderLeftColor = "#6c757d";
            box.style.backgroundColor = "#e2e3e5";
            box.style.color = "#41464b";
        }
        else if (beta > 1.0 + eps) {
            stateClass = "alert-danger"; 
            header = "🚫 Excessive Noise (Outside Equilibrium)";
            msg = `<b>&beta; &gt; 1</b>. Dashed line region. Reconstruction is noisier than the original.`;
            box.style.borderLeftColor = "#dc3545";
            box.style.backgroundColor = "#f8d7da";
            box.style.color = "#842029";
        }
        else {
            stateClass = "alert-warning";
            header = "⚖️ Valid Trade-off";
            msg = `<b>&rho; &lt; &beta; &lt; 1</b>. Solid line region. Increasing texture (&beta; &rarr; 1) improves Perception but increases Distortion.`;
            box.style.borderLeftColor = "#ffc107";
            box.style.backgroundColor = "#fff3cd";
            box.style.color = "#664d03";
        }

        box.className = `alert p-3`; // Reset classes
        title.innerHTML = header;
        text.innerHTML = msg; // innerHTML allows bold tags
    }

    function updateCharts() {
        let rho = parseFloat(document.getElementById('rhoSlider').value);
        let beta = parseFloat(document.getElementById('betaSlider').value);

        document.getElementById('rhoVal').innerText = rho.toFixed(2);
        document.getElementById('betaVal').innerText = beta.toFixed(2);
        
        let currD = getD(beta, rho);
        let currP = getP(beta);
        document.getElementById('valD').innerText = currD.toFixed(3);
        document.getElementById('valP').innerText = currP.toFixed(3);

        updateExplanation(rho, beta);

        // --- Data Generation ---
        
        // 1. Blurry (Outside)
        let betaBlur = [];
        for(let b=0.05; b<=rho; b+=0.02) betaBlur.push(b);
        betaBlur.push(rho); 
        let dBlur = betaBlur.map(b => getD(b, rho));
        let pBlur = betaBlur.map(b => getP(b));

        // 2. Trade-off (Inside)
        let betaTrade = [];
        for(let b=rho; b<=1.0; b+=0.02) betaTrade.push(b);
        betaTrade.push(1.0); 
        let dTrade = betaTrade.map(b => getD(b, rho));
        let pTrade = betaTrade.map(b => getP(b));

        // 3. Noisy (Outside)
        let betaNoise = [];
        for(let b=1.0; b<=1.5; b+=0.02) betaNoise.push(b);
        let dNoise = betaNoise.map(b => getD(b, rho));
        let pNoise = betaNoise.map(b => getP(b));

        // --- Traces ---
        let traceBlur = {
            x: dBlur, y: pBlur, mode: 'lines', 
            name: 'Variance Collapse (β < ρ)',
            line: {color: '#999', width: 2, dash: 'dashdot'},
            hoverinfo: 'skip'
        };

        let traceTrade = {
            x: dTrade, y: pTrade, mode: 'lines', 
            name: 'Valid Trade-off (ρ ≤ β ≤ 1)',
            line: {color: '#0d6efd', width: 4}
        };

        let traceNoise = {
            x: dNoise, y: pNoise, mode: 'lines', 
            name: 'Excessive Noise (β > 1)',
            line: {color: '#999', width: 2, dash: 'dashdot'},
            hoverinfo: 'skip'
        };

        let traceCurrent = {
            x: [currD], y: [currP], mode: 'markers', name: 'Current State',
            marker: {color: '#d62728', size: 14, line: {color: 'white', width: 2}}
        };

        // Markers for Min/Max
        let minD = { x: [getD(rho, rho)], y: [getP(rho)] };
        let ideal = { x: [getD(1.0, rho)], y: [getP(1.0)] };
        
        let tracePts = {
            x: [minD.x[0], ideal.x[0]],
            y: [minD.y[0], ideal.y[0]],
            mode: 'markers',
            marker: {color: ['black', '#198754'], size: 10, symbol: ['diamond', 'star']},
            text: ['Min Distortion', 'Perfect Perception'],
            hovertemplate: '%{text}<extra></extra>'
        };

        let layoutPD = {
            title: '<b>P-D Trade-off Curve in DIC</b>',
            xaxis: { title: 'Distortion D', autorange: true },
            yaxis: { title: 'Perception P', autorange: true },
            showlegend: false,
            margin: {l: 50, r: 20, t: 40, b: 30},
            hovermode: 'closest'
        };

        // --- Distribution Plot ---
        let xRange = [];
        for(let x=-4; x<=4; x+=0.1) xRange.push(x);
        let distOrig = xRange.map(x => gaussian(x, 1.0));
        let distRecon = xRange.map(x => gaussian(x, beta));

        let traceDistOrig = {
            x: xRange, y: distOrig, fill: 'tozeroy', type: 'scatter', 
            line: {color: '#0d6efd', width: 0}
        };
        let traceDistRecon = {
            x: xRange, y: distRecon, mode: 'lines', 
            line: {color: '#d62728', width: 3}
        };

        let layoutDist = {
            title: `<b>Distribution (β=${beta.toFixed(2)})</b>`,
            xaxis: {title: 'Pixel Value'},
            yaxis: {title: 'Density', range: [0, 1.0]},
            showlegend: false,
            margin: {l: 40, r: 20, t: 40, b: 30}
        };

        Plotly.react('pdChart', [traceBlur, traceTrade, traceNoise, tracePts, traceCurrent], layoutPD);
        Plotly.react('distChart', [traceDistOrig, traceDistRecon], layoutDist);
    }

    document.getElementById('rhoSlider').addEventListener('input', updateCharts);
    document.getElementById('betaSlider').addEventListener('input', updateCharts);
    updateCharts();
</script>

</body>
</html>
