-- 1. Add points to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Give random points to existing mock users for the leaderboard
UPDATE public.profiles SET points = 4850 WHERE name = 'Sita Thapa';
UPDATE public.profiles SET points = 3200 WHERE name = 'Ram Gurung';

-- Create more mock users to fill out the leaderboard
-- We temporarily drop the foreign key constraint to auth.users so we can insert mock profiles without needing actual auth accounts.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO public.profiles (id, name, email, role, points) VALUES
(gen_random_uuid(), 'Prakash Sharma', 'prakash@example.com', 'tourist', 4420),
(gen_random_uuid(), 'Anna Smith', 'anna@example.com', 'tourist', 4100),
(gen_random_uuid(), 'John Doe', 'john@example.com', 'tourist', 3870),
(gen_random_uuid(), 'Maya Rai', 'maya@example.com', 'tourist', 2900),
(gen_random_uuid(), 'Bikash Tamang', 'bikash@example.com', 'tourist', 2150),
(gen_random_uuid(), 'Sarah Chen', 'sarah@example.com', 'tourist', 1800),
(gen_random_uuid(), 'David Miller', 'david@example.com', 'tourist', 1250),
(gen_random_uuid(), 'Nima Sherpa', 'nima@example.com', 'tourist', 950);

-- 2. Add more destinations (15+)
INSERT INTO public.destinations (name, description, image_url, location) VALUES
('Everest Base Camp', 'The ultimate trekking destination leading to the base of the world''s highest peak.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80', 'Solukhumbu'),
('Bhaktapur', 'An ancient Newari city famous for its rich culture, temples, and wood, metal and stone artworks.', 'https://images.unsplash.com/photo-1554558509-0d853e30f1df?auto=format&fit=crop&q=80', 'Bhaktapur'),
('Patan', 'Known as the City of Fine Arts, famous for its durbar square and intricate architecture.', 'https://images.unsplash.com/photo-1628151240166-5085e94b8eec?auto=format&fit=crop&q=80', 'Lalitpur'),
('Namche Bazaar', 'The gateway to the high Himalayas and the main trading center for the Khumbu region.', 'https://images.unsplash.com/photo-1588665042861-12c8a24be2cd?auto=format&fit=crop&q=80', 'Solukhumbu'),
('Rara Lake', 'The largest lake in Nepal, situated in the remote Karnali province surrounded by pine forests.', 'https://images.unsplash.com/photo-1623847631165-27a3a8309a47?auto=format&fit=crop&q=80', 'Mugu'),
('Bandipur', 'A beautifully preserved hilltop Newari town with panoramic mountain views.', 'https://images.unsplash.com/photo-1616117627449-3a36db5984ba?auto=format&fit=crop&q=80', 'Tanahun'),
('Ghandruk', 'A popular Gurung village offering spectacular views of Annapurna South and Machhapuchhre.', 'https://images.unsplash.com/photo-1600298882283-40b4dcb8b211?auto=format&fit=crop&q=80', 'Kaski'),
('Tilicho Lake', 'One of the highest lakes in the world, located in the Manang district.', 'https://images.unsplash.com/photo-1590483861209-f81d1c5d9a9b?auto=format&fit=crop&q=80', 'Manang'),
('Poon Hill', 'A famous viewpoint in the Annapurna region, especially popular for sunrise views.', 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80', 'Myagdi'),
('Gokyo Lakes', 'A series of turquoise oligotrophic lakes in the Sagarmatha National Park.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80', 'Solukhumbu'),
('Swayambhunath', 'A sprawling Buddhist stupa complex on a hill overlooking Kathmandu.', 'https://images.unsplash.com/photo-1582650117496-e2db2ef6a928?auto=format&fit=crop&q=80', 'Kathmandu'),
('Langtang Valley', 'A stunning valley north of Kathmandu known for its glaciers and snow-capped peaks.', 'https://images.unsplash.com/photo-1580979803131-0164cbf4d812?auto=format&fit=crop&q=80', 'Rasuwa'),
('Boudhanath', 'One of the largest spherical stupas in Nepal, the center of Tibetan Buddhism in Kathmandu.', 'https://images.unsplash.com/photo-1583162786358-0056910609ac?auto=format&fit=crop&q=80', 'Kathmandu'),
('Nagarkot', 'A famous hill station near Kathmandu offering stunning sunrise views of the Himalayas.', 'https://images.unsplash.com/photo-1600298882283-40b4dcb8b211?auto=format&fit=crop&q=80', 'Bhaktapur'),
('Bardiya', 'A pristine national park in the Terai region, famous for Bengal tigers and wild elephants.', 'https://images.unsplash.com/photo-1589136777351-fdc9c8cb2555?auto=format&fit=crop&q=80', 'Bardiya');

-- 3. Create trips table for Upcoming Trips
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  days INTEGER NOT NULL,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips" 
ON public.trips 
FOR SELECT 
USING (auth.uid() = tourist_id);

CREATE POLICY "Users can insert own trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (auth.uid() = tourist_id);
