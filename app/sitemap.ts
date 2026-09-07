import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cuantoes.com.py'
  
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/multas`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/divisor`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/presupuesto`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/servicios/pintura`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/servicios/aire`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/servicios/fletes`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/servicios/asado`, lastModified: new Date(), priority: 0.9 },
  ]
}