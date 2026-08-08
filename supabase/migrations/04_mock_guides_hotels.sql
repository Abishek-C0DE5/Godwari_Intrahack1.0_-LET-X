-- ==========================================
-- MOCK DATA: Guides & Hotels for All Locations
-- ==========================================

-- We temporarily drop the foreign key constraint to auth.users so we can insert mock profiles without needing actual auth accounts.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Delete existing fake guides and hotels to prevent massive duplicates if re-run
DELETE FROM public.profiles WHERE role IN ('guide', 'hotel');

-- Insert 1 Guide and 1 Hotel for each of the main locations
INSERT INTO public.profiles (id, name, email, role, location, specialties, rating, price, avatar_url, description, points) VALUES
-- Pokhara
(gen_random_uuid(), 'Ram Gurung', 'ram@example.com', 'guide', 'Pokhara', 'Adventure + Hiking', 4.8, 'NPR 2500/day', 'https://images.unsplash.com/photo-1544168190-79c15427008f?auto=format&fit=crop&q=80', 'Experienced local guide specialized in Annapurna base camp and short hikes around Pokhara.', 3200),
(gen_random_uuid(), 'Hotel Himalayan', 'contact@hotelhimalayan.com', 'hotel', 'Pokhara', NULL, 4.7, 'NPR 4500/night', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'A luxury stay with a perfect view of Phewa Lake and the mountains. Free WiFi, Breakfast included.', 0),

