import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cuantoes.com.py'
  
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/multas`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/divisor`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/presupuesto`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/costos/pintura`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/aire`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/fletes`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/asado`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/plomeria`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/electricidad`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/limpieza`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/costos/albanileria`, lastModified: new Date(), priority: 0.9 },
  ]
}