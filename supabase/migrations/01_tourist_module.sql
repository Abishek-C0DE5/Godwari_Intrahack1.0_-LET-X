-- 1. Create destinations table
CREATE TABLE public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add new columns to profiles table for guides and hotels
ALTER TABLE public.profiles 
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN description TEXT,
  ADD COLUMN location TEXT,
  ADD COLUMN specialties TEXT,
  ADD COLUMN price TEXT,
  ADD COLUMN rating NUMERIC DEFAULT 0;

-- 3. Set up RLS for destinations
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view destinations" 
ON public.destinations 
FOR SELECT 
USING (true);

-- 4. Insert mock destinations
INSERT INTO public.destinations (name, description, image_url, location) VALUES
('Pokhara', 'The tourism capital of Nepal, known for its lakes and stunning views of the Annapurna range.', 'https://images.unsplash.com/photo-1605640840428-df407887d1df?auto=format&fit=crop&q=80', 'Pokhara'),
('Kathmandu', 'The capital city, full of ancient temples, bustling streets, and rich history.', 'https://images.unsplash.com/photo-1582650117496-e2db2ef6a928?auto=format&fit=crop&q=80', 'Kathmandu'),
('Chitwan', 'Famous for its national park and wildlife safaris.', 'https://images.unsplash.com/photo-1589136777351-fdc9c8cb2555?auto=format&fit=crop&q=80', 'Chitwan'),
('Mustang', 'A remote and beautiful region with unique landscapes and Tibetan culture.', 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80', 'Mustang'),
('Lumbini', 'The birthplace of Lord Buddha, a major pilgrimage site.', 'https://images.unsplash.com/photo-1583162786358-0056910609ac?auto=format&fit=crop&q=80', 'Lumbini');

-- 5. Insert mock Guides and Hotels (using dummy UUIDs for auth.users dependency)
-- Note: In Supabase, inserting into profiles usually requires a matching auth.users row.
-- For the sake of this mock data, we will bypass the foreign key constraint just for the MVP by dropping the FK temporarily.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO public.profiles (id, name, email, role, location, specialties, rating, price, avatar_url, description) VALUES
(gen_random_uuid(), 'Ram Gurung', 'ram@example.com', 'guide', 'Pokhara', 'Adventure + Hiking', 4.8, 'NPR 2500/day', 'https://images.unsplash.com/photo-1544168190-79c15427008f?auto=format&fit=crop&q=80', 'Experienced local guide specialized in Annapurna base camp and short hikes around Pokhara.'),
(gen_random_uuid(), 'Sita Thapa', 'sita@example.com', 'guide', 'Kathmandu', 'Culture + Photography', 4.9, 'NPR 3000/day', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', 'Passionate about sharing the hidden temples and rich history of the Kathmandu valley.'),
(gen_random_uuid(), 'Hotel Himalayan', 'contact@hotelhimalayan.com', 'hotel', 'Pokhara', NULL, 4.7, 'NPR 4500/night', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'A luxury stay with a perfect view of Phewa Lake and the mountains. Free WiFi, Breakfast included.'),
(gen_random_uuid(), 'Kathmandu Heritage Resort', 'info@ktmheritage.com', 'hotel', 'Kathmandu', NULL, 4.5, 'NPR 6000/night', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Experience traditional Newari architecture with modern comforts right in the heart of the city.');
