// import connectDB from '../../lib/mongoose';
// import Property from '../../models/Property';
// import { generatePropertySlug } from '../../utils/slugUtils';

// // export async function GET() {
// //   try {
// //     await connectDB();

// //     // Get all active properties with essential fields
// //     const properties = await Property.find({ isActive: true })
// //       .select('_id title location pricing propertyType listingType details updatedAt')
// //       .sort({ updatedAt: -1 })
// //       .limit(10000) // Limit to prevent huge sitemaps
// //       .lean();

// //     // Get unique values for category pages
// //     const [cities, propertyTypes, localities] = await Promise.all([
// //       Property.distinct('location.city', { isActive: true }),
// //       Property.distinct('propertyType', { isActive: true }),
// //       Property.distinct('location.locality', { isActive: true })
// //     ]);

// //     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
// //     const sitemap = generateSitemap(baseUrl, properties, cities, propertyTypes, localities);

// //     res.setHeader('Content-Type', 'application/xml');
// //     res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
// //     res.write(sitemap);
// //     res.end();

// //     return { props: {} };
// //   } catch (error) {
// //     console.error('Sitemap generation error:', error);
// //     res.status(500).end('Error generating sitemap');
// //     return { props: {} };
// //   }
// // }

// // function generateSitemap(baseUrl, properties, cities, propertyTypes, localities) {
// //   const createUrl = (loc, lastmod, changefreq = 'weekly', priority = '0.8') => `
// //   <url>
// //     <loc>${baseUrl}${loc}</loc>
// //     <lastmod>${lastmod}</lastmod>
// //     <changefreq>${changefreq}</changefreq>
// //     <priority>${priority}</priority>
// //   </url>`;

// //   // Generate property URLs with consistent slugs
// //   const propertyUrls = properties.map(property => {
// //     const slug = generatePropertySlug(property);
// //     const lastmod = property.updatedAt ? property.updatedAt.toISOString() : new Date().toISOString();

// //     return [
// //       createUrl(`/property/${property._id}`, lastmod),
// //       createUrl(`/property/${property._id}/${slug}`, lastmod),
// //       createUrl(`/property/${property.location?.city?.toLowerCase().replace(/\s+/g, '-')}/${property._id}`, lastmod)
// //     ].join('');
// //   }).join('');

// //   // Generate city URLs
// //   const cityUrls = cities.map(city => {
// //     const citySlug = city.toLowerCase().replace(/\s+/g, '-');
// //     const lastmod = new Date().toISOString();

// //     return [
// //       createUrl(`/properties/city/${citySlug}`, lastmod, 'daily', '0.7'),
// //       createUrl(`/rent/${citySlug}`, lastmod, 'daily', '0.7'),
// //       createUrl(`/sale/${citySlug}`, lastmod, 'daily', '0.7')
// //     ].join('');
// //   }).join('');

// //   // Generate property type URLs
// //   const propertyTypeUrls = propertyTypes.map(type => {
// //     const typeSlug = type.toLowerCase().replace(/\s+/g, '-');
// //     const lastmod = new Date().toISOString();

// //     return [
// //       createUrl(`/properties/type/${typeSlug}`, lastmod, 'daily', '0.7'),
// //       createUrl(`/${typeSlug}-for-rent`, lastmod, 'daily', '0.7'),
// //       createUrl(`/${typeSlug}-for-sale`, lastmod, 'daily', '0.7')
// //     ].join('');
// //   }).join('');

// //   // Generate locality URLs
// //   const localityUrls = localities.map(locality => {
// //     const localitySlug = locality.toLowerCase().replace(/\s+/g, '-');
// //     const lastmod = new Date().toISOString();

// //     return createUrl(`/properties/locality/${localitySlug}`, lastmod, 'weekly', '0.6');
// //   }).join('');

