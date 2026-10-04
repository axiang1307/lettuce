-- Profile pictures live in Storage; profiles.avatar_url holds only the object path
-- ("<user_id>/<file>"). The bucket is public, so reads go through the public URL and
-- need no SELECT policy for viewers.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/heic', 'image/webp'])
on conflict (id) do nothing;

-- A signed-in user may only touch objects under their own "<user_id>/" prefix.
-- SELECT is needed alongside DELETE so the Storage API can find the row it removes.
create policy "avatars: owner can read own folder"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "avatars: owner can upload to own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "avatars: owner can delete own files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
