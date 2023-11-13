// fabric.loadSVGFromString(svgString, (objects, options) => {
//   const loadedObject = fabric.util.groupSVGElements(objects, options);
//   this.canvas!.add(loadedObject);
//   this.canvas!.renderAll();
//   console.log(loadedObject)



export const svgString = `<svg id="svg" style="height:100%; width:100%" version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 500,250">
   <linearGradient id="s" x2="0" y2="100%">
     <stop offset="0" stop-color="#bbb" stop-opacity=".1"></stop>
     <stop offset="1" stop-opacity=".1"></stop>
   </linearGradient>
   <!-- Para redondear las esquinas -->
   <clipPath id="r">
     <rect width="50" height="7" rx="3" fill="#fff"></rect>
   </clipPath>
   <defs>
     <g id="caja20-30">
       <rect width="20" height="7" fill="#555"></rect>
       <rect x="19" width="31" height="7"></rect>
       <rect width="50" height="7" fill="url(#s)"></rect>
     </g>
     <g id="caja-pallets">
       <rect width="50" height="10" fill=white stroke=grey></rect>
       <rect width="30" height="10" fill="#555" stroke=grey></rect>
       <rect x="30" width="20" height="4" fill="#555" stroke=grey></rect>
       <text x="40" y="2" fill=white dominant-baseline="middle" text-anchor="middle" font-size="3">1ª</text>
       <text x="7" y="-3" font-size="3" fill="#555">Clasificación</text>
     </g>
   </defs>
   <g id="svgg">
     <!----> PRENSAS
     <!------>
     <rect x="60" y="195" width="50" height="20" fill="transparent" stroke="grey"></rect>
     <text x="70" y="208" font-size="5" style="writing-mode: horizontal-tb;">SECADERO 1</text>
     <rect x="90" y="125" width="50" height="20" fill="transparent" stroke="grey"></rect>
     <text x="100" y="135" font-size="5" style="writing-mode: horizontal-tb;">SECADERO 2</text>
     <rect class="sin_curro" x="30" y="120" width="30" height="10" id="PRODUCTION.140"></rect>
     <path class="sin_curro" d="M60 125 h10 " name="PRODUCTION.140"></path>
     <text class="negrita" x="40" y="125" font-size="5" id="PRODUCTION.140.CAPTION">PR2</text>
     <text x="30" y="133" font-size="3" id="PRODUCTION.140.formato">formato</text>
     <text x="30" y="137" font-size="3" id="PRODUCTION.140.velocityInstantWithDescription">--h --m --s</text>
     <rect class="sin_curro" x="30" y="140" width="30" height="10" id="PRODUCTION.14"></rect>
     <path class="sin_curro" d="M60 145 h11 v-18" name="PRODUCTION.14"></path>
     <text class="negrita" x="40" y="145" font-size="5" id="PRODUCTION.14.CAPTION">PR1</text>
     <text x="30" y="153" font-size="3" id="PRODUCTION.14.formato">formato</text>
     <text x="30" y="157" font-size="3" id="PRODUCTION.14.velocityInstantWithDescription">-- golpes/min</text>
     <path class="sin_curro" d="M70 125 v-8 h80 v18 h-10" name="PRODUCTION.140"></path>
     <path class="sin_curro" d="M71 127 v-9 h78 v16 h-9" name="PRODUCTION.14"></path>
     <rect class="sin_curro" x="10" y="190" width="30" height="10" id="PRODUCTION.13"></rect>
     <path class="sin_curro" d="M40 196 h8 v10" name="PRODUCTION.13"></path>
     <text class="negrita" x="20" y="195" font-size="5" id="PRODUCTION.13.CAPTION">PR3</text>
     <text x="10" y="203" font-size="3" id="PRODUCTION.13.formato">formato</text>
     <text x="10" y="207" font-size="3" id="PRODUCTION.13.velocityInstantWithDescription">-- golpes/min</text>
     <rect class="sin_curro" x="10" y="210" width="30" height="10" id="PRODUCTION.139"></rect>
     <path class="sin_curro" d="M40 215 h8 v-9 " name="PRODUCTION.139"></path>
     <text class="negrita" x="20" y="215" font-size="5" id="PRODUCTION.139.CAPTION">PR4</text>
     <text x="10" y="223" font-size="3" id="PRODUCTION.139.formato">formato</text>
     <text x="10" y="227" font-size="3" id="PRODUCTION.139.velocityInstantWithDescription">-- golpes/min</text>
     <path class="sin_curro" d="M48 205 h12 " name="PRODUCTION.13"></path>
     <path class="sin_curro" d="M48 206 h12 " name="PRODUCTION.139"></path>
     <path class="sin_curro" d="M110 205 h10 v-9" name="SENSOR.8"></path>
     <path class="sin_curro" d="M110 206 h11 v-10" name="SENSOR.10"></path>
     <!----> ESMALTADORAS
     <!------>
     <rect class="sin_curro" x="140" y="160" width="150" height="15" id="PRODUCTION.49"></rect>
     <path class="sin_curro" d="M290 165 h5 v-30 h-25 " name="SENSOR.27"></path>
     <path class="sin_curro" d="M90 135 h-15 v30" name="SENSOR.21"></path>
     <path class="sin_curro" d="M90 136 h-14 v29" name="SENSOR.23"></path>
     <path class="sin_curro" d="M75 165 h65" name="PRODUCTION.49"></path>
     <text class="negrita" x="150" y="165" font-size="5" id="PRODUCTION.49.CAPTION">ESM2</text>
     <text class="negrita" x="170" y="165" font-size="5" id="PRODUCTION.49.descriptionOp">NOMBRE PROD.</text>
     <text class="negrita" x="170" y="169" font-size="3" id="PRODUCTION.49.Formato_producción">formato</text>
     <text x="140" y="180" font-size="3" id="PRODUCTION.49.velocityInstantWithDescription">formato</text>
     <text class="negrita" x="220" y="169" font-size="3">V.Actual: </text>
     <text x="235" y="169" font-size="3" id="PRODUCTION.49.velocityM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="220" y="173" font-size="3">V.Media:</text>
     <text x="235" y="173" font-size="3" id="PRODUCTION.49.mediaM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="260" y="169" font-size="3">Prod. dia:</text>
     <text x="275" y="169" font-size="3" id="PRODUCTION.49.produccionDiaM2">-- M2</text>
     <text class="negrita" x="260" y="173" font-size="3">Previsión:</text>
     <text x="275" y="173" font-size="3" id="PRODUCTION.49.previsionM2">-- M2</text>
     <rect x="117" y="193" width="8" height="3" fill="transparent" stroke="grey"></rect>
     <rect class="sin_curro" x="140" y="190" width="150" height="15" id="PRODUCTION.17"></rect>
     <path class="sin_curro" d="M125 195 h15" name="PRODUCTION.17"></path>
     <path class="sin_curro" d="M290 195 h15 v-85 h-35" name="SENSOR.26"></path>
     <text class="negrita" x="150" y="195" font-size="5" id="PRODUCTION.17.CAPTION">ESM1</text>
     <text class="negrita" x="170" y="195" font-size="5" id="PRODUCTION.17.descriptionOp">NOMBRE PROD.</text>
     <text class="negrita" x="170" y="199" font-size="3" id="PRODUCTION.17.Formato_producción">formato</text>
     <text x="140" y="210" font-size="3" id="PRODUCTION.17.velocityInstantWithDescription">formato</text>
     <text class="negrita" x="220" y="199" font-size="3">V.Actual: </text>
     <text x="235" y="199" font-size="3" id="PRODUCTION.17.velocityM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="220" y="203" font-size="3">V.Media:</text>
     <text x="235" y="203" font-size="3" id="PRODUCTION.17.mediaM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="260" y="199" font-size="3">Prod. dia:</text>
     <text x="275" y="199" font-size="3" id="PRODUCTION.17.produccionDiaM2">-- M2</text>
     <text class="negrita" x="260" y="203" font-size="3">Previsión:</text>
     <text x="275" y="203" font-size="3" id="PRODUCTION.17.previsionM2">-- M2</text>
     <!----> MESA DE ENTRADA
     <!------>
     <rect class="sin_curro" x="5" y="13" width="52" height="25" id="PRODUCTION.171"></rect>
     <text class="negrita" x="8" y="23" font-size="5" id="PRODUCTION.171.descriptionOp">NOMBRE PROD.</text>
     <text class="negrita" x="8" y="30" font-size="5" id="PRODUCTION.171.Formato_producción">formato</text>
     <text class="negrita" x="6" y="44" font-size="3">Pz. ent: </text>
     <text x="21" y="44" font-size="3" id="PRODUCTION.171.inputPiecesFormatted">-- piezas</text>
     <rect class="sin_curro" x="21" y="53" width="52" height="25" id="PRODUCTION.172"></rect>
     <text class="negrita" x="23" y="62" font-size="5" id="PRODUCTION.172.descriptionOp">NOMBRE PROD.</text>
     <text class="negrita" x="23" y="70" font-size="5" id="PRODUCTION.172.Formato_producción">formato</text>
     <text class="negrita" x="20" y="82" font-size="3">Pz. ent: </text>
     <text x="33" y="82" font-size="3" id="PRODUCTION.172.inputPiecesFormatted">-- piezas</text>
     <!----> HORNOS
     <!------>
     <rect class="sin_curro" x="67" y="10" width="210" height="30" id="PRODUCTION.4"></rect>
     <text class="negrita" x="77" y="20" font-size="5" id="PRODUCTION.4.CAPTION">HORNO 2</text>
     <text class="negrita" x="107" y="20" font-size="5" id="PRODUCTION.4.descriptionOp">NOMBRE PROD. </text>
     <text class="negrita" x="107" y="26" font-size="5" id="PRODUCTION.4.Formato_producción">formato</text>
     <text x="67" y="45" font-size="3" id="PRODUCTION.4.velocityInstantWithDescription">formato</text>
     <!-- text x="91" y="9" font-size="4" id='PRODUCTION.4.velocityWithDescription' ></text -->
     <text class="negrita" x="200" y="30" font-size="3">V.Actual: </text>
     <text x="215" y="30" font-size="3" id="PRODUCTION.4.velocityM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="200" y="35" font-size="3">V.Media:</text>
     <text x="215" y="35" font-size="3" id="PRODUCTION.4.mediaM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="240" y="30" font-size="3">Prod. dia:</text>
     <text x="255" y="30" font-size="3" id="PRODUCTION.4.produccionDiaM2">-- M2</text>
     <text class="negrita" x="240" y="35" font-size="3">Previsión:</text>
     <text x="255" y="35" font-size="3" id="PRODUCTION.4.previsionM2">-- M2</text>
     <path class="sin_curro" d="M180 135 h-15 v-25 h-165 v-85 h5" name="PRODUCTION.171"></path>
     <path class="sin_curro" d="M57 25 h10" name="PRODUCTION.4"></path>
     <path class="sin_curro" d="M278 25 h55" name="PRODUCTION.4"></path>
     <path class="sin_curro" d="M325 25 h25 v20" name="PRODUCTION.8"></path>
     <path class="sin_curro" d="M325 25 v20" name="PRODUCTION.7"></path>
     <rect class="sin_curro" x="85" y="50" width="210" height="30" id="PRODUCTION.3"></rect>
     <text class="negrita" x="95" y="60" font-size="5" id="PRODUCTION.3.CAPTION">HORNO 1</text>
     <text class="negrita" x="125" y="60" font-size="5" id="PRODUCTION.3.descriptionOp">NOMBRE PROD.</text>
     <text class="negrita" x="125" y="66" font-size="5" id="PRODUCTION.3.Formato_producción">formato</text>
     <text x="85" y="85" font-size="3" id="PRODUCTION.3.velocityInstantWithDescription">formato</text>
     <!--text x="71" y="49" font-size="4"  id='PRODUCTION.3.velocityWithDescription' ></text > -->
     <text class="negrita" x="210" y="70" font-size="3">V.Actual: </text>
     <text x="225" y="70" font-size="3" id="PRODUCTION.3.velocityM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="210" y="75" font-size="3">V.Media:</text>
     <text x="225" y="75" font-size="3" id="PRODUCTION.3.mediaM224hWithDescription">-- M2/dia</text>
     <text class="negrita" x="250" y="70" font-size="3">Prod. dia:</text>
     <text x="265" y="70" font-size="3" id="PRODUCTION.3.produccionDiaM2">-- M2</text>
     <text class="negrita" x="250" y="75" font-size="3">Previsión:</text>
     <text x="265" y="75" font-size="3" id="PRODUCTION.3.previsionM2">-- M2</text>
     <path class="sin_curro" d="M180 110 h-10 v-15 h-160 v-30 h10" name="PRODUCTION.172"></path>
     <path class="sin_curro" d="M74 64 h10" name="PRODUCTION.3"></path>
     <path class="sin_curro" d="M295 65 h20" name="PRODUCTION.3"></path>
     <path class="sin_curro" d="M315 65 v30" name="PRODUCTION.6"></path>
     <!----> PARQUE DE BOXES
     <!------>
     <rect x="180" y="100" width="90" height="20" fill="transparent" stroke="grey"></rect>
     <text x="205" y="105" font-size="5" style="writing-mode: horizontal-tb;">PARQUE BOXES 1</text>
     <text x="205" y="114" font-size="5" style="writing-mode: horizontal-tb;" name="TRAMO.1">TRAMO1</text>
     <rect x="180" y="125" width="90" height="20" fill="transparent" stroke="grey"></rect>
     <text x="205" y="130" font-size="5" style="writing-mode: horizontal-tb;">PARQUE BOXES 2</text>
     <text x="205" y="139" font-size="5" style="writing-mode: horizontal-tb;" name="TRAMO.2">TRAMO2</text>
     <!----> CLASIFICACION
     <!------>
     <rect class="sin_curro" x="345" y="40" width="10" height="40" id="PRODUCTION.8"></rect>
     <text class="negrita" x="350" y="50" font-size="5" style="writing-mode: tb; id=" PRODUCTION.8.CAPTION">CL3</text>
     <path class="sin_curro" d="M350 80 v10 h-20 v15 h10" name="PRODUCTION.8"></path>
     <rect class="sin_curro" x="320" y="40" width="10" height="40" id="PRODUCTION.7"></rect>
     <text class="negrita" x="325" y="50" font-size="5" style="writing-mode: tb; id=" PRODUCTION.7.CAPTION">CL2</text>
     <path class="sin_curro" d="M325 80 v40 h10" name="PRODUCTION.7"></path>
     <rect class="sin_curro" x="310" y="90" width="10" height="40" id="PRODUCTION.6"></rect>
     <text class="negrita" x="315" y="105" font-size="5" style="writing-mode: tb; id=" PRODUCTION.6.CAPTION">CL1</text>
     <path class="sin_curro" d="M315 130 v10 h20" name="PRODUCTION.6"></path>
     <text x="390" y="10" font-size="6" id="DescriptionOp" style="font-weight: bold; width:100%">NOMBRE PROD.</text>
     <text x="390" y="20" font-size="5" style="font-weight: bold;">Núm:</text>
     <text x="440" y="20" font-size="5" id="NumProdOrder">--</text>
     <text x="390" y="30" font-size="5" style="font-weight: bold;">F. inicio</text>
     <text x="440" y="30" font-size="5" id="openDate">-------- --:--:--</text>
     <text x="390" y="40" font-size="5" style="font-weight: bold;">Código:</text>
     <text x="440" y="40" font-size="5" id="Item_No">--</text>
     <text x="390" y="50" font-size="5" style="font-weight: bold;">Formato:</text>
     <text x="440" y="50" font-size="5" id="Formato_producción">formato</text>
     <text x="390" y="60" font-size="5" style="font-weight: bold;">A fabricar:</text>
     <text x="440" y="60" font-size="5" id="aFabricarM2">-- M2</text>
     <text x="390" y="70" font-size="5" style="font-weight: bold;">Producidas:</text>
     <text x="440" y="70" font-size="5" id="InputPiecesM2">-- M2</text>
     <text x="390" y="80" font-size="5" style="font-weight: bold;">Fec. Fin estimada:</text>
     <text x="440" y="80" font-size="5" id="fechaEstimada">-------- --:--:--</text>
     <text x="390" y="95" font-size="5" style="font-weight: bold;">Vel. Actual:</text>
     <text x="440" y="95" font-size="5" id="velocityWithDescription">-- pz/min</text>
     <text x="390" y="105" font-size="5" style="font-weight: bold;">Vel. Actual:</text>
     <text x="440" y="105" font-size="5" id="velocityM224hWithDescription">-- M2/dia</text>
     <text x="390" y="115" font-size="5" style="font-weight: bold;">Vel. Media:</text>
     <text x="440" y="115" font-size="5" id="mediaM224hWithDescription">-- M2/dia</text>
     <text x="390" y="130" font-size="5" style="font-weight: bold;">Produción dia:</text>
     <text x="440" y="130" font-size="5" id="produccionDiaM2">-- M2</text>
     <text x="390" y="140" font-size="5" style="font-weight: bold;">Previsión:</text>
     <text x="440" y="140" font-size="5" id="previsionM2">-- M2</text>
     <text x="390" y="155" font-size="5" style="font-weight: bold;">T. paro actual:</text>
     <text x="440" y="155" font-size="5" id="StopTimeIn" class="black" style="fill: black;">-- s</text>
     <text x="390" y="165" font-size="5" style="font-weight: bold;">T. paro acum.:</text>
     <text x="440" y="165" font-size="5" id="StopTimeInAcumulado">--m --s</text>
     <g text-rendering="geometricPrecision" id="svgForProduction" transform="translate(370,165) scale(1.6)"></g>
     <rect x="365" y="0" width="155" height="190" stroke="black" fill="white" stroke-width="0" vectorEffect="non-scaling-stroke" id='rectForShowData' />
   </g>
   <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="510" y="0" viewBox="0 0 26 26" style="enable-background:new 0 0 26 26;" xml:space="preserve" width="10" height="10" fill="white">
     <g>
       <path id="crossButton" style="fill:white" d="M21.125,0H4.875C2.182,0,0,2.182,0,4.875v16.25C0,23.818,2.182,26,4.875,26h16.25
     C23.818,26,26,23.818,26,21.125V4.875C26,2.182,23.818,0,21.125,0z M18.78,17.394l-1.388,1.387c-0.254,0.255-0.67,0.255-0.924,0
     L13,15.313L9.533,18.78c-0.255,0.255-0.67,0.255-0.925-0.002L7.22,17.394c-0.253-0.256-0.253-0.669,0-0.926l3.468-3.467
     L7.221,9.534c-0.254-0.256-0.254-0.672,0-0.925l1.388-1.388c0.255-0.257,0.671-0.257,0.925,0L13,10.689l3.468-3.468
     c0.255-0.257,0.671-0.257,0.924,0l1.388,1.386c0.254,0.255,0.254,0.671,0.001,0.927l-3.468,3.467l3.468,3.467
     C19.033,16.725,19.033,17.138,18.78,17.394z" />
     </g>
   </svg>
   <g dominant-baseline="middle" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(336,135)">
     <use xlink:href="#caja-pallets"></use>
     <text x="15" y="5" fill=white name="PRODUCTION.6.Prod_Order_No">Nº de OP</text>
     <text x="40" y="7" font-size="3" fill="#555" name="PRODUCTION.6.calidad-1">-</text>
   </g>
   <g dominant-baseline="middle" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(336,97)">
     <use xlink:href="#caja-pallets"></use>
     <text x="15" y="5" fill=white name="PRODUCTION.8.Prod_Order_No">Nº de OP</text>
     <text x="40" y="7" font-size="3" fill="#555" name="PRODUCTION.8.calidad-1">-</text>
   </g>
   <g dominant-baseline="middle" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(336,115)">
     <use xlink:href="#caja-pallets"></use>
     <text x="15" y="5" fill=white name="PRODUCTION.7.Prod_Order_No">Nº de OP</text>
     <text x="40" y="7" font-size="3" fill="#555" name="PRODUCTION.7.calidad-1">-</text>
   </g>
   <!-- rect x="370" y="0" width="150" height="180" stroke="black" fill="white" stroke-width="0" vectoreffect="non-scaling-stroke" id="rectForShowData" style="fill: white;"></rect -->
   <!----> VELOCIDADES
   <!------>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(190,153)">
     <use xlink:href="#caja20-30" name="PRODUCTION.49" class="en_marcha"></use>
     <text x="10" y="5" name="PRODUCTION.49.velocityM224hWithDescription.label">v.actual</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.49.velocityM224hWithDescription">-- M2/dia</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(140,163)"></g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(190,183)">
     <use xlink:href="#caja20-30" name="PRODUCTION.17" class="en_marcha"></use>
     <text x="10" y="5" name="PRODUCTION.17.velocityM224hWithDescription.label">v.actual</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.17.velocityM224hWithDescription">-- M2/dia</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(140,203)"></g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(170,3)">
     <use xlink:href="#caja20-30" name="PRODUCTION.4" class="en_marcha"></use>
     <text x="10" y="5" name="PRODUCTION.4.velocityM224hWithDescription.label">v.actual</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.4.velocityM224hWithDescription">-- M2/dia</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(190,43)">
     <use xlink:href="#caja20-30" name="PRODUCTION.3" class="en_marcha"></use>
     <text x="10" y="5" name="PRODUCTION.3.velocityM224hWithDescription.label">v.actual</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.3.velocityM224hWithDescription">-- M2/dia</text>
   </g>
   <!----> CONTADOR DE PIEZAS ENTRADA
   <!------>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(140,183)">
     <use xlink:href="#caja20-30" name="PRODUCTION.17" class="en_marcha"></use>
     <text x="10" y="5">pz.ent</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.17.inputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(140,153)">
     <use xlink:href="#caja20-30" name="PRODUCTION.49" class="en_marcha"></use>
     <text x="10" y="5">pz.ent</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.49.inputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(67,3)">
     <use xlink:href="#caja20-30" name="PRODUCTION.4" class="en_marcha"></use>
     <text x="10" y="5">pz.ent</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.4.inputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(85,43)">
     <use xlink:href="#caja20-30" name="PRODUCTION.3" class="en_marcha"></use>
     <text x="10" y="5">pz.ent</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.3.inputPiecesFormatted">-- piezas</text>
   </g>
   <!----> CONTADOR DE PIEZAS SALIDA
   <!------>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(240,183)">
     <use xlink:href="#caja20-30" name="PRODUCTION.17" class="en_marcha"></use>
     <text x="10" y="5">pz.sal</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.17.outputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(240,153)">
     <use xlink:href="#caja20-30" name="PRODUCTION.49" class="en_marcha"></use>
     <text x="10" y="5">pz.sal</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.49.outputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(220,3)">
     <use xlink:href="#caja20-30" name="PRODUCTION.4" class="en_marcha"></use>
     <text x="10" y="5">pz.sal</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.4.outputPiecesFormatted">-- piezas</text>
   </g>
   <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="4" transform="translate(240,43)">
     <use xlink:href="#caja20-30" name="PRODUCTION.3" class="en_marcha"></use>
     <text x="10" y="5">pz.sal</text>
     <text x="35" y="5" fill="#555" name="PRODUCTION.3.outputPiecesFormatted">-- piezas</text>
   </g>
 </svg>`
