export default function sitemap() {
  const currentDate = new Date().toISOString();

  return [
    {
      url: 'https://logomakers.online',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      url: 'https://logomakers.online/hire-designer',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/pricing',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/create?title=',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/faq',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/privacy-policy',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/refund-policy',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://logomakers.online/terms-and-policy',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
