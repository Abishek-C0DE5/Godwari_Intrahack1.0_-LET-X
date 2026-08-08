-- ==========================================
-- COMPLETE TOURIST MODULE MIGRATION
-- ==========================================

-- 1. Create destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Expand profiles table for guides, hotels, and leaderboard points
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS specialties TEXT,
  ADD COLUMN IF NOT EXISTS price TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 3. Set up RLS for destinations
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'destinations' AND policyname = 'Anyone can view destinations'
  ) THEN
    CREATE POLICY "Anyone can view destinations" 
    ON public.destinations 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- 4. Create trips table for Upcoming Trips
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  days INTEGER NOT NULL,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Users can view own trips'
  ) THEN
    CREATE POLICY "Users can view own trips" 
    ON public.trips 
    FOR SELECT 
    USING (auth.uid() = tourist_id);
    
    CREATE POLICY "Users can insert own trips" 
    ON public.trips 
    FOR INSERT 
    WITH CHECK (auth.uid() = tourist_id);
  END IF;
END $$;


-- ==========================================
-- MOCK DATA INSERTION
-- ==========================================

-- Clean up any old mock data to avoid duplicates if this script is run multiple times
DELETE FROM public.trips;
DELETE FROM public.destinations;
DELETE FROM public.profiles WHERE role IN ('guide', 'hotel');
-- We leave tourist profiles so you don't lose your login, but we reset their points
UPDATE public.profiles SET points = 0 WHERE role = 'tourist';

-- Insert all 20 destinations
INSERT INTO public.destinations (name, description, image_url, location) VALUES
('Pokhara', 'The tourism capital of Nepal, known for its lakes and stunning views of the Annapurna range.', 'https://picsum.photos/seed/Pokhara/600/400', 'Pokhara'),
('Kathmandu', 'The capital city, full of ancient temples, bustling streets, and rich history.', 'https://picsum.photos/seed/Kathmandu/600/400', 'Kathmandu'),
('Chitwan', 'Famous for its national park and wildlife safaris.', 'https://picsum.photos/seed/Chitwan/600/400', 'Chitwan'),
('Mustang', 'A remote and beautiful region with unique landscapes and Tibetan culture.', 'https://picsum.photos/seed/Mustang/600/400', 'Mustang'),
('Lumbini', 'The birthplace of Lord Buddha, a major pilgrimage site.', 'https://picsum.photos/seed/Lumbini/600/400', 'Lumbini'),
('Everest Base Camp', 'The ultimate trekking destination leading to the base of the world''s highest peak.', 'https://picsum.photos/seed/Everest/600/400', 'Solukhumbu'),
('Bhaktapur', 'An ancient Newari city famous for its rich culture, temples, and wood, metal and stone artworks.', 'https://picsum.photos/seed/Bhaktapur/600/400', 'Bhaktapur'),
('Patan', 'Known as the City of Fine Arts, famous for its durbar square and intricate architecture.', 'https://picsum.photos/seed/Patan/600/400', 'Lalitpur'),
('Namche Bazaar', 'The gateway to the high Himalayas and the main trading center for the Khumbu region.', 'https://picsum.photos/seed/Namche/600/400', 'Solukhumbu'),
('Rara Lake', 'The largest lake in Nepal, situated in the remote Karnali province surrounded by pine forests.', 'https://picsum.photos/seed/Rara/600/400', 'Mugu'),
('Bandipur', 'A beautifully preserved hilltop Newari town with panoramic mountain views.', 'https://picsum.photos/seed/Bandipur/600/400', 'Tanahun'),
('Ghandruk', 'A popular Gurung village offering spectacular views of Annapurna South and Machhapuchhre.', 'https://picsum.photos/seed/Ghandruk/600/400', 'Kaski'),
('Tilicho Lake', 'One of the highest lakes in the world, located in the Manang district.', 'https://picsum.photos/seed/Tilicho/600/400', 'Manang'),
('Poon Hill', 'A famous viewpoint in the Annapurna region, especially popular for sunrise views.', 'https://picsum.photos/seed/PoonHill/600/400', 'Myagdi'),
('Gokyo Lakes', 'A series of turquoise oligotrophic lakes in the Sagarmatha National Park.', 'https://picsum.photos/seed/Gokyo/600/400', 'Solukhumbu'),
('Swayambhunath', 'A sprawling Buddhist stupa complex on a hill overlooking Kathmandu.', 'https://picsum.photos/seed/Swayambhunath/600/400', 'Kathmandu'),
('Langtang Valley', 'A stunning valley north of Kathmandu known for its glaciers and snow-capped peaks.', 'https://picsum.photos/seed/Langtang/600/400', 'Rasuwa'),
('Boudhanath', 'One of the largest spherical stupas in Nepal, the center of Tibetan Buddhism in Kathmandu.', 'https://picsum.photos/seed/Boudhanath/600/400', 'Kathmandu'),
('Nagarkot', 'A famous hill station near Kathmandu offering stunning sunrise views of the Himalayas.', 'https://picsum.photos/seed/Nagarkot/600/400', 'Bhaktapur'),
('Bardiya', 'A pristine national park in the Terai region, famous for Bengal tigers and wild elephants.', 'https://picsum.photos/seed/Bardiya/600/400', 'Bardiya');


-- Insert mock Guides, Hotels, and Leaderboard Tourists
-- We temporarily drop the foreign key constraint to auth.users so we can insert mock profiles without needing actual auth accounts.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO public.profiles (id, name, email, role, location, specialties, rating, price, avatar_url, description, points) VALUES
(gen_random_uuid(), 'Ram Gurung', 'ram@example.com', 'guide', 'Pokhara', 'Adventure + Hiking', 4.8, 'NPR 2500/day', 'https://images.unsplash.com/photo-1544168190-79c15427008f?auto=format&fit=crop&q=80', 'Experienced local guide specialized in Annapurna base camp and short hikes around Pokhara.', 3200),
(gen_random_uuid(), 'Sita Thapa', 'sita@example.com', 'guide', 'Kathmandu', 'Culture + Photography', 4.9, 'NPR 3000/day', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', 'Passionate about sharing the hidden temples and rich history of the Kathmandu valley.', 4850),
(gen_random_uuid(), 'Hotel Himalayan', 'contact@hotelhimalayan.com', 'hotel', 'Pokhara', NULL, 4.7, 'NPR 4500/night', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'A luxury stay with a perfect view of Phewa Lake and the mountains. Free WiFi, Breakfast included.', 0),
(gen_random_uuid(), 'Kathmandu Heritage Resort', 'info@ktmheritage.com', 'hotel', 'Kathmandu', NULL, 4.5, 'NPR 6000/night', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Experience traditional Newari architecture with modern comforts right in the heart of the city.', 0),
(gen_random_uuid(), 'Prakash Sharma', 'prakash@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 4420),
(gen_random_uuid(), 'Anna Smith', 'anna@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 4100),
(gen_random_uuid(), 'John Doe', 'john@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 3870),
(gen_random_uuid(), 'Maya Rai', 'maya@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 2900),
(gen_random_uuid(), 'Bikash Tamang', 'bikash@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 2150),
(gen_random_uuid(), 'Sarah Chen', 'sarah@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 1800),
(gen_random_uuid(), 'David Miller', 'david@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 1250),
(gen_random_uuid(), 'Nima Sherpa', 'nima@example.com', 'tourist', NULL, NULL, 0, NULL, NULL, NULL, 950);
