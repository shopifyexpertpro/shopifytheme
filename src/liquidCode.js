/* Ready-to-paste Liquid code, grouped by object: [group, title, code] */
export const CODE = [
  ["product", "Title, price, compare-at price", `<h1>{{ product.title }}</h1>
<p>
  {%- if product.compare_at_price > product.price -%}
    <s>{{ product.compare_at_price | money }}</s>
  {%- endif -%}
  <strong>{{ product.price | money }}</strong>
</p>`],
  ["product", "Product images gallery (with srcset)", `{%- for image in product.images -%}
  {{ image | image_url: width: 1200 | image_tag: loading: 'lazy', widths: '400,600,800,1200', sizes: '(min-width: 750px) 50vw, 100vw', alt: image.alt | default: product.title }}
{%- endfor -%}`],
  ["product", "Variant selector + add to cart form", `{%- form 'product', product -%}
  <select name="id">
    {%- for variant in product.variants -%}
      <option value="{{ variant.id }}" {% unless variant.available %}disabled{% endunless %} {% if variant == product.selected_or_first_available_variant %}selected{% endif %}>
        {{ variant.title }} – {{ variant.price | money }}
      </option>
    {%- endfor -%}
  </select>
  <button type="submit" {% unless product.available %}disabled{% endunless %}>
    {{ product.available | ternary: 'Add to cart', 'Sold out' }}
  </button>
{%- endform -%}`],
  ["product", "Options (Size / Color) with values", `{%- for option in product.options_with_values -%}
  <fieldset>
    <legend>{{ option.name }}</legend>
    {%- for value in option.values -%}
      <label><input type="radio" name="{{ option.name }}" value="{{ value | escape }}" {% if option.selected_value == value %}checked{% endif %}> {{ value }}</label>
    {%- endfor -%}
  </fieldset>
{%- endfor -%}`],
  ["product", "Sale badge and discount %", `{%- if product.compare_at_price > product.price -%}
  {%- assign saved = product.compare_at_price | minus: product.price -%}
  <span class="badge">-{{ saved | times: 100.0 | divided_by: product.compare_at_price | round }}%</span>
{%- endif -%}`],
  ["product", "Product card (snippet style)", `<a href="{{ product.url }}">
  {%- if product.featured_image -%}
    {{ product.featured_image | image_url: width: 600 | image_tag: loading: 'lazy', alt: product.featured_image.alt | default: product.title }}
  {%- endif -%}
  <h3>{{ product.title }}</h3>
  <span>{{ product.price | money }}</span>
</a>`],
  ["product", "Metafield, tags, vendor, type", `{{ product.metafields.custom.material.value }}
{{ product.vendor }} · {{ product.type }}
{%- for tag in product.tags -%}<span>{{ tag }}</span>{%- endfor -%}`],
  ["product", "Low stock message", `{%- assign v = product.selected_or_first_available_variant -%}
{%- if v.inventory_management and v.inventory_quantity > 0 and v.inventory_quantity <= 5 -%}
  Only {{ v.inventory_quantity }} left!
{%- endif -%}`],
  ["product", "Product picker setting (section)", `{%- assign p = section.settings.product -%}
{%- if p != blank -%}{{ p.title }} {{ p.price | money }}{%- endif -%}
{% comment %} schema: { "type": "product", "id": "product", "label": "Product" } {% endcomment %}`],

  ["collection", "Loop products with pagination", `{%- paginate collection.products by 12 -%}
  <h1>{{ collection.title }}</h1>
  {{ collection.description }}
  <ul>
    {%- for product in collection.products -%}
      <li><a href="{{ product.url }}">{{ product.title }}</a> {{ product.price | money }}</li>
    {%- else -%}
      <li>No products found.</li>
    {%- endfor -%}
  </ul>
  {{ paginate | default_pagination }}
{%- endpaginate -%}`],
  ["collection", "Collection image + product count", `{%- if collection.image -%}
  {{ collection.image | image_url: width: 1200 | image_tag: loading: 'lazy' }}
{%- endif -%}
{{ collection.products_count }} products`],
  ["collection", "Sort and storefront filters", `<select name="sort_by">
  {%- for option in collection.sort_options -%}
    <option value="{{ option.value }}" {% if option.value == collection.sort_by %}selected{% endif %}>{{ option.name }}</option>
  {%- endfor -%}
</select>
{%- for filter in collection.filters -%}
  <details><summary>{{ filter.label }}</summary>
    {%- for value in filter.values -%}
      <label><input type="checkbox" name="{{ value.param_name }}" value="{{ value.value }}" {% if value.active %}checked{% endif %}> {{ value.label }} ({{ value.count }})</label>
    {%- endfor -%}
  </details>
{%- endfor -%}`],
  ["collection", "List all collections", `{%- for collection in collections -%}
  <a href="{{ collection.url }}">{{ collection.title }}</a>
{%- endfor -%}`],
  ["collection", "Collection picker setting (section)", `{%- assign c = section.settings.collection -%}
{%- for product in c.products limit: section.settings.products_to_show -%}{{ product.title }}{%- endfor -%}
{% comment %} schema: { "type": "collection", "id": "collection", "label": "Collection" } {% endcomment %}`],

  ["page", "Page title + content", `<h1>{{ page.title }}</h1>
<div class="rte">{{ page.content }}</div>`],
  ["page", "Page by handle", `{{ pages['about-us'].title }}
{{ pages['about-us'].content | strip_html | truncatewords: 40 }}`],
  ["page", "Page picker setting (section)", `{%- assign pg = section.settings.page -%}
{%- if pg != blank -%}<a href="{{ pg.url }}">{{ pg.title }}</a>{%- endif -%}
{% comment %} schema: { "type": "page", "id": "page", "label": "Page" } {% endcomment %}`],
  ["page", "Contact form", `{%- form 'contact' -%}
  {%- if form.posted_successfully? -%}<p>Thanks, we will reply soon.</p>{%- endif -%}
  {{ form.errors | default_errors }}
  <input type="text" name="contact[name]" placeholder="Name">
  <input type="email" name="contact[email]" required placeholder="Email">
  <textarea name="contact[body]"></textarea>
  <button type="submit">Send</button>
{%- endform -%}`],

  ["blog", "Blog listing with pagination", `{%- paginate blog.articles by 9 -%}
  <h1>{{ blog.title }}</h1>
  {%- for article in blog.articles -%}
    <article>
      {%- if article.image -%}{{ article.image | image_url: width: 800 | image_tag: loading: 'lazy' }}{%- endif -%}
      <h2><a href="{{ article.url }}">{{ article.title }}</a></h2>
      <time datetime="{{ article.published_at | date: '%Y-%m-%d' }}">{{ article.published_at | date: '%b %d, %Y' }}</time>
      <p>{{ article.excerpt_or_content | strip_html | truncatewords: 30 }}</p>
    </article>
  {%- endfor -%}
  {{ paginate | default_pagination }}
{%- endpaginate -%}`],
  ["blog", "Article page", `<article>
  <h1>{{ article.title }}</h1>
  <p>By {{ article.author }} · {{ article.published_at | time_tag: format: 'date' }}</p>
  {%- if article.image -%}{{ article.image | image_url: width: 1400 | image_tag }}{%- endif -%}
  <div class="rte">{{ article.content }}</div>
  {%- for tag in article.tags -%}<a href="{{ blog.url }}/tagged/{{ tag | handleize }}">{{ tag }}</a>{%- endfor -%}
</article>`],
  ["blog", "Latest 3 articles (any blog)", `{%- for article in blogs.news.articles limit: 3 -%}
  <a href="{{ article.url }}">{{ article.title }}</a>
{%- endfor -%}
{% comment %} or use a blog picker setting: section.settings.blog.articles {% endcomment %}`],
  ["blog", "Comment form", `{%- if blog.comments_enabled? -%}
  {%- form 'new_comment', article -%}
    {{ form.errors | default_errors }}
    <input name="comment[author]" placeholder="Name">
    <input name="comment[email]" type="email" placeholder="Email">
    <textarea name="comment[body]"></textarea>
    <button type="submit">Post comment</button>
  {%- endform -%}
{%- endif -%}`],

  ["image", "Responsive image (recommended)", `{{ section.settings.image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '400,800,1200,1600', sizes: '(min-width: 990px) 50vw, 100vw', alt: section.settings.image.alt }}`],
  ["image", "Above-the-fold image (no lazy)", `{{ section.settings.image | image_url: width: 1600 | image_tag: loading: 'eager', fetchpriority: 'high', widths: '800,1200,1600', sizes: '100vw' }}`],
  ["image", "Image with placeholder fallback", `{%- if section.settings.image != blank -%}
  {{ section.settings.image | image_url: width: 1200 | image_tag: loading: 'lazy' }}
{%- else -%}
  {{ 'image' | placeholder_svg_tag: 'placeholder-svg' }}
{%- endif -%}`],
  ["image", "Aspect ratio box (no layout shift)", `<div style="aspect-ratio: {{ image.aspect_ratio | default: 1 }}">
  {{ image | image_url: width: 800 | image_tag: loading: 'lazy' }}
</div>`],
  ["image", "Background image from setting", `<div style="background-image:url('{{ section.settings.bg | image_url: width: 2000 }}')"></div>`],
  ["image", "Picture tag: different image on mobile", `<picture>
  <source media="(min-width: 750px)" srcset="{{ section.settings.desktop | image_url: width: 1600 }}">
  <img src="{{ section.settings.mobile | image_url: width: 800 }}" alt="{{ section.settings.mobile.alt | escape }}" loading="lazy" width="800" height="{{ 800 | divided_by: section.settings.mobile.aspect_ratio | round }}">
</picture>`],
  ["image", "Image from Content > Files", `{{ images['hero.jpg'] | image_url: width: 1200 | image_tag }}`],
  ["image", "Crop to square", `{{ image | image_url: width: 600, height: 600, crop: 'center' | image_tag }}`],
  ["image", "Media gallery (images, video, 3D)", `{%- for media in product.media -%}
  {%- case media.media_type -%}
    {%- when 'image' -%}{{ media | image_url: width: 1000 | image_tag: loading: 'lazy' }}
    {%- when 'video' or 'external_video' -%}{{ media | media_tag: image_size: '1000x' }}
    {%- when 'model' -%}{{ media | model_viewer_tag }}
  {%- endcase -%}
{%- endfor -%}`],
  ["image", "Image picker setting (schema)", `{ "type": "image_picker", "id": "image", "label": "Image" }`],

  ["section", "Section skeleton: blocks + schema + presets", `<div class="my-section my-section--{{ section.id }}">
  <h2>{{ section.settings.heading }}</h2>
  {%- for block in section.blocks -%}
    <div {{ block.shopify_attributes }}>{{ block.settings.text }}</div>
  {%- endfor -%}
</div>

{% schema %}
{
  "name": "My section",
  "settings": [{ "type": "text", "id": "heading", "label": "Heading", "default": "Hello" }],
  "blocks": [{ "type": "item", "name": "Item", "settings": [{ "type": "text", "id": "text", "label": "Text", "default": "Item" }] }],
  "presets": [{ "name": "My section", "blocks": [{ "type": "item" }] }]
}
{% endschema %}`],
  ["section", "Snippet with LiquidDoc params", `{% doc %}
  @param {product} product - Product to render
  @param {string} [class] - Optional CSS class
{% enddoc %}
<div class="{{ class }}">{{ product.title }}</div>

{%- comment -%} call it: {% render 'card', product: product, class: 'x' %} {%- endcomment -%}`],
  ["section", "Navigation menu with dropdown", `<ul>
  {%- for link in linklists.main-menu.links -%}
    <li><a href="{{ link.url }}" {% if link.current %}aria-current="page"{% endif %}>{{ link.title }}</a>
      {%- if link.links != blank -%}
        <ul>{%- for child in link.links -%}<li><a href="{{ child.url }}">{{ child.title }}</a></li>{%- endfor -%}</ul>
      {%- endif -%}
    </li>
  {%- endfor -%}
</ul>`],
  ["section", "Cart count + link", `<a href="{{ routes.cart_url }}">Cart ({{ cart.item_count }}) {{ cart.total_price | money }}</a>`],
  ["section", "Newsletter form", `{%- form 'customer', id: 'newsletter' -%}
  <input type="hidden" name="contact[tags]" value="newsletter">
  <input type="email" name="contact[email]" required placeholder="Email">
  <button type="submit">Subscribe</button>
  {%- if form.posted_successfully? -%}<p>Subscribed!</p>{%- endif -%}
{%- endform -%}`],
];

