-- Add activities column to destinations
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS activities TEXT[] DEFAULT '{}';

-- Update mock data with adventure/activity tags
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Paragliding', 'Boating', 'Nature'] WHERE name = 'Pokhara';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Heritage', 'City Tour', 'Food'] WHERE name = 'Kathmandu';
UPDATE public.destinations SET activities = ARRAY['Wildlife', 'Safari', 'Nature', 'Culture'] WHERE name = 'Chitwan';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Culture', 'Off-road', 'Adventure'] WHERE name = 'Mustang';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Heritage', 'Pilgrimage', 'Peace'] WHERE name = 'Lumbini';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Adventure', 'Mountaineering', 'Nature'] WHERE name = 'Everest Base Camp';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Heritage', 'Art', 'Food'] WHERE name = 'Bhaktapur';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Heritage', 'Art', 'City Tour'] WHERE name = 'Patan';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Adventure', 'Culture'] WHERE name = 'Namche Bazaar';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Nature', 'Boating', 'Peace'] WHERE name = 'Rara Lake';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Nature', 'Hiking'] WHERE name = 'Bandipur';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Hiking', 'Nature'] WHERE name = 'Ghandruk';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Adventure', 'Nature'] WHERE name = 'Tilicho Lake';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Nature', 'Photography'] WHERE name = 'Poon Hill';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Nature', 'Adventure'] WHERE name = 'Gokyo Lakes';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Pilgrimage', 'City Tour'] WHERE name = 'Swayambhunath';
UPDATE public.destinations SET activities = ARRAY['Hiking', 'Nature', 'Culture'] WHERE name = 'Langtang Valley';
UPDATE public.destinations SET activities = ARRAY['Culture', 'Pilgrimage', 'Peace'] WHERE name = 'Boudhanath';
UPDATE public.destinations SET activities = ARRAY['Nature', 'Photography', 'Peace'] WHERE name = 'Nagarkot';
UPDATE public.destinations SET activities = ARRAY['Wildlife', 'Safari', 'Nature', 'Adventure'] WHERE name = 'Bardiya';
