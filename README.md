<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Calculadora Táctica de Combustible Fluvial - EOFBC</title>
    
    <!-- PWA -->
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#0f172a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <style>
        :root {
            --bg-color: #020617;
            --card-bg: #0f172a;
            --accent-green: #10b981;
            --accent-green-bright: #34d399;
            --accent-blue: #3b82f6;
            --accent-cyan: #22d3ee;
            --accent-amber: #fbbf24;
            --accent-rose: #f43f5e;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: #1e293b;
        }

        * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
        }

        html, body {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 8px;
            overflow-x: hidden;
            box-sizing: border-box;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* HEADER */
        header { 
            background: var(--card-bg); 
            border: 1px solid var(--border-color); 
            padding: 16px; 
            border-radius: 16px; 
            display: flex; 
            flex-direction: column; 
            gap: 8px; 
        }

        .title-row { display: flex; align-items: center; gap: 8px; }
        .dot { width: 10px; height: 10px; background-color: var(--accent-green); border-radius: 50%; display: inline-block; }
        h1 { font-size: 1.1rem; font-weight: 900; text-transform: uppercase; color: #fff; letter-spacing: 0.5px; }
        p.subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .badge-reserva { 
            background: var(--bg-color); 
            border: 1px solid var(--border-color); 
            padding: 4px 8px; 
            border-radius: 6px; 
            font-size: 0.7rem; 
            color: var(--text-muted); 
            font-family: monospace; 
            align-self: flex-start; 
        }

        /* GRID SYSTEM */
        .grid { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 768px) {
            .grid { display: grid; grid-template-columns: 1fr 2fr; }
        }

        .card { 
            background: var(--card-bg); 
            border: 1px solid var(--border-color); 
            border-radius: 16px; 
            padding: 16px; 
            display: flex; 
            flex-direction: column; 
            gap: 12px; 
        }

        .card-title { 
            font-size: 0.8rem; 
            font-weight: 700; 
            color: var(--accent-green-bright); 
            text-transform: uppercase; 
            border-bottom: 1px solid var(--border-color); 
            padding-bottom: 6px; 
        }

        /* CONTROLES E INPUTS */
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 0.7rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; }
        input, select, button { -webkit-appearance: none; appearance: none; outline: none; }
        input, select { 
            background: var(--bg-color); 
            border: 1px solid var(--border-color); 
            color: #fff; 
            padding: 12px; 
            border-radius: 10px; 
            font-size: 0.9rem; 
            font-weight: 600; 
            width: 100%; 
        }
        input:focus, select:focus { border-color: var(--accent-green); }

        .flex-row { display: flex; gap: 8px; }

        .toggle-group { 
            display: flex; 
            background: var(--bg-color); 
            border: 1px solid var(--border-color); 
            padding: 3px; 
            border-radius: 10px; 
            gap: 4px; 
        }
        .btn-toggle { 
            flex: 1; 
            padding: 10px; 
            border: none; 
            background: transparent; 
            color: var(--text-muted); 
            font-size: 0.75rem; 
            font-weight: 700; 
            border-radius: 8px; 
            cursor: pointer; 
            text-align: center; 
        }
        .btn-toggle.active { background: #059669; color: #fff; }

        /* TARJETAS METRICAS */
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 8px; 
            width: 100%;
        }
        @media (min-width: 480px) { 
            .summary-grid { grid-template-columns: repeat(4, 1fr); } 
        }

        .sum-card { 
            background: var(--card-bg); 
            border: 1px solid var(--border-color); 
            padding: 12px; 
            border-radius: 12px; 
            display: flex; 
            flex-direction: column; 
        }
        .sum-title { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .sum-val { font-size: 1.1rem; font-weight: 900; color: var(--accent-green-bright); font-family: monospace; margin: 2px 0; }
        .sum-sub { font-size: 0.65rem; color: #64748b; }

        /* TABLA DE RESULTADOS */
        .table-container { 
            width: 100%; 
            overflow-x: auto; 
            -webkit-overflow-scrolling: touch; 
            background-color: #0b1329;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.75rem; text-align: left; background-color: #0b1329; }
        th { 
            color: var(--text-muted); 
            border-bottom: 1px solid var(--border-color); 
            padding: 8px 4px; 
            text-transform: uppercase; 
            font-family: monospace; 
            font-size: 0.65rem; 
            background-color: #0b1329;
        }
        td { padding: 10px 4px; border-bottom: 1px solid var(--border-color); font-family: monospace; background-color: #0b1329; }

        .progress-bar { 
            width: 100%; 
            background: var(--bg-color); 
            border-radius: 4px; 
            height: 6px; 
            overflow: hidden; 
            margin-top: 4px; 
            border: 1px solid var(--border-color); 
        }
        .progress-fill { height: 100%; background: var(--accent-green); }
        .hidden { display: none !important; }

        @media (max-width: 480px) {
            th, td { padding: 6px 2px !important; font-size: 0.65rem !important; }
            .sum-val { font-size: 0.95rem !important; }
        }
    </style>
</head>
<body>

    <div class="container">
        
        <!-- ENCABEZADO -->
        <header>
            <div class="title-row">
                <span class="dot"></span>
                <h1>Calculadora Táctica EOFBC</h1>
            </div>
            <p class="subtitle">Batallón Fluvial de Infantería de Marina — Control Operativo 52-1 / 52-2</p>
            <div class="badge-reserva">MARGEN SEGURIDAD: <strong style="color: var(--accent-amber);">30% RESERVA</strong></div>
        </header>

        <div class="grid">
            
            <!-- CONTROLES Y PARÁMETROS -->
            <div class="card">
                <div class="card-title">Parámetros de Navegación</div>
                
                <div class="field-group">
                    <label>Modo de Cálculo:</label>
                    <div class="toggle-group">
                        <button type="button" id="btnModoGrupo" class="btn-toggle active">Consolidado</button>
                        <button type="button" id="btnModoInd" class="btn-toggle">Individual</button>
                    </div>
                </div>

                <div class="field-group">
                    <label for="unidadSelect">Unidad Operativa:</label>
                    <select id="unidadSelect">
                        <option value="EOFBC_52_2">EOFBC 52-2 (4 Botes Bimotor)</option>
                        <option value="EOFBC_52_1">EOFBC 52-1 (4 Botes Bimotor)</option>
                    </select>
                </div>

                <div id="containerBoteInd" class="field-group hidden">
                    <label for="boteIndSelect">Seleccionar Bote:</label>
                    <select id="boteIndSelect"></select>
                </div>

                <div class="field-group">
                    <label for="distanciaInput">Distancia a Navegar:</label>
                    <div class="flex-row">
                        <input type="number" id="distanciaInput" value="50" min="0.1" step="0.1" inputmode="decimal">
                        <select id="unidadDistSelect" style="width: 90px;">
                            <option value="MN">MN</option>
                            <option value="KM">KM</option>
                            <option value="MI">MI</option>
                        </select>
                    </div>
                </div>

                <div class="field-group">
                    <label for="corrienteSelect">Sentido de Navegación (Corriente):</label>
                    <select id="corrienteSelect">
                        <option value="1.00" selected>Aguas Calmas / Neutro</option>
                        <option value="1.20">Contra Corriente (Aguas Arriba +20%)</option>
                        <option value="0.85">A Favor de Corriente (Aguas Abajo -15%)</option>
                    </select>
                </div>

                <div class="field-group">
                    <label for="rpmSelect">Régimen de Marcha (RPM):</label>
                    <select id="rpmSelect">
                        <option value="2500">2.500 RPM (Velocidad Mínima / Patrullaje)</option>
                        <option value="4000">4.000 RPM (Crucero Económico)</option>
                        <option value="4800" selected>4.800 RPM (Crucero Táctico)</option>
                        <option value="5500">5.500 RPM (Máximas Revoluciones / Interdicción)</option>
                    </select>
                </div>

                <div class="field-group">
                    <label for="precioGalonInput">Precio Galón (COP):</label>
                    <input type="number" id="precioGalonInput" value="16000" min="0" step="100" inputmode="numeric">
                </div>

                <div style="background: var(--bg-color); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.65rem; color: var(--text-muted);">
                    <div style="font-weight: bold; color: #cbd5e1; margin-bottom: 4px; border-bottom: 1px solid var(--border-color); padding-bottom: 2px;">Consumo Base Bimotor Combinado:</div>
                    <div style="display:flex; justify-content:space-between;"><span>2x Mercury 90 HP:</span> <strong style="color:var(--accent-green-bright);">0.76 Gln/MN</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>2x Mercury 115 HP:</span> <strong style="color:var(--accent-green-bright);">0.80 Gln/MN</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>2x Mercury 200 HP:</span> <strong style="color:var(--accent-green-bright);">1.70 Gln/MN</strong></div>
                </div>
            </div>

            <!-- RESULTADOS Y DESGLOSE -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
                
                <div class="summary-grid">
                    <div class="sum-card">
                        <span class="sum-title">Comb. Req.</span>
                        <span id="cardConsumo" class="sum-val">0 Gln</span>
                        <span id="cardDistEquiv" class="sum-sub">Equiv: 0 MN</span>
                    </div>

                    <div class="sum-card">
                        <span class="sum-title">Costo Misión</span>
                        <span id="cardCostoTotal" class="sum-val" style="color:#a7f3d0; font-size:0.95rem;">$0</span>
                        <span id="cardPorcentaje" class="sum-sub">Gasto: 0%</span>
                    </div>

                    <div class="sum-card">
                        <span class="sum-title">Comb. Restante</span>
                        <span id="cardRestante" class="sum-val" style="color:var(--accent-cyan);">0 Gln</span>
                        <span class="sum-sub">En tanques</span>
                    </div>

                    <div class="sum-card">
                        <span class="sum-title">Autonomía (30%)</span>
                        <span id="cardAutonomiaReserva" class="sum-val" style="color:var(--accent-amber);">0 MN</span>
                        <span id="cardAutonomiaMax" class="sum-sub">Max: 0 MN</span>
                    </div>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                        <h3 id="tituloDetalle" style="font-size: 0.75rem; font-weight: 700; color: #fff; text-transform: uppercase;">Desglose de Flotilla</h3>
                        <span id="badgeModo" style="font-size: 0.6rem; background: #064e3b; color: var(--accent-green-bright); padding: 2px 6px; border-radius: 4px; font-weight: 700;">CONSOLIDADO</span>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bote / Motor</th>
                                    <th style="text-align: center;">Cap.</th>
                                    <th style="text-align: center;">Consumo</th>
                                    <th style="text-align: center;">Costo (COP)</th>
                                    <th style="text-align: right;">Autonomía</th>
                                </tr>
                            </thead>
                            <tbody id="tablaCuerpo"></tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script>
        var unidadesData = {
            "EOFBC_52_2": {
                nombre: "EOFBC 52-2",
                botes: [
                    { id: "522_1", nombre: "Bote 01", motor: "2x 115 HP", hp: 115, cap: 120, cons: 0.80 },
                    { id: "522_2", nombre: "Bote 02", motor: "2x 90 HP",  hp: 90,  cap: 100, cons: 0.76 },
                    { id: "522_3", nombre: "Bote 03", motor: "2x 90 HP",  hp: 90,  cap: 100, cons: 0.76 },
                    { id: "522_4", nombre: "Bote 04", motor: "2x 200 HP", hp: 200, cap: 153, cons: 1.70 }
                ]
            },
            "EOFBC_52_1": {
                nombre: "EOFBC 52-1",
                botes: [
                    { id: "521_1", nombre: "Bote 01", motor: "2x 90 HP",  hp: 90,  cap: 120, cons: 0.76 },
                    { id: "521_2", nombre: "Bote 02", motor: "2x 90 HP",  hp: 90,  cap: 120, cons: 0.76 },
                    { id: "521_3", nombre: "Bote 03", motor: "2x 90 HP",  hp: 90,  cap: 120, cons: 0.76 },
                    { id: "521_4", nombre: "Bote 04", motor: "2x 200 HP", hp: 200, cap: 220, cons: 1.70 }
                ]
            }
        };

        var modoActual = 'grupo';

        function renderSeleccionBote() {
            var unidadKey = document.getElementById('unidadSelect').value;
            var boteSelect = document.getElementById('boteIndSelect');
            var botes = unidadesData[unidadKey].botes;

            boteSelect.innerHTML = "";
            for (var i = 0; i < botes.length; i++) {
                var opt = document.createElement('option');
                opt.value = i;
                opt.innerText = botes[i].nombre + " (" + botes[i].motor + " - " + botes[i].cap + " Gln)";
                boteSelect.appendChild(opt);
            }
        }

        function setModo(modo) {
            modoActual = modo;
            var btnGrupo = document.getElementById('btnModoGrupo');
            var btnInd = document.getElementById('btnModoInd');
            var containerBoteInd = document.getElementById('containerBoteInd');
            var badgeModo = document.getElementById('badgeModo');

            if (modo === 'grupo') {
                btnGrupo.className = "btn-toggle active";
                btnInd.className = "btn-toggle";
                containerBoteInd.className = "field-group hidden";
                badgeModo.innerText = "CONSOLIDADO";
                badgeModo.style.background = "#064e3b";
                badgeModo.style.color = "#34d399";
            } else {
                btnInd.className = "btn-toggle active";
                btnGrupo.className = "btn-toggle";
                containerBoteInd.className = "field-group";
                badgeModo.innerText = "INDIVIDUAL";
                badgeModo.style.background = "#164e63";
                badgeModo.style.color = "#22d3ee";
            }
            renderSeleccionBote();
            calcular();
        }

        function formatoCOP(valor) {
            return "$" + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function obtenerFactorRPM(rpmSeleccionadas, hpBote) {
            var rpm = parseInt(rpmSeleccionadas);
            if (hpBote <= 115) {
                if (rpm <= 2500) return 0.65;
                if (rpm <= 4000) return 0.85;
                if (rpm <= 4800) return 1.00;
                return 1.30;
            } else {
                if (rpm <= 2500) return 0.55;
                if (rpm <= 4000) return 0.75;
                if (rpm <= 4800) return 0.90;
                return 1.15;
            }
        }

        function calcular() {
            var unidadKey = document.getElementById('unidadSelect').value || "EOFBC_52_2";
            var unidadInfo = unidadesData[unidadKey];
            
            var rawDist = document.getElementById('distanciaInput').value;
            var distVal = parseFloat(rawDist);
            if (isNaN(distVal) || distVal <= 0) distVal = 0;

            var unidadDist = document.getElementById('unidadDistSelect').value || "MN";
            
            var rawPrecio = document.getElementById('precioGalonInput').value;
            var precioGalon = parseFloat(rawPrecio);
            if (isNaN(precioGalon) || precioGalon < 0) precioGalon = 0;

            var factorCorriente = parseFloat(document.getElementById('corrienteSelect').value) || 1.0;
            var rpmSeleccionadas = document.getElementById('rpmSelect').value || "4800";

            var distanciaMN = distVal;
            if (unidadDist === "KM") {
                distanciaMN = distVal / 1.852;
            } else if (unidadDist === "MI") {
                distanciaMN = distVal / 1.15078;
            }

            var botesACalcular = [];
            if (modoActual === 'grupo') {
                botesACalcular = unidadInfo.botes;
                document.getElementById('tituloDetalle').innerText = "Consolidado: " + unidadInfo.nombre;
            } else {
                var indexBote = parseInt(document.getElementById('boteIndSelect').value);
                if (isNaN(indexBote)) indexBote = 0;
                botesACalcular = [unidadInfo.botes[indexBote] || unidadInfo.botes[0]];
                document.getElementById('tituloDetalle').innerText = "Detalle: " + botesACalcular[0].nombre;
            }

            var totalCapacidad = 0;
            var totalConsumo = 0;
            var tablaHTML = "";

            for (var i = 0; i < botesACalcular.length; i++) {
                var b = botesACalcular[i];
                var factorRPM = obtenerFactorRPM(rpmSeleccionadas, b.hp);
                
                var consumoBote = distanciaMN * b.cons * factorCorriente * factorRPM;
                var pctGastadoBote = b.cap > 0 ? Math.min(100, (consumoBote / b.cap) * 100) : 0;
                var costoBote = consumoBote * precioGalon;
                
                var consAjustadoPorMN = b.cons * factorCorriente * factorRPM;
                var autoMaxMN = consAjustadoPorMN > 0 ? (b.cap / consAjustadoPorMN) : 0;
                var autoResMN = autoMaxMN * 0.70;

                totalCapacidad += b.cap;
                totalConsumo += consumoBote;

                var colorBarra = "#10b981";
                if (pctGastadoBote > 80) colorBarra = "#f43f5e";
                else if (pctGastadoBote > 60) colorBarra = "#f59e0b";

                tablaHTML += '<tr>' +
                    '<td><div style="font-weight:bold; color:#ffffff !important;">' + b.nombre + '</div><div style="font-size:0.65rem; color:#34d399 !important;">' + b.motor + '</div></td>' +
                    '<td style="text-align:center; color:#cbd5e1 !important; font-weight:600;">' + b.cap + ' Gln</td>' +
                    '<td style="text-align:center;"><span style="font-weight:bold; color:#34d399 !important;">' + consumoBote.toFixed(1) + ' Gln</span>' +
                    '<div class="progress-bar"><div class="progress-fill" style="width: ' + pctGastadoBote + '%; background: ' + colorBarra + ';"></div></div></td>' +
                    '<td style="text-align:center; font-weight:bold; color:#ffffff !important;">' + formatoCOP(costoBote) + '</td>' +
                    '<td style="text-align:right;"><div style="font-weight:bold; color:#fbbf24 !important;">' + autoResMN.toFixed(0) + ' MN</div>' +
                    '<div style="font-size:0.6rem; color:#94a3b8 !important;">' + (autoResMN * 1.852).toFixed(0) + ' KM</div></td>' +
                    '</tr>';
            }

            var totalRestante = Math.max(0, totalCapacidad - totalConsumo);
            var totalPctGastado = totalCapacidad > 0 ? Math.min(100, (totalConsumo / totalCapacidad) * 100) : 0;
            var costoTotalMision = totalConsumo * precioGalon;

            var consPromedioGrupoAjustado = 0;
            for (var j = 0; j < botesACalcular.length; j++) {
                var bGrupo = botesACalcular[j];
                consPromedioGrupoAjustado += (bGrupo.cons * factorCorriente * obtenerFactorRPM(rpmSeleccionadas, bGrupo.hp));
            }
            
            var autoMaxGrupoMN = consPromedioGrupoAjustado > 0 ? (totalCapacidad / consPromedioGrupoAjustado) : 0;
            var autoResGrupoMN = autoMaxGrupoMN * 0.70;

            document.getElementById('cardConsumo').innerText = totalConsumo.toFixed(1) + " Gln";
            document.getElementById('cardDistEquiv').innerText = unidadDist === "MN" ? (distanciaMN * 1.852).toFixed(1) + " KM equiv." : distanciaMN.toFixed(1) + " MN equiv.";
            document.getElementById('cardCostoTotal').innerText = formatoCOP(costoTotalMision);
            document.getElementById('cardPorcentaje').innerText = "Gasto: " + totalPctGastado.toFixed(1) + "%";
            document.getElementById('cardRestante').innerText = totalRestante.toFixed(1) + " Gln";
            document.getElementById('cardAutonomiaReserva').innerText = autoResGrupoMN.toFixed(0) + " MN";
            document.getElementById('cardAutonomiaMax').innerText = "Max: " + autoMaxGrupoMN.toFixed(0) + " MN";

            document.getElementById('tablaCuerpo').innerHTML = tablaHTML;
        }

        function bindEvents() {
            document.getElementById('btnModoGrupo').onclick = function() { setModo('grupo'); };
            document.getElementById('btnModoInd').onclick = function() { setModo('individual'); };

            var elementIds = ['unidadSelect', 'boteIndSelect', 'distanciaInput', 'unidadDistSelect', 'precioGalonInput', 'corrienteSelect', 'rpmSelect'];
            var events = ['input', 'change', 'keyup', 'blur'];

            for (var i = 0; i < elementIds.length; i++) {
                var el = document.getElementById(elementIds[i]);
                if (el) {
                    for (var j = 0; j < events.length; j++) {
                        el.addEventListener(events[j], (function(id) {
                            return function() {
                                if (id === 'unidadSelect') renderSeleccionBote();
                                calcular();
                            };
                        })(elementIds[i]));
                    }
                }
            }
        }

        window.onload = function() {
            bindEvents();
            renderSeleccionBote();
            calcular();
        };
    </script>
</body>
</html>