// //   return `<?xml version="1.0" encoding="UTF-8"?>
// // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// //   ${createUrl('/', new Date().toISOString(), 'daily', '1.0')}
// //   ${createUrl('/properties', new Date().toISOString(), 'daily', '0.9')}
// //   ${createUrl('/search', new Date().toISOString(), 'daily', '0.8')}
// //   ${propertyUrls}
// //   ${cityUrls}
// //   ${propertyTypeUrls}
// //   ${localityUrls}
// // </urlset>`;
// // }

// // export default function Sitemap() {
// //   return null;
// // }

// export async function GET() {
//   try {
//     await connectDB();

//     const properties = await Property.find({ isActive: true })
//       .select('_id title location pricing propertyType listingType details updatedAt')
//       .sort({ updatedAt: -1 })
//       .limit(10000)
//       .lean();

//     const [cities, propertyTypes, localities] = await Promise.all([
//       Property.distinct('location.city', { isActive: true }),
//       Property.distinct('propertyType', { isActive: true }),
//       Property.distinct('location.locality', { isActive: true })
//     ]);

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://next-js-real-estate-n0n755vik-radheshyams-projects.vercel.app/sitemap.xml';

//     const sitemap = generateSitemap(baseUrl, properties, cities, propertyTypes, localities);

//     return new Response(sitemap, {
//       headers: {
//         'Content-Type': 'application/xml',
//         'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
//       },
//     });
//   } catch (error) {
//     console.error('Sitemap generation error:', error);
//     return new Response('Error generating sitemap', { status: 500 });
//   }
// }

// function generateSitemap(baseUrl, properties, cities, propertyTypes, localities) {
//   const createUrl = (loc, lastmod, changefreq = 'weekly', priority = '0.8') => `
//   <url>
//     <loc>${baseUrl}${loc}</loc>
//     <lastmod>${lastmod}</lastmod>
//     <changefreq>${changefreq}</changefreq>
//     <priority>${priority}</priority>
//   </url>`;

//   const propertyUrls = properties.map(property => {
//     const slug = generatePropertySlug(property);
//     const lastmod = property.updatedAt?.toISOString() || new Date().toISOString();

//     return [
//       createUrl(`/property/${property._id}`, lastmod),
//       createUrl(`/property/${property._id}/${slug}`, lastmod),
//       createUrl(`/property/${property.location?.city?.toLowerCase().replace(/\s+/g, '-')}/${property._id}`, lastmod)
//     ].join('');
//   }).join('');

//   const cityUrls = cities.map(city => {
//     const slug = encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'));
//     const lastmod = new Date().toISOString();

//     return [
//       createUrl(`/properties/city/${slug}`, lastmod, 'daily', '0.7'),
//       createUrl(`/rent/${slug}`, lastmod, 'daily', '0.7'),
//       createUrl(`/sale/${slug}`, lastmod, 'daily', '0.7')
//     ].join('');
//   }).join('');

//   const typeUrls = propertyTypes.map(type => {
//     const slug = encodeURIComponent(type.toLowerCase().replace(/\s+/g, '-'));
//     const lastmod = new Date().toISOString();

//     return [
//       createUrl(`/properties/type/${slug}`, lastmod, 'daily', '0.7'),
//       createUrl(`/${slug}-for-rent`, lastmod, 'daily', '0.7'),
//       createUrl(`/${slug}-for-sale`, lastmod, 'daily', '0.7')
//     ].join('');
//   }).join('');

//   const localityUrls = localities.map(locality => {
//     const slug = encodeURIComponent(locality.toLowerCase().replace(/\s+/g, '-'));
//     const lastmod = new Date().toISOString();

//     return createUrl(`/properties/locality/${slug}`, lastmod, 'weekly', '0.6');
//   }).join('');

//   return `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${createUrl('/', new Date().toISOString(), 'daily', '1.0')}
//   ${createUrl('/properties', new Date().toISOString(), 'daily', '0.9')}
//   ${createUrl('/search', new Date().toISOString(), 'daily', '0.8')}
//   ${propertyUrls}
//   ${cityUrls}
//   ${typeUrls}
//   ${localityUrls}
// </urlset>`;
// }
