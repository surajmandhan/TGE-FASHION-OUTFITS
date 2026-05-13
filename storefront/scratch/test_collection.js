const SHOPIFY_STORE_DOMAIN = 'pros-clothing-2.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '8585a23530ad622ef5973e07881c0d65';

async function testCollection(handle) {
  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        handle
        products(first: 5) {
          edges {
            node {
              title
            }
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
    body: JSON.stringify({ query, variables: { handle } }),
  });

  const data = await response.json();
  console.log(`Results for ${handle}:`, JSON.stringify(data, null, 2));
}

testCollection('men');
testCollection('women');
