-- Seed initial content that was previously hardcoded in the frontend.

insert into public.products (name_en, name_fr, category, price, old_price, condition, badge, image_url, sort_order) values
  ('Smartphone — 128GB', 'Smartphone — 128 Go', 'Smartphones', 285000, null, 'New', 'Best Seller', '/images/product-phone.jpg', 1),
  ('Smartwatch Series', 'Montre Connectée', 'Wearables', 95000, 115000, 'New', 'On Sale', '/images/product-smartwatch.jpg', 2),
  ('Smart Speaker Assistant', 'Enceinte Intelligente', 'Audio', 45000, 60000, 'Fairly Used', 'On Sale', '/images/product-speaker.jpg', 3),
  ('Studio Bookshelf Speaker (Pair)', 'Enceintes de Studio (Paire)', 'Audio', 65000, null, 'New', null, '/images/product-speaker2.jpg', 4),
  ('Instant Camera', 'Appareil Photo Instantané', 'Cameras', 78000, null, 'Fairly Used', 'Popular', '/images/product-camera.jpg', 5),
  ('Gaming Console & Controller Bundle', 'Pack Console de Jeu et Manette', 'Gaming', 40000, null, 'Fairly Used', null, '/images/service-device-repair.jpg', 6);

insert into public.wifi_packages (data_amount, data_unit, duration_days, price, old_price, is_popular, sort_order) values
  (500, 'MB', 1, 200, null, false, 1),
  (1, 'GB', 1, 350, null, false, 2),
  (2, 'GB', 7, 1000, null, true, 3),
  (5, 'GB', 30, 2500, null, false, 4);