-- Kathmandu
(gen_random_uuid(), 'Sita Thapa', 'sita@example.com', 'guide', 'Kathmandu', 'Culture + Photography', 4.9, 'NPR 3000/day', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', 'Passionate about sharing the hidden temples and rich history of the Kathmandu valley.', 4850),
(gen_random_uuid(), 'Kathmandu Heritage Resort', 'info@ktmheritage.com', 'hotel', 'Kathmandu', NULL, 4.5, 'NPR 6000/night', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Experience traditional Newari architecture with modern comforts right in the heart of the city.', 0),

-- Chitwan
(gen_random_uuid(), 'Bikash Tamang', 'bikash.guide@example.com', 'guide', 'Chitwan', 'Wildlife Safari', 4.6, 'NPR 2000/day', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80', 'Expert wildlife tracker. Let me show you the Royal Bengal tigers and rhinos.', 2100),
(gen_random_uuid(), 'Jungle Resort Chitwan', 'info@junglechitwan.com', 'hotel', 'Chitwan', NULL, 4.4, 'NPR 5000/night', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80', 'Stay deep in the jungle with luxury tents and evening cultural shows.', 0),

-- Mustang
(gen_random_uuid(), 'Pasang Sherpa', 'pasang.mustang@example.com', 'guide', 'Mustang', 'High Altitude Trekking', 4.9, 'NPR 4000/day', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80', 'Native to the region, I guide treks through the mystical Upper Mustang.', 5500),
(gen_random_uuid(), 'Mustang Heritage Inn', 'stay@mustanginn.com', 'hotel', 'Mustang', NULL, 4.3, 'NPR 3500/night', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80', 'Warm and cozy stay in the harsh Himalayan desert.', 0),

-- Lumbini
(gen_random_uuid(), 'Anil Shakya', 'anil@example.com', 'guide', 'Lumbini', 'Spiritual Tours', 4.7, 'NPR 1500/day', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80', 'Learn the deep history and teachings of Buddha right at his birthplace.', 1500),
(gen_random_uuid(), 'Peace Grove Hotel', 'peace@lumbini.com', 'hotel', 'Lumbini', NULL, 4.6, 'NPR 3000/night', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80', 'Tranquil gardens and walking distance to the Maya Devi Temple.', 0),

-- Solukhumbu (Everest / Namche / Gokyo)
(gen_random_uuid(), 'Mingma Sherpa', 'mingma@example.com', 'guide', 'Solukhumbu', 'Everest Expeditions', 5.0, 'NPR 6000/day', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80', '10 times Everest summiteer. Safety is my priority.', 8000),
(gen_random_uuid(), 'Namche View Lodge', 'lodge@namche.com', 'hotel', 'Solukhumbu', NULL, 4.8, 'NPR 2500/night', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80', 'Best view of Kongde Ri, warm dining hall, and great food.', 0),

-- Bhaktapur
(gen_random_uuid(), 'Sunil Prajapati', 'sunil@example.com', 'guide', 'Bhaktapur', 'Art & History', 4.8, 'NPR 2000/day', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80', 'I will guide you through the ancient alleys and pottery squares.', 2000),
(gen_random_uuid(), 'Bhaktapur Guest House', 'stay@bhaktapur.com', 'hotel', 'Bhaktapur', NULL, 4.5, 'NPR 2500/night', 'https://images.unsplash.com/photo-1501117716987-c8c394bb29bf?auto=format&fit=crop&q=80', 'Authentic Newari building converted into a cozy guesthouse.', 0),

-- Lalitpur (Patan)
(gen_random_uuid(), 'Nima Maharjan', 'nima.p@example.com', 'guide', 'Lalitpur', 'Architecture & Food', 4.7, 'NPR 2500/day', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80', 'Discover the City of Fine Arts with a local foodie.', 3100),
(gen_random_uuid(), 'Patan Palace Hotel', 'palace@patan.com', 'hotel', 'Lalitpur', NULL, 4.6, 'NPR 5500/night', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Luxury stay right next to Patan Durbar Square.', 0),

-- Mugu (Rara)
(gen_random_uuid(), 'Karna Rokaya', 'karna@example.com', 'guide', 'Mugu', 'Off-beat Trails', 4.5, 'NPR 3000/day', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80', 'Exploring the wild west of Nepal around Rara Lake.', 1800),
(gen_random_uuid(), 'Rara Lake Resort', 'resort@rara.com', 'hotel', 'Mugu', NULL, 4.2, 'NPR 4000/night', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80', 'The only luxury resort on the banks of Rara lake.', 0),

-- Tanahun (Bandipur)
(gen_random_uuid(), 'Gita Shrestha', 'gita@example.com', 'guide', 'Tanahun', 'Cultural Walks', 4.8, 'NPR 1500/day', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', 'Experience the living heritage of Bandipur village.', 2400),
(gen_random_uuid(), 'Bandipur Heritage Inn', 'inn@bandipur.com', 'hotel', 'Tanahun', NULL, 4.7, 'NPR 3000/night', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'Traditional aesthetics with modern amenities.', 0),

-- Kaski (Ghandruk / Pokhara region)
(gen_random_uuid(), 'Amrit Gurung', 'amrit@example.com', 'guide', 'Kaski', 'Village Tours', 4.9, 'NPR 2000/day', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80', 'I will show you the rich Gurung culture in Ghandruk.', 3300),
(gen_random_uuid(), 'Ghandruk View Lodge', 'lodge@ghandruk.com', 'hotel', 'Kaski', NULL, 4.4, 'NPR 1500/night', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80', 'Wake up to the spectacular view of Machhapuchhre.', 0),

-- Manang (Tilicho)
(gen_random_uuid(), 'Karma Gurung', 'karma@example.com', 'guide', 'Manang', 'Trans-Himalayan Treks', 4.8, 'NPR 4000/day', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80', 'Expert in crossing Thorong La and reaching Tilicho.', 4100),
(gen_random_uuid(), 'Tilicho Base Camp Hotel', 'basecamp@tilicho.com', 'hotel', 'Manang', NULL, 4.1, 'NPR 2000/night', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80', 'The highest place you can sleep comfortably before the lake.', 0),

-- Myagdi (Poon Hill)
(gen_random_uuid(), 'Shyam Pun', 'shyam@example.com', 'guide', 'Myagdi', 'Sunrise Hikes', 4.6, 'NPR 1800/day', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80', 'Poon hill sunrise and hot springs expert.', 2200),
(gen_random_uuid(), 'Ghorepani Guest House', 'ghorepani@example.com', 'hotel', 'Myagdi', NULL, 4.5, 'NPR 1800/night', 'https://images.unsplash.com/photo-1501117716987-c8c394bb29bf?auto=format&fit=crop&q=80', 'Warm fire in the dining hall and cozy rooms.', 0),

-- Rasuwa (Langtang)
(gen_random_uuid(), 'Tenzing Tamang', 'tenzing@example.com', 'guide', 'Rasuwa', 'Valley Treks', 4.7, 'NPR 2500/day', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80', 'Explore the beautiful valley of glaciers.', 2800),
(gen_random_uuid(), 'Langtang Valley Hotel', 'hotel@langtang.com', 'hotel', 'Rasuwa', NULL, 4.3, 'NPR 2000/night', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'Rebuilt and ready to serve travelers with warm hospitality.', 0),

-- Bardiya
(gen_random_uuid(), 'Ram Tharu', 'ram.t@example.com', 'guide', 'Bardiya', 'Jungle Walks', 4.9, 'NPR 2500/day', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80', 'Best chance to see a tiger is on foot with me.', 3500),
(gen_random_uuid(), 'Tiger Track Resort', 'resort@bardiya.com', 'hotel', 'Bardiya', NULL, 4.6, 'NPR 4500/night', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80', 'Deep in the wilderness but with all the comforts you need.', 0);
