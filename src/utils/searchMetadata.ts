export const SITE_URL = 'https://doorhome.company';

export const SEARCH_PAGES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Doorhome | Aluminum Windows, Doors & Facades in Iraq',
    description: "Explore Doorhome's aluminum and uPVC windows, entrance doors, sliding doors and architectural facades in Iraq and Kurdistan. View products, projects and contact our team."
  },
  '/products': {
    title: 'Aluminum & uPVC Windows and Doors | Doorhome Catalog',
    description: 'Browse Doorhome window and door products, images, descriptions and prices. Find aluminum, aluminium and uPVC systems for your project in Iraq and Kurdistan.'
  },
  '/projects': {
    title: 'Window, Door & Facade Projects in Iraq | Doorhome',
    description: 'See Doorhome project photos and videos featuring architectural windows, doors and facades. Explore completed work and project details.'
  },
  '/contact': {
    title: 'Contact Doorhome | Windows & Doors Showroom in Iraq',
    description: 'Contact Doorhome for aluminum windows, uPVC doors and architectural systems. Send a project inquiry, call our team or find our showroom on the map.'
  }
};

export function searchPagePath(tab: string): string {
  if (tab === 'projects') return '/projects';
  if (tab === 'contact') return '/contact';
  if (['home', 'about', 'typology'].includes(tab)) return '/';
  return '/products';
}

const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Initial HTML metadata works before JavaScript runs, not only after Google renders React.
export function renderSearchMetadata(html: string, pathname: string): string {
  const page = SEARCH_PAGES[pathname];
  if (!page) return html.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
  const title = escapeAttribute(page.title);
  const description = escapeAttribute(page.description);
  const url = `${SITE_URL}${pathname}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="title"[^>]*>/, `<meta name="title" content="${title}" />`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${url}" />`);
}
