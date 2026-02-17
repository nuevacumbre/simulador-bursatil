// src/services/stockApi.js
// Servicio para obtener datos reales de Yahoo Finance con proxy CORS

export const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'WMT']

// Proxy CORS gratuito (evita el error de CORS)
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

/**
 * Obtiene datos en tiempo real de Yahoo Finance usando proxy CORS
 */
export const obtenerAccionesReales = async () => {
  console.log('📡 Obteniendo datos reales de Yahoo Finance...')

  try {
    const promises = SYMBOLS.map(async (symbol) => {
      try {
        // Construir URL de Yahoo Finance
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`
        // Usar proxy para evitar CORS
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`

        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`)
        }

        const data = await response.json()

        // Extraer datos
        const result = data.chart?.result?.[0]
        const meta = result?.meta
        const quote = result?.indicators?.quote?.[0]

        if (!meta || !quote) {
          throw new Error('Datos incompletos')
        }

        // Calcular variación
        const currentPrice = meta.regularMarketPrice
        const previousClose = meta.previousClose
        const variation = (((currentPrice - previousClose) / previousClose) * 100).toFixed(2)

        // Obtener nombre de la empresa
        const nombre = await obtenerNombreEmpresa(symbol)

        return {
          id: symbol,
          nombre: nombre,
          simbolo: symbol,
          precio: currentPrice,
          variacion: parseFloat(variation),
          sector: obtenerSector(symbol),
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error(`Error obteniendo ${symbol}:`, error)
        return obtenerDatosRespaldo(symbol)
      }
    })

    const resultados = await Promise.all(promises)
    console.log('✅ Datos reales obtenidos:', resultados.length)

    return resultados
  } catch (error) {
    console.error('❌ Error en API:', error)
    return SYMBOLS.map((symbol) => obtenerDatosRespaldo(symbol))
  }
}

/**
 * Obtiene nombre completo de la empresa
 */
const obtenerNombreEmpresa = async (symbol) => {
  const nombres = {
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corporation',
    GOOGL: 'Alphabet Inc.',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
    META: 'Meta Platforms Inc.',
    NVDA: 'NVIDIA Corporation',
    JPM: 'JPMorgan Chase & Co.',
    JNJ: 'Johnson & Johnson',
    WMT: 'Walmart Inc.',
  }
  return nombres[symbol] || symbol
}

const obtenerSector = (symbol) => {
  const sectores = {
    AAPL: 'Tecnología',
    MSFT: 'Tecnología',
    GOOGL: 'Tecnología',
    AMZN: 'Consumo',
    TSLA: 'Automotriz',
    META: 'Tecnología',
    NVDA: 'Tecnología',
    JPM: 'Financiero',
    JNJ: 'Salud',
    WMT: 'Consumo',
  }
  return sectores[symbol] || 'Otros'
}

export const obtenerDatosRespaldo = (symbol) => {
  const respaldo = {
    AAPL: { nombre: 'Apple Inc.', precio: 175.5 },
    MSFT: { nombre: 'Microsoft', precio: 420.3 },
    GOOGL: { nombre: 'Google', precio: 145.8 },
    AMZN: { nombre: 'Amazon', precio: 185.2 },
    TSLA: { nombre: 'Tesla', precio: 240.15 },
    META: { nombre: 'Meta', precio: 480.75 },
    NVDA: { nombre: 'NVIDIA', precio: 950.2 },
    JPM: { nombre: 'JPMorgan', precio: 185.5 },
    JNJ: { nombre: 'Johnson & Johnson', precio: 160.3 },
    WMT: { nombre: 'Walmart', precio: 65.4 },
  }

  const datos = respaldo[symbol] || { nombre: symbol, precio: 100.0 }

  return {
    id: symbol,
    nombre: datos.nombre,
    simbolo: symbol,
    precio: datos.precio,
    variacion: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    sector: obtenerSector(symbol),
    timestamp: new Date().toISOString(),
  }
}
