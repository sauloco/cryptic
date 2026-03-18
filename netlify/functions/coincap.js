const BASE_URL = "https://rest.coincap.io/v3";

exports.handler = async function(event) {
  const apiPath = event.path.replace(/^\/?api/, "");
  const query = new URLSearchParams(event.queryStringParameters || {}).toString();
  const targetUrl = `${BASE_URL}${apiPath}${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${process.env.COINCAP_API_KEY}`
      }
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
