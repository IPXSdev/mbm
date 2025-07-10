-- Insert sample episodes
INSERT INTO public.episodes (title, artist, description, duration, audio_url, image_url, plays, published_at, featured) VALUES
('The Making of Midnight Dreams', 'Luna Rodriguez', 'Luna shares the emotional journey behind her breakthrough single and how late-night studio sessions shaped her sound.', '45:32', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 12500, '2024-01-15 10:00:00', true),
('From Bedroom Producer to Chart Topper', 'Alex Chen', 'Alex discusses his transition from making beats in his bedroom to producing for major artists.', '38:15', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 8900, '2024-01-08 14:30:00', false),
('The Art of Storytelling Through Music', 'Sarah Williams', 'Country singer-songwriter Sarah explores how personal experiences become universal stories in her music.', '52:18', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 15200, '2024-01-01 17:00:00', true),
('Electronic Soundscapes and Emotion', 'Marcus Thompson', 'Electronic artist Marcus reveals how he creates emotional depth in instrumental compositions.', '41:27', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 6700, '2023-12-25 12:00:00', false);

-- Insert sample tracks
INSERT INTO public.tracks (title, artist, genre, description, file_url, image_url, plays, likes, shares, status, priority) VALUES
('Midnight Dreams', 'Luna Rodriguez', 'indie', 'A dreamy indie track with ethereal vocals and shimmering guitars.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 45230, 3420, 890, 'approved', 'high'),
('Electric Nights', 'Marcus Thompson', 'electronic', 'Pulsing electronic beats with atmospheric synths.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 38950, 2890, 720, 'approved', 'medium'),
('Country Roads Home', 'Sarah Williams', 'country', 'A heartfelt country ballad about finding your way back home.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 35670, 4120, 1200, 'approved', 'medium'),
('Beat Drop', 'Alex Chen', 'hip-hop', 'Hard-hitting hip-hop track with intricate production.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 32100, 2650, 580, 'approved', 'low'),
('Acoustic Soul', 'Jamie Park', 'folk', 'Raw acoustic performance with soulful vocals.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 28900, 3200, 650, 'approved', 'medium'),
('Neon Lights', 'DJ Pulse', 'electronic', 'An energetic electronic track with pulsing synths and driving beats.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 0, 0, 0, 'pending', 'high'),
('Mountain Song', 'River Valley', 'folk', 'A heartfelt folk ballad inspired by hiking through the Rocky Mountains.', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/placeholder.svg?height=300&width=300', 0, 0, 0, 'under_review', 'medium');

-- Insert sample products
INSERT INTO public.products (name, artist, price, original_price, description, image_url, category, in_stock, featured) VALUES
('Luna Rodriguez - Midnight Dreams Vinyl', 'Luna Rodriguez', 29.99, 34.99, 'Limited edition vinyl of the hit single Midnight Dreams', '/placeholder.svg?height=300&width=300', 'Vinyl', true, true),
('MBTM Logo T-Shirt', 'Man Behind The Music', 24.99, null, 'Official Man Behind The Music logo t-shirt', '/placeholder.svg?height=300&width=300', 'Apparel', true, false),
('Sarah Williams - Country Roads Poster', 'Sarah Williams', 19.99, null, 'Beautiful poster featuring artwork from Country Roads Home', '/placeholder.svg?height=300&width=300', 'Posters', true, false),
('Electronic Beats Hoodie', 'Marcus Thompson', 49.99, null, 'Comfortable hoodie with electronic-inspired design', '/placeholder.svg?height=300&width=300', 'Apparel', false, false),
('MBTM Premium Headphones', 'Man Behind The Music', 149.99, 199.99, 'High-quality headphones for the ultimate listening experience', '/placeholder.svg?height=300&width=300', 'Accessories', true, true),
('Alex Chen - Beat Drop CD', 'Alex Chen', 14.99, null, 'Physical CD of the acclaimed Beat Drop album', '/placeholder.svg?height=300&width=300', 'CD', true, false);

-- Insert sample announcements
INSERT INTO public.announcements (title, content, type, pinned, urgent) VALUES
('New Episode: Behind the Scenes with Luna Rodriguez', 'We''re excited to announce our latest episode featuring Luna Rodriguez discussing the making of her hit single ''Midnight Dreams''. This intimate conversation reveals the creative process, late-night studio sessions, and the emotional journey behind one of this year''s most compelling tracks.', 'Episode Release', true, false),
('Submission Guidelines Update', 'We''ve updated our music submission guidelines to better serve our artist community. New features include faster review times, expanded genre categories, and improved feedback systems. All existing submissions will be grandfathered under the previous guidelines.', 'Platform Update', true, true),
('January Leaderboard Winners Announced', 'Congratulations to our top performers this month! Luna Rodriguez takes the #1 spot with ''Midnight Dreams'', followed by Marcus Thompson''s ''Electric Nights'' and Sarah Williams'' ''Country Roads Home''. Winners receive featured placement and exclusive merchandise.', 'Leaderboard', false, false),
('New Merch Drop: Limited Edition Vinyl Collection', 'Our exclusive vinyl collection featuring top tracks from our featured artists is now available in the store. Limited quantities available - each vinyl comes with signed artwork and exclusive behind-the-scenes content.', 'Store Update', false, false),
('Scheduled Maintenance: January 20th', 'We''ll be performing scheduled maintenance on January 20th from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience.', 'Maintenance', false, true);
