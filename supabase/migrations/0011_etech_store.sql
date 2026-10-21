-- Etech Store partner listing.
-- The supplied owner number is still a placeholder, so customer conversations
-- continue through Innovatech until the real WhatsApp number is confirmed.

insert into public.stores (name, category, location, whatsapp, description, image_url, response_time, verified, active)
select
  'Etech Store',
  'Smartphones, laptops & accessories',
  'Biyem-Assi, Yaounde, Centre Region, Cameroon',
  '2376XXXXXXXX',
  'Etech Store is an electronics store based in Biyem-Assi, Yaoundé, Cameroon. We specialize in smartphones, laptops and electronic accessories. Our goal is to help customers find quality devices at affordable prices, with friendly service and convenient communication through WhatsApp.',
  '/images/etech-store.png',
  'Contact Innovatech for availability',
  true,
  true
where not exists (
  select 1 from public.stores where lower(name) = lower('Etech Store')
);