/* Learning links. YouTube entries are searches (always resolve); the rest are official docs. */
const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
export const VIDEOS = [
  ["Shopify Liquid basics (YouTube)", yt("shopify liquid tutorial for beginners")],
  ["Build a Shopify section from scratch (YouTube)", yt("shopify theme section schema tutorial")],
  ["Shopify theme blocks / Horizon (YouTube)", yt("shopify theme blocks tutorial horizon")],
  ["Shopify CLI theme dev (YouTube)", yt("shopify cli theme dev tutorial")],
  ["Liquid objects: product", "https://shopify.dev/docs/api/liquid/objects/product"],
  ["Liquid objects: collection", "https://shopify.dev/docs/api/liquid/objects/collection"],
  ["Liquid objects: page", "https://shopify.dev/docs/api/liquid/objects/page"],
  ["Liquid objects: blog", "https://shopify.dev/docs/api/liquid/objects/blog"],
  ["Liquid objects: article", "https://shopify.dev/docs/api/liquid/objects/article"],
  ["Liquid objects: image", "https://shopify.dev/docs/api/liquid/objects/image"],
  ["image_tag filter", "https://shopify.dev/docs/api/liquid/filters/image_tag"],
  ["Section schema reference", "https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema"],
  ["Theme blocks", "https://shopify.dev/docs/storefronts/themes/architecture/blocks"],
  ["Theme architecture", "https://shopify.dev/docs/storefronts/themes/architecture"],
  ["Shopify CLI for themes", "https://shopify.dev/docs/api/shopify-cli/theme"],
];
