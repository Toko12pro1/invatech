# Innovatech product capability notes

## Product and store sharing

### Capability

Customers and store owners can share an exact Innovatech product or store through WhatsApp, Facebook, or a device share sheet. A shared link preserves the product/store identity, referral context, public preview image, and the correct conversation destination.

### Fixed rules

- WhatsApp opens only after the customer actively clicks a button; the customer still presses Send.
- Innovatech remains the fallback contact when a store has no valid business WhatsApp number.
- A product must have a real `store_id` before the app can claim a confirmed store owner.
- Unlinked database products must not inherit a random demo-store identity.
- Referral attribution stays attached to shared product/store links where present.

### Implemented surfaces

- `/share/product/:id` and `/share/store/:id` provide crawler-readable previews and redirect people to the app.
- `/product/:id` and `/store/:id` provide exact public pages.
- Product and store cards provide WhatsApp, Facebook, native share, and copy-link paths.
- Store WhatsApp numbers are used only when they are valid; otherwise Innovatech receives the conversation.
- Product and store metadata includes Open Graph and Twitter preview fields.

### Open operator decision

The current iPhone 13 listing has no linked store in the database. An admin must choose its real partner store before the product can route directly to that store or claim that store as its owner.

### Not included in this capability

- Automatic Facebook posting or WhatsApp message sending.
- WhatsApp Business API automation, webhooks, or chatbot flows.
- Meta Pixel activation without a configured `VITE_META_PIXEL_ID` and consent.
