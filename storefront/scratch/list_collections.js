const SHOPIFY_STORE_DOMAIN = 'pros-clothing-2.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '8585a23530ad622ef5973e07881c0d65';

async function listCollections() {
  const query = `
    query getCollections {
      collections(first: 100) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data.data.collections.edges.map(e => e.node), null, 2));
}

listCollections();
