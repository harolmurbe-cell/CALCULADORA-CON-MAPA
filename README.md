# CALCULADORA-CON-MAPA
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Calculadora Táctica y Mapa Fluvial Arauca - EOFBC</title>
    
    <!-- PWA -->
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#0f172a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Leaflet CSS (Mapa) -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

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
            max-width: 1000px;
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
            .grid { display: grid; grid-template-columns: 1fr 1.8fr; }
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

        /* MAPA */
        #map {
            width: 100%;
            height: 280px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background: #0b1329;
            z-index: 1;
        }

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
            #map { height: 220px; }
        }
    </style>
</head>
<body>

    <div class="container">
        
        <!-- ENCABEZADO -->
        <header>
            <div class="title-row">
                <span class="dot"></span>
                <h1>Calculadora Táctica y Mapa Fluvial - EOFBC</h1>
            </div>
            <p class="subtitle">Batallón Fluvial de Infantería de Marina — Jurisdicción Río Arauca</p>
            <div class="badge-reserva">MARGEN SEGURIDAD: <strong style="color: var(--accent-amber);">30% RESERVA</strong></div>
        </header>

        <div class="grid">
            
            <!-- CONTROLES Y PARÁMETROS -->
            <div class="card">
                <div class="card-title">Parámetros de Navegación</div>
                
                <div class="field-group">
                    <label>Ruta Predeterminada (Jurisdicción):</label>
                    <select id="rutaPredefinidaSelect">
                        <option value="custom">-- Selección Manual / Directa --</option>
                        <option value="contreras_arauquita">Pto. Contreras ➔ Arauquita (~38 MN)</option>
                        <option value="arauquita_arauca">Arauquita ➔ Arauca (~52 MN)</option>
                        <option value="arauca_ptocolombia">Arauca ➔ Pto. Colombia (~35 MN)</option>
                        <option value="contreras_ptocolombia">Ruta Completa: Pto. Contreras ➔ Pto. Colombia (~125 MN)</option>
                    </select>
                </div>

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
            </div>

            <!-- MAPA Y RESULTADOS DESGLOSADOS -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
                
                <!-- SECCIÓN MAPA -->
                <div class="card">
                    <div class="card-title">Mapa Operativo del Río Arauca</div>
                    <div id="map"></div>
                </div>

                <!-- RESUMEN DE CONSUMO -->
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

                <!-- TABLA -->
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

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <script>
        // --- DATOS DE UNIDADES ---
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
        var map;

        // --- PUNTOS Y TRAYECTO DEL RÍO ARAUCA ---
        var puntosJurisdiccion = [
            { nombre: "Puerto Contreras (Saravena)", coords: [6.8928, -71.8481] },
            { nombre: "Arauquita", coords: [7.0274, -71.4272] },
            { nombre: "Arauca (Base / Muelle)", coords: [7.0847, -70.7591] },
            { nombre: "Puerto Colombia (Arauca)", coords: [6.9583, -70.3667] }
        ];

        function initMap() {
            // Inicializar mapa centrado en Arauquita / sector medio
            map = L.map('map').setView([7.02, -71.10], 8);

            // Capa de mapa (CartoDB DarkMatter para interfaz táctica nocturna/oscura)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 14
            }).addTo(map);

            // Trazar línea táctica del río
            var latlngs = puntosJurisdiccion.map(function(p) { return p.coords; });
            var polyline = L.polyline(latlngs, { color: '#22d3ee', weight: 4, opacity: 0.8, dashArray: '5, 10' }).addTo(map);

            // Ajustar encuadre del mapa
            map.fitBounds(polyline.getBounds());

            // Agregar marcadores en los puntos clave
            puntosJurisdiccion.forEach(function(p, idx) {
                var marker = L.circleMarker(p.coords, {
                    radius: 7,
                    fillColor: idx === 0 || idx === 3 ? "#fbbf24" : "#10b981",
                    color: "#ffffff",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.9
                }).addTo(map);

                marker.bindPopup("<strong style='color:#000;'>" + p.nombre + "</strong>");
            });
        }

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

        function manejarSeleccionRuta() {
            var val = document.getElementById('rutaPredefinidaSelect').value;
            var distInput = document.getElementById('distanciaInput');
            var unitSelect = document.getElementById('unidadDistSelect');

            unitSelect.value = "MN";

            switch(val) {
                case "contreras_arauquita":
                    distInput.value = 38;
                    break;
                case "arauquita_arauca":
                    distInput.value = 52;
                    break;
                case "arauca_ptocolombia":
                    distInput.value = 35;
                    break;
                case "contreras_ptocolombia":
                    distInput.value = 125;
                    break;
                default:
                    return;
            }
            calcular();
        }

        function bindEvents() {
            document.getElementById('btnModoGrupo').onclick = function() { setModo('grupo'); };
            document.getElementById('btnModoInd').onclick = function() { setModo('individual'); };
            document.getElementById('rutaPredefinidaSelect').onchange = manejarSeleccionRuta;

            var elementIds = ['unidadSelect', 'boteIndSelect', 'distanciaInput', 'unidadDistSelect', 'precioGalonInput', 'corrienteSelect', 'rpmSelect'];
            var events = ['input', 'change', 'keyup', 'blur'];

            for (var i = 0; i < elementIds.length; i++) {
                var el = document.getElementById(elementIds[i]);
                if (el) {
                    for (var j = 0; j < events.length; j++) {
                        el.addEventListener(events[j], (function(id) {
                            return function() {
                                if (id === 'distanciaInput') document.getElementById('rutaPredefinidaSelect').value = 'custom';
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
            initMap();
            calcular();
        };

        // ==========================================
// 1. INICIALIZACIÓN DEL MAPA (Leaflet)
// ==========================================
// Centrado inicial en la jurisdicción del Río Arauca
const map = L.map('map').setView([7.017873, -71.581611], 13);

// Capa Base OpenStreetMap (se guarda en caché mediante el Service Worker de la PWA)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap'
}).addTo(map);

// ==========================================
// 2. MATRIZ DE COORDENADAS (Extraídas del KML)
// ==========================================
// Formato esperado por Leaflet: [Latitud, Longitud]
const tramoKmlCoordenadas = [
  [7.017873164959447, -71.58161119000000-70.11822330370158,6.979620671346603,0 -70.12110692219271,6.978823556583314,0 -70.12267387278813,6.978722286283028,0 -70.12408986130355,6.979038328357921,0 -70.12609369012294,6.978736934928598,0 -70.12753708695791,6.977886508145273,0 -70.12885249159169,6.97698209590151,0 -70.13012776678254,6.976638314507312,0 -70.13186590554757,6.976002317082354,0 -70.13292283677599,6.975100808673119,0 -70.13386558030795,6.975186454392467,0 -70.13586511701534,6.976661711092605,0 -70.13708086123133,6.977231357742852,0 -70.13804513604954,6.977187213943049,0 -70.13989315465167,6.976609102208602,0 -70.14034826220231,6.976692727203771,0 -70.14120279220528,6.978174110747433,0 -70.14186559578182,6.978909194975199,0 -70.1431077328936,6.978737183244398,0 -70.14434474227754,6.978428339330469,0 -70.1449489395381,6.978901573564851,0 -70.14510487629785,6.980342367171676,0 -70.14499316918345,6.98111185840827,0 -70.14506686591162,6.982255586929065,0 -70.14585036648631,6.983092303368367,0 -70.14720456911382,6.98384462711265,0 -70.14804124708066,6.984276835941758,0 -70.14857674207958,6.984509686785997,0 -70.14970688906284,6.984206764338039,0 -70.15106585705635,6.983393680665062,0 -70.15167662907018,6.982824024243706,0 -70.15365329696475,6.982472157298535,0 -70.15488438686722,6.982039926720262,0 -70.1558496960412,6.981281279962441,0 -70.15657244524569,6.980438029786818,0 -70.15853451195937,6.980452788456871,0 -70.16080228217015,6.980189468787547,0 -70.16335905498254,6.979148557339054,0 -70.16569475230885,6.978266334706134,0 -70.16653118074125,6.977828635828855,0 -70.16736224754938,6.978026040288457,0 -70.16871085158547,6.978699583892106,0 -70.16977192149925,6.978399052316238,0 -70.17118632164549,6.977205396215613,0 -70.17201854467748,6.976619996275104,0 -70.17295684097708,6.976445841538292,0 -70.17385296566077,6.976572905422083,0 -70.17473791542795,6.977127082202179,0 -70.17649756287311,6.978204380339188,0 -70.17895347768577,6.97925114035182,0 -70.18008809342167,6.979459488881172,0 -70.18063013528651,6.979199349613021,0 -70.18122947931298,6.978167694320334,0 -70.18158643035544,6.977382460506263,0 -70.18236404047491,6.976783392117315,0 -70.18302020362853,6.976687089204355,0 -70.1845119050743,6.977413521070453,0 -70.187509374879,6.978653568030134,0 -70.18859422824485,6.978648873071016,0 -70.18933811542999,6.978474532783447,0 -70.18993103304098,6.977671003651672,0 -70.19026024830664,6.977221208437784,0 -70.19064560931004,6.976658427959459,0 -70.19115513407023,6.976288070948964,0 -70.19173692264359,6.97614684565382,0 -70.19290018168751,6.976679282007712,0 -70.1941879868364,6.977959217020296,0 -70.19535661391855,6.978965944416263,0 -70.19621487938201,6.979155302314205,0 -70.19761979473729,6.978501132984041,0 -70.1994196003246,6.977386732172535,0 -70.20153324344167,6.975801382957869,0 -70.20231965055079,6.975693744423386,0 -70.20296271439138,6.975953235469003,0 -70.2039454309093,6.977437174675691,0 -70.20477878923674,6.978433110883632,0 -70.20530802698543,6.978609660766529,0 -70.20612270920049,6.978319726840673,0 -70.20696142747124,6.977368741081522,0 -70.20919381325221,6.975008500746065,0 -70.2100327719281,6.974600335707953,0 -70.21135429556571,6.974455852323324,0 -70.21212262963473,6.974759164644964,0 -70.21425340062636,6.97571030061905,0 -70.21610712304572,6.976039581666551,0 -70.21740038104574,6.975807224609314,0 -70.22020584677368,6.97444984260737,0 -70.22148439764804,6.974632977230466,0 -70.22261999685452,6.974954352781674,0 -70.2236651506181,6.975021233807507,0 -70.2241431333693,6.974836516691418,0 -70.22502427730733,6.973108229754129,0 -70.22549622149754,6.972248342487535,0 -70.2267254086246,6.971970627963847,0 -70.22811722566018,6.971696561061956,0 -70.22871606398469,6.971244206852621,0 -70.22891454446571,6.970779683142704,0 -70.22845592977539,6.969367329639234,0 -70.22813487831041,6.96834952440387,0 -70.22814709883539,6.967759974875487,0 -70.22846824104626,6.966936006252759,0 -70.23030343075243,6.965486165534075,0 -70.23138505673235,6.964962390950354,0 -70.23595640384285,6.962869283518546,0 -70.23864959691763,6.962189779216249,0 -70.24063087053598,6.961982631482988,0 -70.24154936708813,6.961633628069969,0 -70.24291652688952,6.960450802584162,0 -70.24439298321754,6.959396612286985,0 -70.24691297532283,6.959384649891319,0 -70.24859368097492,6.959191022191688,0 -70.24953515538749,6.958649987571782,0 -70.25042676654216,6.957563756532397,0 -70.2505879013721,6.956837893322457,0 -70.25015170275013,6.955945563961348,0 -70.24909517193703,6.954626185761061,0 -70.24889680487968,6.954064215034686,0 -70.24923164368541,6.953373767046826,0 -70.250882963793,6.952693465510679,0 -70.25219947611205,6.95221084329315,0 -70.25383899471457,6.950920383621073,0 -70.25460561049167,6.949826767234841,0 -70.25500969077257,6.948708167221295,0 -70.25537016068944,6.947842204568581,0 -70.25629860256787,6.946714880266065,0 -70.25678821952073,6.946298079572717,0 -70.25762382237224,6.945949006895858,0 -70.25924395396105,6.945578835895442,0 -70.26036118775568,6.945100671234059,0 -70.26183730880265,6.944244682391636,0 -70.26243058553582,6.943416842741286,0 -70.26363038902956,6.942430192844638,0 -70.26476967726867,6.941706733193529,0 -70.26555255353641,6.941281805240583,0 -70.26670704772478,6.94088948846009,0 -70.26770171078262,6.940937510696424,0 -70.26850478631505,6.940979779514691,0 -70.27125510460307,6.941427397644246,0 -70.27251641110634,6.941386616560576,0 -70.27316254691577,6.941068244143174,0 -70.2743773822896,6.940299945453685,0 -70.27596807095964,6.938780709005277,0 -70.27734217946534,6.937819327832215,0 -70.27852481971074,6.937863111630229,0 -70.279840676394,6.938603090717821,0 -70.28092946287572,6.939934302772684,0 -70.28192663485626,6.940802495168525,0 -70.28299997703381,6.941154973710446,0 -70.28450276551158,6.941033319350994,0 -70.28550988811993,6.940100313134494,0 -70.28615000772938,6.938605347286957,0 -70.2868282867427,6.937166318316911,0 -70.28783101678658,6.936369032089528,0 -70.289738572929,6.935963757057042,0 -70.29104838460938,6.935410077502885,0 -70.29378891047561,6.933968626953545,0 -70.29506923279213,6.933822344644609,0 -70.29707935811764,6.93522976519786,0 -70.29882904301411,6.93610835455176,0 -70.30103584906674,6.937111857412098,0 -70.30290534859009,6.937249892580422,0 -70.30484027621023,6.936869856663491,0 -70.30645527204997,6.937040468066344,0 -70.30823458039745,6.937713726659092,0 -70.30904702571728,6.937211663309346,0 -70.31021391978031,6.936137318989952,0 -70.31522054316909,6.935637078172713,0 -70.31701802182695,6.935786995035751,0 -70.31934643986546,6.93530985300254,0 -70.32105546176486,6.934868780766999,0 -70.32224463791211,6.934844115489156,0 -70.32399703679586,6.935470465448375,0 -70.3246433408181,6.936203241349768,0 -70.32523174073962,6.937579462298709,0 -70.32598353895563,6.939577705344822,0 -70.32661300210266,6.940325580722364,0 -70.32804826292477,6.941080755473359,0 -70.32919576420315,6.94099326771469,0 -70.33178596678081,6.94047107452467,0 -70.3336970111295,6.941067681900497,0 -70.33625457182831,6.943765014623737,0 -70.33742315640181,6.944675113449319,0 -70.33860599298865,6.945149246080676,0 -70.34009878474292,6.944886204854375,0 -70.34176180793078,6.944167099929083,0 -70.34295216993677,6.943981316580013,0 -70.3437902952179,6.944322110864594,0 -70.34460770423168,6.945137575468589,0 -70.34537243433574,6.946881944178634,0 -70.34589640918841,6.947576886461552,0 -70.34764133213079,6.949175385833165,0 -70.34795304526284,6.949970530667589,0 -70.34807603269918,6.950854962647813,0 -70.34779853207272,6.951927928012513,0 -70.34848834883157,6.95272392428376,0 -70.34947469736024,6.952942758877523,0 -70.35082672839475,6.95249129367532,0 -70.35236738359912,6.951739770127271,0 -70.35305241474111,6.951497338184621,0 -70.35376517708991,6.951690719784652,0 -70.35451934282321,6.952352786855702,0 -70.35491618536831,6.953202676588441,0 -70.35458440258259,6.953851891686574,0 -70.35236956280635,6.954221638851854,0 -70.35118322786873,6.954723330775555,0 -70.3505884138703,6.955296778792002,0 -70.35111550817484,6.95635246809122,0 -70.35243121707992,6.957002971160216,0 -70.35471421566362,6.957431684835239,0 -70.35621354872372,6.957358687361957,0 -70.35762759720267,6.956340738650726,0 -70.35893735250691,6.955574581483061,0 -70.36012267249274,6.95595777969945,0 -70.36077264466857,6.956860205542625,0 -70.36084130354934,6.957734298593516,0 -70.36133362275051,6.959209474052861,0 -70.3622584099288,6.962186309933895,0 -70.36236017979962,6.96319514326937,0 -70.36093046739866,6.965738718599987,0 -70.36083872384681,6.966719634192122,0 -70.36120648512158,6.96747782579808,0 -70.36203707886078,6.967793765016656,0 -70.36401978297206,6.967254224120268,0 -70.36501939437478,6.966890551550612,0 -70.36564501880274,6.967028909228259,0 -70.36687669024958,6.96925721964545,0 -70.36733929769089,6.96998368371537,0 -70.36966818456848,6.97105705580106,0 -70.3709406487333,6.971693934676312,0 -70.37119610707299,6.972967576478401,0 -70.37117277610952,6.974717830925738,0 -70.37131235589281,6.975988704378087,0 -70.37114749737231,6.977942130886794,0 -70.37086866561691,6.979827310786336,0 -70.37122106371213,6.98064892693295,0 -70.37184092318182,6.981189194826177,0 -70.37394129674003,6.98133615803699,0 -70.37551175911689,6.981185475650937,0 -70.37783973689631,6.980728214175096,0 -70.37931245455516,6.980793487944392,0 -70.38055563767792,6.981223436078597,0 -70.38139715924085,6.981909543462939,0 -70.38290888756734,6.983701191737389,0 -70.38431095123265,6.985053962762778,0 -70.38566099399763,6.985683148294743,0 -70.38764959782345,6.985503527808498,0 -70.38914240473187,6.984898561593359,0 -70.39074710402205,6.984276808432799,0 -70.39391028675684,6.982874975103416,0 -70.39622268067998,6.98183442262196,0 -70.3972600493904,6.981473349458193,0 -70.39842571917066,6.982804295137123,0 -70.39979053371536,6.985026615476834,0 -70.4008864410572,6.98647340208465,0 -70.40213979985433,6.987681618315401,0 -70.40324428262399,6.988305213050192,0 -70.40420973214935,6.988306828217612,0 -70.40479816125061,6.987672331228368,0 -70.40541400430082,6.985397002057536,0 -70.40584710556067,6.984812277645123,0 -70.40641319957416,6.98456298566302,0 -70.40752360961642,6.984723290014147,0 -70.409310105682,6.98544631535855,0 -70.40995756769365,6.985270687506012,0 -70.41040424650645,6.984662000892006,0 -70.41017088276442,6.983493265909225,0 -70.41062934859153,6.98270465649521,0 -70.41178977894816,6.98200182868051,0 -70.41322809068436,6.98158540835317,0 -70.41440688495659,6.981050490614002,0 -70.41566322984967,6.980795823473709,0 -70.41667297312439,6.981171597903832,0 -70.41733315660301,6.982256479148216,0 -70.41811569456118,6.983243893097925,0 -70.4195420787096,6.984084365857657,0 -70.42182685202525,6.985696827531161,0 -70.42262133161051,6.986504445500111,0 -70.42278374683839,6.988418082595843,0 -70.4229773231804,6.990671867661812,0 -70.42377961122924,6.991481679444309,0 -70.42522262110603,6.992415555936802,0 -70.42695124422309,6.99336978112448,0 -70.4273912134034,6.994253385728025,0 -70.42720349017344,6.995277694089025,0 -70.4262099360339,6.997234315418553,0 -70.42608826200441,6.998000225353394,0 -70.42684665959798,6.999244775845709,0 -70.42829387770897,7.00066888990531,0 -70.42921580506922,7.001737266235125,0 -70.42968881972823,7.003119097632287,0 -70.42976365639366,7.004250832676603,0 -70.42923001337316,7.00652830604111,0 -70.42962049673757,7.00710347493303,0 -70.43089002301357,7.007624537290768,0 -70.4323027007034,7.007487582973467,0 -70.43319341473632,7.007089666377389,0 -70.43589692200393,7.006888299844145,0 -70.4368497996697,7.006506702550699,0 -70.43736568421745,7.006282399018261,0 -70.43774367482514,7.00710408282069,0 -70.43856873256063,7.008122276202035,0 -70.43945916683353,7.008265271268435,0 -70.44025300498934,7.007872179621549,0 -70.44073322743137,7.007405033249567,0 -70.44142461311922,7.0054537394396,0 -70.44225465862846,7.003835061339407,0 -70.44286873833387,7.003217937299759,0 -70.44356347702416,7.002944071325469,0 -70.44597112943931,7.002429983792609,0 -70.44802577757775,7.003074349539877,0 -70.45003501284471,7.003773316092443,0 -70.45127773394236,7.003857048365128,0 -70.45203324658878,7.003792483356235,0 -70.45408264965698,7.003740763806432,0 -70.45533359687025,7.004243989763133,0 -70.45521513452515,7.004781826249266,0 -70.45310214392066,7.00591291338038,0 -70.45113661399657,7.006595221236001,0 -70.4502595478877,7.006750209496688,0 -70.4499918353505,7.00740270410284,0 -70.45051373286422,7.009086943971829,0 -70.45124437941983,7.01029401428764,0 -70.45201840115583,7.010891449482227,0 -70.4528653619101,7.011575761270298,0 -70.45381531879842,7.012023957700773,0 -70.45497186033072,7.012023812595321,0 -70.45603969128712,7.011543532651568,0 -70.45691138998946,7.011067035458145,0 -70.45756227883641,7.009944336722628,0 -70.45821303898589,7.00824567537992,0 -70.45820627351303,7.00679441335618,0 -70.45852150540607,7.004602102400988,0 -70.4586787900278,7.003340092019812,0 -70.45911567093613,7.002756225427613,0 -70.45991900393578,7.002362772011317,0 -70.46059989400906,7.002317327450563,0 -70.46472211039824,7.003384250867342,0 -70.46534087423819,7.003363067583011,0 -70.46579112654544,7.00343768051322,0 -70.46631109922653,7.003077206025313,0 -70.4664165841902,7.00235446699306,0 -70.46595860478851,7.001348648819489,0 -70.46597678280894,7.000902309605247,0 -70.46646833577758,7.000489904938752,0 -70.46813373742444,7.000671077719389,0 -70.46995051201732,7.000986590137377,0 -70.4722023370532,7.001215329714228,0 -70.47342533407632,7.001132047059601,0 -70.475923223332,7.001701266325283,0 -70.4771578415901,7.003025266067469,0 -70.48001511663458,7.004284973710791,0 -70.48321890791377,7.006242847275757,0 -70.48557532093089,7.007596336223552,0 -70.48855154404097,7.008447159355538,0 -70.49066560674312,7.009357074267486,0 -70.49207779387878,7.009054927108944,0 -70.49263666688412,7.008412750525628,0 -70.49285973232084,7.007860729813761,0 -70.49200383430623,7.006131623899509,0 -70.49205575603973,7.005548674031571,0 -70.4929189601061,7.0054225621146,0 -70.49410376725142,7.005880376427768,0 -70.49503273492657,7.006574034501129,0 -70.49586122873302,7.006550376054393,0 -70.49712866154489,7.005969590390722,0 -70.4982353368128,7.00584532282692,0 -70.49950436355876,7.005881925750924,0 -70.50038342879324,7.005665662565047,0 -70.50187639548939,7.005420055299911,0 -70.50268810184218,7.005726129909677,0 -70.50298527917495,7.006440996190053,0 -70.50297740875197,7.007629937716639,0 -70.50367670907585,7.009605556251327,0 -70.50434124670467,7.010852116991331,0 -70.50537152087925,7.011959948277279,0 -70.50657833019476,7.012944585387181,0 -70.50772608754058,7.013585675969472,0 -70.50892273059416,7.014012145751969,0 -70.50895595449423,7.014926217680577,0 -70.5083220676229,7.016553379953725,0 -70.50830062975794,7.017594830797443,0 -70.50887553764127,7.018386855374105,0 -70.5100614679699,7.019202559344291,0 -70.51128109614552,7.019787578745885,0 -70.51281786983502,7.020095169409874,0 -70.51401592142224,7.020482165694973,0 -70.51455513575605,7.021210786717218,0 -70.51438823951601,7.022334181982823,0 -70.5134969424161,7.022969557152954,0 -70.51149873311816,7.023599849758511,0 -70.51062194040568,7.025234934076337,0 -70.51011142736982,7.026773464703093,0 -70.51049448518273,7.027671026856039,0 -70.51140534775168,7.027899849237237,0 -70.51325132826472,7.027810655822394,0 -70.513714427124,7.028144119434578,0 -70.51513325757388,7.030077919661022,0 -70.51576707382613,7.031173373405863,0 -70.51664973146629,7.031608917368719,0 -70.51889754448771,7.033110924531554,0 -70.51996160516573,7.033709139113302,0 -70.52129621587892,7.034929988720127,0 -70.52230136924959,7.035374024957191,0 -70.52356783341632,7.035190042435262,0 -70.52465031387236,7.035297498375246,0 -70.52556700174202,7.035923739271236,0 -70.52604555961308,7.03671958586583,0 -70.52671342709485,7.039710565819006,0 -70.52747894713085,7.041314664488688,0 -70.52856355412283,7.042094862088423,0 -70.52919935102341,7.041797934931438,0 -70.53006163745643,7.04053679010222,0 -70.53112591565868,7.040087765937028,0 -70.53252124751036,7.040008493562651,0 -70.53475324741568,7.039819329462049,0 -70.53631013931367,7.039749141929727,0 -70.53752427596322,7.03996304395436,0 -70.5384698350863,7.040197293795547,0 -70.53851961165593,7.040884307565617,0 -70.53760792692417,7.042707021400978,0 -70.53631263975768,7.043050250105694,0 -70.53409425644186,7.043526002527884,0 -70.53237892368351,7.044942775921942,0 -70.53169111457397,7.046630878998344,0 -70.53229591721157,7.047636858234611,0 -70.53414523974476,7.047570691834986,0 -70.53590270446499,7.046919363807083,0 -70.53717360617033,7.045789012570958,0 -70.53870372044639,7.04508598056519,0 -70.53966571647398,7.045373603373211,0 -70.54046414982315,7.046963832370484,0 -70.54116364681174,7.048708340038908,0 -70.54117870085889,7.049410126607171,0 -70.54103830263159,7.050436437771328,0 -70.54007185083699,7.051062867001542,0 -70.53938562756771,7.0508690024516,0 -70.53830627598438,7.050315698484773,0 -70.53727848455789,7.0503902641633,0 -70.53655308884682,7.052000190252714,0 -70.5348668603295,7.05360957462366,0 -70.53490482223357,7.054686024981899,0 -70.53621051071373,7.055559676512336,0 -70.53726583721172,7.056098916575045,0 -70.53754799879579,7.056719076950587,0 -70.53752520766869,7.058088505016154,0 -70.53757299438361,7.058834729710354,0 -70.53878445056105,7.059625741310947,0 -70.53908090713763,7.059882274594633,0 -70.53953143577304,7.060883938202104,0 -70.54097077203717,7.06106675386475,0 -70.54180918465779,7.061465670695995,0 -70.54200136332473,7.06204298863146,0 -70.54176124099602,7.063251916807414,0 -70.54202808573454,7.064761098544838,0 -70.54225991937629,7.066449070300523,0 -70.54313189362611,7.068195715595111,0 -70.54381578688967,7.069376420241894,0 -70.54460697895246,7.069864119257585,0 -70.54622693278836,7.070495577814031,0 -70.54713934750082,7.071075136017276,0 -70.5477655438855,7.07200639984384,0 -70.54923058439383,7.075123163639644,0 -70.55126436296152,7.075587801882343,0 -70.55321027899438,7.075130642355933,0 -70.55507431780816,7.076320061273083,0 -70.55497642209268,7.078944285629154,0 -70.55625106637046,7.079756480489573,0 -70.55785468151788,7.078664994271809,0 -70.55964306367365,7.07763839090165,0 -70.56251892704179,7.077421796457479,0 -70.56506429395073,7.080173639286905,0 -70.56647622549555,7.081321768147038,0 -70.56982191074015,7.081360586326464,0 -70.57179572443627,7.078883391228334,0 -70.57471906987666,7.075776539411755,0 -70.57806710870591,7.075518833500524,0 -70.58112703769474,7.076584157194109,0 -70.58407792125161,7.076343777993412,0 -70.58581058126296,7.074769361074527,0 -70.58553918495406,7.072705047376048,0 -70.58477377338508,7.069693446542333,0 -70.58705613751879,7.068387555957417,0 -70.59080215339766,7.068084526964715,0 -70.60368967452163,7.064714919676321,0 -70.60717951676287,7.063931023959138,0 -70.61020184289423,7.065600409234605,0 -70.61326372464686,7.067654066320492,0 -70.61760121331905,7.067356441666686,0 -70.62006271205445,7.067614968679015,0 -70.6242100623658,7.070163755768773,0 -70.62739117382941,7.069885713262791,0 -70.63060427345727,7.069167153435032,0 -70.63426285537732,7.070394793793503,0 -70.64110332454747,7.068886390706535,0 -70.64254418542878,7.069105340837389,0 -70.6434959684625,7.072616277699554,0 -70.64367155359594,7.077200992765727,0 -70.64537737633512,7.078747419656738,0 -70.65066683443614,7.080169865780658,0 -70.65730531507521,7.080253504789841,0 -70.6608705573943,7.082747621783092,0 -70.66351273186949,7.084009613594444,0 -70.67316148399202,7.085794132548284,0 -70.67612140245409,7.088194058699173,0 -70.6793356835955,7.0911214002368,0 -70.68122594600452,7.09357821906007,0 -70.67729520077161,7.097804208567347,0 -70.67476811329753,7.101514491509217,0 -70.67478654436341,7.105051116767803,0 -70.6775582795613,7.107372958386478,0 -70.68226874069315,7.10457867415515,0 -70.68445453691804,7.100941922736999,0 -70.68701240819672,7.09679114874034,0 -70.69250865874383,7.093390400779359,0 -70.69909441949676,7.092437493340826,0 -70.70430976891436,7.09327586504665,0 -70.71006389459463,7.094358220550983,0 -70.7167402312808,7.093617001097575,0 -70.72388573653141,7.092284742785096,0 -70.73139697593194,7.089158443495515,0 -70.74145307484099,7.088680575639882,0 -70.74652833033841,7.091312539675451,0 -70.75039684151169,7.091759788722624,0 -70.75731654087456,7.096925988262641,0 -70.76096317383936,7.098006217082333,0 -70.76284108771573,7.096402920753336,0 -70.76511426600814,7.094083881426071,0 -70.76459273067491,7.091604559553883,0 -70.76845559804966,7.088994389562909,0 -70.77033368891151,7.088934655098798,0 -70.77230911096616,7.08292483476488,0 -70.7753601837109,7.078055249875241,0 -70.77826004799665,7.076440514863768,0 -70.78292910324834,7.080443233685144,0 -70.78493480999622,7.081967021600145,0 -70.789186648984,7.084126704345047,0 -70.79595054922918,7.084399952321605,0 -70.80690936180957,7.079457066007464,0 -70.81546054232044,7.079169292632833,0 -70.81782358187233,7.079077289469265,0 -70.81982244667918,7.071813201387096,0 -70.82349087994474,7.071689051214275,0 -70.82933640938761,7.073784462283318,0 -70.8331138418358,7.07677681040185,0 -70.83732265569785,7.07922690505313,0 -70.84067379608392,7.078069721590713,0 -70.84399647741205,7.074025767910346,0 -70.84784758772189,7.07442083644188,0 -70.85114659496674,7.07899466587982,0 -70.85412439424901,7.079800541727717,0 -70.85634726297305,7.077799820060985,0 -70.85596739268715,7.075689116684376,0 -70.85011620431629,7.070250631975639,0 -70.85077894381045,7.064637407336265,0 -70.84867154839932,7.058892840101774,0 -70.85451020632881,7.056227315124842,0 -70.86386774963871,7.056440454099702,0 -70.86695090495407,7.059206340216806,0 -70.87040498192327,7.05913241172561,0 -70.87377903884472,7.063792129955742,0 -70.87988050336324,7.06397219769855,0 -70.88485417634615,7.065222581624178,0 -70.89068611602701,7.062821291392195,0 -70.89623993161844,7.058616391325726,0 -70.90020924774699,7.049951865872057,0 -70.90016024007508,7.042408395120384,0 -70.90206735064491,7.038969120213195,0 -70.90514384085344,7.037621327363365,0 -70.90936774582102,7.039033440610148,0 -70.9121889944476,7.042985344794672,0 -70.91485695916772,7.051883893443153,0 -70.91602948141755,7.053528203051807,0 -70.92049218548823,7.051805349625051,0 -70.92886927324398,7.045032636602531,0 -70.92991859154759,7.041880021435806,0 -70.92831418813547,7.036692367491068,0 -70.9230101626936,7.032326005250152,0 -70.92188868969403,7.030116831189297,0 -70.92624937591285,7.02565265592528,0 -70.93146994538498,7.021971950528711,0 -70.93815429626217,7.015558596595363,0 -70.94661032845234,7.011585300789303,0 -70.95367342701563,7.014683880676826,0 -70.95747238853863,7.019412898664553,0 -70.96199763723203,7.022844096283039,0 -70.9670617411262,7.022611842317398,0 -70.97057344733359,7.019595234097212,0 -70.97232331780464,7.01305950525837,0 -70.97267554278689,7.006854466928506,0 -70.97421085923176,7.002570810276827,0 -70.97977499724099,7.002080337037076,0 -70.98465206082298,7.000482763143851,0 -70.98639523216077,6.994661741370768,0 -70.99020679505007,6.991691743885129,0 -70.99300891042309,6.985541244747115,0 -70.99512815554715,6.983221553433788,0 -71.00215739921231,6.981265820264893,0 -71.00824274363313,6.978420933653628,0 -71.01548754380759,6.977417063456408,0 -71.02068030683502,6.974026619566223,0 -71.02624669340508,6.975127539977142,0 -71.03215088781351,6.977854832147834,0 -71.03796823671391,6.981295469733574,0 -71.04404538891465,6.982026350429247,0 -71.04974907350604,6.981261704517064,0 -71.05559258900804,6.980765733392611,0 -71.06005892552631,6.982836792679904,0 -71.06468936067027,6.980978035520489,0 -71.06812453465872,6.982322200912994,0 -71.07264945159031,6.981270290510984,0 -71.07730916703154,6.980637748023383,0 -71.08334294299034,6.984374898279182,0 -71.08822766366616,6.983562598136404,0 -71.09190669750984,6.983735140543196,0 -71.09840328823637,6.987797580522907,0 -71.10647479076863,6.989679300081647,0 -71.11092390931118,6.989537339178513,0 -71.11496180615578,6.993631419612429,0 -71.12246358342365,6.992041877921118,0 -71.12470458924032,6.987044314051986,0 -71.1286084168901,6.985272947946007,0 -71.13533111813803,6.985408196122725,0 -71.13647904644424,6.981013649209248,0 -71.13683278883884,6.977650887827453,0 -71.14190560264775,6.974332720184929,0 -71.14555665538767,6.971200342301346,0 -71.15001262855209,6.970378421410281,0 -71.15408593439001,6.967348558785805,0 -71.15930613217874,6.965809454917191,0 -71.16237412848122,6.963615613894999,0 -71.1678916708852,6.962564060114536,0 -71.17177961320982,6.958833780003625,0 -71.17588944801355,6.954032710358624,0 -71.18368658545091,6.949328963430558,0 -71.18677161186895,6.948101094928176,0 -71.18897325469949,6.950219036618042,0 -71.18886213886762,6.953002286270519,0 -71.1871553542726,6.954143485236059,0 -71.1888857013313,6.957187759477914,0 -71.19408474216004,6.955463831019953,0 -71.19654884081753,6.957158602557009,0 -71.19501237711846,6.96453912712812,0 -71.19649717156425,6.968714067536213,0 -71.2021105736391,6.970657987233518,0 -71.20592890411388,6.974090460295638,0 -71.21480389070121,6.978581382815567,0 -71.22039460642313,6.979211421401953,0 -71.22519772225937,6.98041087155937,0 -71.22850908350561,6.979127074330486,0 -71.23117332394504,6.978403032772821,0 -71.23583127801334,6.981197179283563,0 -71.23046515863275,6.992786597583022,0 -71.23038326349973,6.998059132683085,0 -71.23931359680022,7.009657706421147,0 -71.24576834813718,7.015885761175302,0 -71.25012097574523,7.017797149071835,0 -71.2568727572865,7.017875510871114,0 -71.26075786704058,7.022547864774575,0 -71.25972283337066,7.028997477864181,0 -71.26175838096077,7.032612411749479,0 -71.26692537862633,7.033135090283124,0 -71.27219273405764,7.028988977044986,0 -71.27420489463515,7.025843212846335,0 -71.28037209513228,7.02467806460096,0 -71.29041184006161,7.026809458186518,0 -71.29723599602936,7.025498736026199,0 -71.3032921550101,7.026083551444978,0 -71.31068564313414,7.025761381666291,0 -71.31608989476528,7.024704381225286,0 -71.31955748382914,7.021960879707403,0 -71.32290404418627,7.018588970995133,0 -71.32670842277561,7.017497410222999,0 -71.33568576734153,7.016285230092775,0 -71.34673395566314,7.019586778921626,0 -71.35398202846447,7.019945284278244,0 -71.3618780912159,7.017537476562362,0 -71.37082648889518,7.015036414350037,0 -71.37982399497099,7.018054916552372,0 -71.38458662000609,7.028080259890586,0 -71.38961711166668,7.034185994705416,0 -71.39804423309378,7.037515167232418,0 -71.40762362558996,7.035483770237379,0 -71.41276794131778,7.035023811516939,0 -71.4196360156715,7.037597458380187,0 -71.42765216692484,7.037507030494787,0 -71.43371200960077,7.029514485403841,0 -71.43671087003229,7.025336546966328,0 -71.44714834002455,7.019083507421302,0 -71.46280222326712,7.012658854336555,0 -71.47044647444388,7.010513146965677,0 -71.47978327073047,7.011375079038531,0 -71.486999405563,7.019063577183728,0 -71.49907878575432,7.021036878153832,0 -71.50540103403863,7.024618032126987,0 -71.51595595241798,7.026371311734908,0 -71.52743323330749,7.025578925616338,0 -71.53932192194895,7.029537312014068,0 -71.5476119505619,7.035707290608373,0 -71.55941088109859,7.036985470782207,0 -71.56479704896546,7.033294232834863,0 -71.57035173618841,7.020825832034364,0 -71.57444630797052,7.014495342377193,0 -71.58016159626466,7.011857307377274,0 -71.58372580718448,7.017873164959447,0 -71.58161119120307,7.026550701993155,0 -71.58201818098013,7.031289784085039,0 -71.59472177744321,7.034282071206089,0 -71.60572351429417,7.036456283944398,0 -71.60929262897298,7.043859478842754,0 -71.61689703687745,7.049026019458078,0 -71.62142705976628,7.054461436938475,0 -71.62971676306512,7.057711037929091,0 -71.64342120909325,7.055385851178425,0 -71.64459190313237,7.050267333915544,0 -71.64784140658129,7.042928394177733,0 -71.65603943839547,7.035660616022204,0 -71.66293092273185,7.036839599913805,0 -71.66972462925811,7.039085387084796,0 -71.68556818095334,7.033086415909318,0 -71.69428752489561,7.032520646271542,0 -71.70521934293821,7.034852117886671,0 -71.71430259072484,7.040123154375848,0 -71.71641870136182,7.048840545984564,0 -71.72143734730615,7.050063263174913,0 -71.72677424160103,7.055090619887747,0 -71.73359812924491,7.057359857878724,0 -71.7400662030348,7.064683103803102,0 -71.74719524482616,7.068583817718959,0 -71.75477048253373,7.070884221878796,0 -71.76254807372487,7.069160070665936,0 -71.76449586773737,7.065019712019452,0 -71.77070009745624,7.061205851966347,0 -71.77495382792964,7.05998730760219,0 -71.78618688737292,7.064466867911761,0 -71.79569990918706,7.065919342088791,0 -71.80226046833261,7.060623358345095,0 -71.80913579936089,7.056327761682215,0 -71.81434029031544,7.057174124387681,0 -71.8178626590083,7.056657594328019,0 ]
  // Registra o pega aquí los demás pares de coordenadas [lat, lng] del KML
];

// Dibujar el vector en el mapa con estilo táctico
const capaRuta = L.polyline(tramoKmlCoordenadas, {
  color: '#d32f2f', // Rojo táctico
  weight: 4,
  opacity: 0.85
}).addTo(map);

// Ajustar la vista del mapa para que encuadre automáticamente todo el tramo
map.fitBounds(capaRuta.getBounds());


// ==========================================
// 3. CÁLCULO DE DISTANCIA DE LA RUTA (Nativa)
// ==========================================
/**
 * Suma la distancia entre los pares de puntos de la Polyline
 * @param {Array} puntos - Matriz de coordenadas [[lat, lng], ...]
 * @returns {number} Distancia total en Millas Náuticas (NM)
 */
function obtenerDistanciaRutaNM(puntos) {
  let distanciaMetros = 0;

  for (let i = 0; i < puntos.length - 1; i++) {
    const p1 = L.latLng(puntos[i][0], puntos[i][1]);
    const p2 = L.latLng(puntos[i + 1][0], puntos[i + 1][1]);
    distanciaMetros += p1.distanceTo(p2);
  }

  // 1 Milla Náutica = 1852 metros
  return distanciaMetros / 1852;
}


// ==========================================
// 4. FUNCIÓN INTEGRADA DE CÁLCULO DE COMBUSTIBLE
// ==========================================
function ejecutarCalculoTáctico() {
  // A. Obtener parámetros seleccionados en la interfaz
  const rpm = parseInt(document.getElementById('selectRPM').value);
  const sentido = document.getElementById('selectCorriente').value; // 'favor', 'contra', 'neutro'
  const numMotores = parseInt(document.getElementById('numMotores').value) || 2;

  // B. Calcular la distancia directamente de la Polyline trazada
  const distanciaNM = obtenerDistanciaRutaNM(tramoKmlCoordenadas);

  // C. Tablas de consumo y factores tácticos
  const consumoGPH = { 2000: 4.5, 3000: 8.0, 4000: 14.2, 5000: 22.0 };
  const factorCorriente = { 'favor': 1.25, 'contra': 0.75, 'neutro': 1.0 };
  const velBaseKts = 20;

  // D. Cálculos operacionales
  const velEfectiva = velBaseKts * (factorCorriente[sentido] || 1.0);
  const tiempoHoras = distanciaNM / velEfectiva;
  const consumoHoraTotal = (consumoGPH[rpm] || 12.0) * numMotores;

  const galonesBase = tiempoHoras * consumoHoraTotal;
  const galonesReserva = galonesBase * 0.20; // 20% Reserva Táctica
  const galonesTotales = Math.ceil(galonesBase + galonesReserva);

  // E. Actualizar elementos del HTML/UI
  document.getElementById('resDistancia').innerText = `${distanciaNM.toFixed(2)} NM`;
  document.getElementById('resTiempo').innerText = `${Math.round(tiempoHoras * 60)} min`;
  document.getElementById('resCombustible').innerText = `${galonesTotales} Gal (Incl. 20% Reserva)`;
}

// Escuchar el evento del botón "Calcular"
document.getElementById('btnCalcular').addEventListener('click', ejecutarCalculoTáctico);
    </script>
</body>
</html>
