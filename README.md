# Elevation Teenz website

A static website for Elevation Teenz (Teenz Nation), the teenage ministry of The Elevation Church.
It has no build step and no server code. Open `index.html` in a browser, or upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel hosting).

## Folder structure

```
elevation-teenz-site/
├── index.html        Page shell: header, main area, footer, and script/style links
├── css/
│   └── styles.css    All styling (colours and fonts are set at the top in :root)
├── js/
│   ├── config.js     Supabase URL + anon key for Connect
│   ├── content.js    All site content: topics, lessons, series, verses, programs, events, prayer samples
│   ├── expressions.js Every TEC expression worldwide (used in sign-up and directories)
│   ├── connect.js    Connect: sign up/log in, mentors, teen friends, chat, groups, leader tools
│   └── app.js        Page logic: routing, page templates, search, progress, journal, quiz, streaks, badges
├── supabase/
│   └── schema.sql    Database tables + security rules for Connect (run once in Supabase)
└── assets/           Logo and photos (from @elevationteenz on Instagram)
```

## Pages

Pages are switched with the address hash, e.g. `index.html#hub`, `#lesson-love`, `#program-navigate`, `#events`.

## Common edits

- **Add a study:** in `js/content.js`, give a topic `lesson:true` and `mins:15` in `TOPICS`, then add its lesson to `LESSONS`
  using the same 10-part shape (hook, verses, teaching, character, questions, memory, challenge, prayer, quiz).
- **Events / Sunday dates:** edit `EVENTS` in `js/app.js` (search for `const EVENTS`).
- **Programs (Navigate, Accelerate):** edit `PROGRAMS` in `js/app.js`.
- **Links & socials:** edit `LINKS` in `js/app.js`.
- **FAQ and Instagram quotes:** edit `FAQ` and `QUOTES` in `js/app.js`.
- **Colours / fonts:** edit the `:root` block at the top of `css/styles.css`.

## Still to fill in

Items marked with an orange "Placeholder" tag on the site: leader names and photos, Accelerate details,
giving details, contact email, and confirmation of the Sunday service dates.

## Prototype limits

Progress, streaks, journals and reminders are saved in the visitor's browser (localStorage) only.
Sign-up, registration, prayer-request and testimony forms don't send anything yet; they need a backend
(e.g. a form service or database) and accounts before launch.

## Hosting on GitHub Pages

1. Create a new public repository on GitHub (for example `elevation-teenz`). Don't add a README.
2. Upload everything in this folder to it (drag the files and folders into "uploading an existing file"), including `.nojekyll`.
3. In the repository, go to **Settings → Pages**, set **Source** to "Deploy from a branch", pick **main** and **/ (root)**, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/elevation-teenz/`.

## Connect (accounts, mentors, friends, groups)

Connect uses [Supabase](https://supabase.com) for secure login and data. All safety rules live in the
database (`supabase/schema.sql`), so they hold even if someone tampers with the website code:

- Teens (12–19) and counselors (18+) sign up and choose their expression.
- Counselors are invisible to teens until a leader approves them.
- Teens under 18 can't send messages or posts until a leader confirms a parent or guardian's OK.
- Chats are only between a teen and their active mentor, or between teens who accepted a friend request.
- Messages and posts can't contain phone numbers, emails, links or social handles.
- Leaders can read all chats, approve posts, handle reports and pause accounts.

### Setup
1. Create a free Supabase project.
2. In **SQL Editor**, paste all of `supabase/schema.sql` and run it.
3. In **Authentication → URL Configuration**, set Site URL to `https://timothy7380.github.io/elevation-teenz/`
   and add the same URL under Redirect URLs.
4. In **Project Settings → API**, copy the Project URL and the `anon` public key into `js/config.js`.
5. Sign up on the site, then make yourself a leader by running the snippet at the bottom of `schema.sql`
   with your email.

### Updating expressions
Edit `js/expressions.js`, then add the same id/name/city/country to the `insert into public.expressions` list
in `schema.sql` and re-run that insert in the SQL Editor.
