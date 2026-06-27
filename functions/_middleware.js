// Cloudflare Pages Function — runs on every request.
// Reads environment variables (set in the Cloudflare dashboard) and injects them
// into the HTML as `window.WED_ENV` so the static page can use them at runtime.
export async function onRequest(context) {
  const response = await context.next();

  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const env = context.env || {};
  const cfg = {
    MAPS_URL: env.MAPS_URL || "",
    YT_LIVE_LINK: env.YT_LIVE_LINK || "",
    YT_EMBED_INLINE: env.YT_EMBED_INLINE === "true" || env.YT_EMBED_INLINE === true,
  };

  const tag = `<script>window.WED_ENV=${JSON.stringify(cfg)};</script>`;

  return new HTMLRewriter()
    .on("head", {
      element(el) {
        el.append(tag, { html: true });
      },
    })
    .transform(response);
}
