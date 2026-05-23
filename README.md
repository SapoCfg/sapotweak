# SapoTweak Site

Repository del sito pubblico `sapotweak.org`.

## Pagine principali

- `index.html` - home principale
- `checkout.html` - scelta piano Stripe
- `checkout-success.html` - pagina post-pagamento che recupera la key
- `terms.html`, `privacy.html`, `refund.html` - pagine legali

## Flusso acquisto

1. Il cliente visita `checkout.html`
2. Sceglie piano mensile o trimestrale
3. Stripe completa il checkout
4. Stripe o il worker reindirizzano a `checkout-success.html?session_id=...`
5. La pagina legge la key dal worker `license.salvocan05.workers.dev`

## Asset checkout

- `checkout-preview.png` - immagine prodotto usata nella pagina piani

## Note deploy

Il sito e pubblicato tramite GitHub Pages sul dominio `sapotweak.org`.
