# IshvaraX — community site

**A community for people who love to code.** Learn, collaborate and build real freelance projects together. This folder is the public website ([ishvarax.vercel.app](https://ishvarax.vercel.app)): open projects and applications, study materials, the blog, the team page, a showcase of apps the community has shipped, and the admin panel that manages all of it.

Built with Next.js 15 (App Router), Tailwind CSS v4 and a Material 3 design system. Data comes from the FastAPI backend in [`../backend`](../backend).

## Quick start

```bash
cd main
npm install
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 > .env.local   # your backend
npm run dev        # http://localhost:3000
```

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

**Deploy on Vercel:** import the repo, set **Root Directory** to `main`, and add `NEXT_PUBLIC_API_BASE_URL=https://<your-backend>` (plus `NEXT_PUBLIC_SITE_URL` if the domain isn't `ishvarax.vercel.app`). Region and build settings are in [vercel.json](vercel.json).

Pages: `/` home · `/projects` · `/learnings` · `/blog` · `/login` · `/register` · `/profile` · `/reset-password` · `/admin` (sign in as `admin`).

---

## Social post templates

Copy, replace the `{{PLACEHOLDERS}}`, post. Every template links back to the site so the call-to-action is always the same: *join, browse, apply, build.*

### Fill-in cheat sheet

| Placeholder | Where to get it |
|---|---|
| `{{SITE}}` | `https://ishvarax.vercel.app` |
| `{{PROJECTS_URL}}` | `https://ishvarax.vercel.app/projects` |
| `{{LEARNINGS_URL}}` | `https://ishvarax.vercel.app/learnings` |
| `{{BLOG_URL}}` | `https://ishvarax.vercel.app/blog/<post-id>` (copy from the address bar) |
| `{{JOIN_URL}}` | `https://ishvarax.vercel.app/register` |
| `{{APP_URL}}` | Play Store link for *Fit by IshvaraX* once published |
| `{{PROJECT_TITLE}}`, `{{SKILLS}}`, `{{DURATION}}`, `{{STIPEND}}` | From the project card on `/projects` |
| `{{POST_TITLE}}`, `{{ONE_LINE_TAKEAWAY}}` | From the blog post |
| `{{PRODUCT_NAME}}`, `{{TAGLINE}}`, `{{BUILDER}}` | From the product tile on the home page |

**Voice:** plain, warm, specific. No hype words ("revolutionary", "10x"), no guilt. Lead with what the reader gets, close with one link. Skills, durations and stipends must match what's on the site. PINAKA is a separate research side project — don't fold it into community posts.

### Hashtag sets

```text
#IshvaraX #LearnToCode #CodingCommunity #BuildInPublic #OpenSource #DevCommunity
```
```text
#100DaysOfCode #WebDevelopment #Programming #SoftwareEngineering #TechIndia #StudentDevelopers
```
```text
#FitByIshvaraX #LevelUp #HabitTracker #SelfImprovement #DevLife #Discipline
```

Use 5–10 on Instagram, 1–2 on X and LinkedIn, none on Reddit.

---

### 1. Introduce IshvaraX (evergreen)

**Instagram — caption**
```text
What if learning to code came with a team?

IshvaraX is a community for people who love to code. You sign up, tell us the skills you like building with, and apply to real open projects with your own work. Then you build them, together, with people who care about shipping.

Real projects. Study materials organised by topic. A blog written by people in the middle of the same journey.

No course to buy. No gatekeeping. Just work worth doing and people to do it with.

Link in bio: {{SITE}}

#IshvaraX #LearnToCode #CodingCommunity #BuildInPublic #DevCommunity #StudentDevelopers
```

**X / Twitter — single post**
```text
IshvaraX is a community for people who love to code.

Sign up, pick the skills you love, apply to real open projects with your work, and build them with the community.

Projects, study materials, blog: {{SITE}}
```

**X / Twitter — thread**
```text
1/ We started IshvaraX because most of us learned to code alone — tutorials, then silence. Here's what we're building instead.

2/ Open projects. Real briefs with the skills, duration and (when there is one) stipend listed up front. You apply with links to your own work: {{PROJECTS_URL}}

3/ Learnings. Study materials organised by section and topic, so you can go from "I want to learn X" to actually learning X: {{LEARNINGS_URL}}

4/ A blog by people mid-journey, not gurus. Write-ups of what we built and what broke.

5/ The rule is simple: level up on real work, then help the next person do the same.

Join in a minute: {{JOIN_URL}}
```

**Reddit** (r/learnprogramming, r/developersIndia, r/webdev — read each sub's self-promo rule first; most want a text post that gives value before the link)
```text
Title: We built a small community where beginners apply to real projects instead of only doing tutorials

Body:
A few of us kept noticing the same gap: after the tutorials end, there's nothing to build with other people, and no one to review your work.

So we made IshvaraX — a free community site where:
- open projects are listed with the skills, duration and stipend (if any) up front,
- you apply with links to your own work, not a CV,
- study materials are organised by topic,
- the blog is written by members, about things they actually shipped.

It's early and small on purpose. If you're learning and want something real to point to, have a look: {{SITE}}

Happy to answer questions about how we run projects or how the site was built (Next.js + FastAPI, all of it by the community).
```

**LinkedIn**
```text
Most people learn to code alone. We're trying to change that.

IshvaraX is a community for people who love to code. Members pick the skills they want to grow, apply to real open projects with their own work, and build those projects together — with reviews, deadlines and something to put in a portfolio at the end.

What's on the site today:
• Open projects with skills, duration and stipend listed up front
• Study materials organised by topic
• A member-written blog about what we build and what breaks

If you're a student, a self-taught developer, or someone who wants to mentor on a real project, you're welcome: {{SITE}}

#IshvaraX #CodingCommunity
```

---

### 2. New open project — call for applicants

**Instagram — caption**
```text
Open project: {{PROJECT_TITLE}}

What you'll build: {{ONE_LINE_DESCRIPTION}}
Skills: {{SKILLS}}
Duration: {{DURATION}}
Stipend: {{STIPEND}}

How to apply: create your IshvaraX account, open the project, and share links to work you've done — a repo, a demo, a design, anything real.

Apply at {{PROJECTS_URL}} (link in bio)

#IshvaraX #OpenProject #LearnToCode #BuildInPublic #{{PRIMARY_SKILL_HASHTAG}}
```

**X / Twitter**
```text
New open project on IshvaraX: {{PROJECT_TITLE}}

Skills: {{SKILLS}}
Duration: {{DURATION}} · Stipend: {{STIPEND}}

Apply with links to your own work: {{PROJECTS_URL}}
```

**Reddit** (r/forhire-style subs need their tag format; community subs prefer a plain post)
```text
Title: [Open project] {{PROJECT_TITLE}} — {{SKILLS}} — {{DURATION}}, {{STIPEND}}

Body:
We're a small coding community (IshvaraX) and we've opened a new project for members to build together.

What it is: {{TWO_TO_THREE_SENTENCES}}
Skills: {{SKILLS}}
Duration: {{DURATION}}
Stipend: {{STIPEND}}
Who it suits: {{BEGINNER_FRIENDLY_OR_LEVEL}}

Apply by creating a free account and sharing links to your work (no CV): {{PROJECTS_URL}}
Questions welcome in the comments.
```

**LinkedIn**
```text
We've opened a new project at IshvaraX and we're looking for people to build it with us.

{{PROJECT_TITLE}}
{{TWO_TO_THREE_SENTENCES}}

Skills: {{SKILLS}}
Duration: {{DURATION}}
Stipend: {{STIPEND}}

You apply with your work, not a résumé — a repo, a live demo, a case study. Details and the apply button: {{PROJECTS_URL}}
```

**WhatsApp / Telegram / Discord broadcast**
```text
New project on IshvaraX: {{PROJECT_TITLE}}
Skills: {{SKILLS}} | {{DURATION}} | Stipend: {{STIPEND}}
Apply with your work: {{PROJECTS_URL}}
```

---

### 3. New blog post or learning resource

**Instagram — caption**
```text
New on the IshvaraX blog: {{POST_TITLE}}

{{ONE_LINE_TAKEAWAY}}

Written by a member, about something they actually built. Read it at {{BLOG_URL}} (link in bio).

#IshvaraX #LearnToCode #Programming #DevBlog
```

**X / Twitter**
```text
{{POST_TITLE}}

{{ONE_LINE_TAKEAWAY}}

Read: {{BLOG_URL}}
```

**X / Twitter — learning resource**
```text
Added to IshvaraX Learnings: {{RESOURCE_TITLE}} ({{SECTION}} → {{CATEGORY}})

{{WHY_IT_IS_WORTH_YOUR_TIME}}

{{LEARNINGS_URL}}
```

**Reddit** (post the actual lesson in the body; the link is secondary)
```text
Title: {{POST_TITLE_AS_A_QUESTION_OR_LESSON}}

Body:
{{THREE_TO_FIVE_PARAGRAPHS_OF_THE_ACTUAL_CONTENT}}

I wrote this up in more detail (with code) on our community blog: {{BLOG_URL}}
```

---

### 4. Fit by IshvaraX — the app

**Instagram — launch caption**
```text
We built an app. It's called Fit by IshvaraX.

Pick your focus areas — fitness, nutrition, discipline, recovery. Each day you get a short list of real tasks: run 1.4 km, drink 2 litres, read 15 pages, sleep 7–8 hours. Tick them off and your life stats go up: Strength, Intelligence, Looks, Career, Skill, Discipline.

Four good days in a week and you level up. The targets get a little harder. That's it.

No feed. No ads. Your progress stays on your phone.

Built end-to-end by the IshvaraX community. Download: {{APP_URL}} (link in bio)

#FitByIshvaraX #LevelUp #HabitTracker #SelfImprovement #IshvaraX #BuildInPublic
```

**X / Twitter**
```text
Fit by IshvaraX is out.

A habit tracker that treats your life like a character sheet: daily tasks → XP → six life stats → level up.

No feed, no ads, offline-first. Built by our coding community.

Android: {{APP_URL}}
```

**Reddit** (r/androidapps, r/SideProject, r/getdisciplined — check flair + self-promo days)
```text
Title: I built a free habit tracker that turns daily tasks into RPG-style life stats (Android)

Body:
Fit by IshvaraX is a small tracker our coding community built and shipped together.

How it works:
- You pick focus areas: fitness, nutrition, discipline, recovery.
- Every day you get a short task list (e.g. run 1.4 km, drink 2 L water, read 15 pages, sleep 7–8 h).
- Finishing tasks gives XP and raises six life stats (strength, intelligence, looks, career, skill, discipline), shown on a radar chart.
- Hit 60% of tasks and the day counts; four good days in a week = level up, and targets scale up a little.
- Streaks reset on any day under 60% (or a skipped day). That's the only "punishment".

What it is not: no social feed, no ads, no notification spam. Data is stored on the device.

Stack, for the curious: Expo / React Native, Material 3 UI, FastAPI backend for accounts.

Download: {{APP_URL}}
Feedback very welcome — especially on the task targets.
```

**LinkedIn**
```text
Our community shipped its first app.

Fit by IshvaraX is a habit tracker with a simple idea: treat your life like a character sheet. Daily tasks earn XP, raise six life stats, and four good days a week level you up.

It was designed, built and published entirely by IshvaraX members — a group that learns by building real things together. Expo / React Native on the front, FastAPI on the back.

Try it: {{APP_URL}}
Join the community that built it: {{SITE}}

#IshvaraX #BuildInPublic #ReactNative
```

**Play Store — short description (80 chars max)**
```text
Daily tasks, real stats, level up your life. No feed, no ads, offline-first.
```

---

### 5. Weekly progress share (for members posting their share card)

The app's **Share** tab exports a card with your radar, stats, level and streak. Pair it with one of these.

**Instagram — story / caption**
```text
Week {{N}} on Fit by IshvaraX.
Level {{LEVEL}} · {{STREAK}}-day streak
Biggest gain: {{STAT}} (+{{POINTS}})

Small reps, every day. Join me: {{APP_URL}}

#FitByIshvaraX #LevelUp #Discipline
```

**X / Twitter**
```text
Level {{LEVEL}}, {{STREAK}}-day streak. {{STAT}} is finally moving.

Tracking with Fit by IshvaraX — daily tasks, six life stats, nothing else. {{APP_URL}}
```

---

### 6. Community product showcase ("built by a member")

Use when a product is added to the home-page showcase.

**Instagram — caption**
```text
Built by the community: {{PRODUCT_NAME}}

{{TAGLINE}}

Made by {{BUILDER}}, now live on the IshvaraX home page alongside the other things members have shipped.

Try it: {{PRODUCT_LINK}} (link in bio)
See what else we've built: {{SITE}}

#IshvaraX #BuildInPublic #IndieDev #{{PLATFORM_HASHTAG}}
```

**X / Twitter**
```text
Built by an IshvaraX member: {{PRODUCT_NAME}} — {{TAGLINE}}

Every app on our home page started as a community project.

{{PRODUCT_LINK}}
```

**LinkedIn**
```text
Proud to feature {{PRODUCT_NAME}} on the IshvaraX home page.

{{TAGLINE}} Built by {{BUILDER}} with the community — from first commit to {{PLATFORM}} release.

Try it: {{PRODUCT_LINK}}

This is what IshvaraX is for: real projects, shipped together. {{SITE}}
```

---

### 7. Call for mentors and reviewers

**X / Twitter**
```text
If you've shipped production code and have 1–2 hours a week, IshvaraX needs reviewers.

You'd review PRs and give feedback on real community projects built by people who are learning. No lectures, just code review.

Say hi: {{JOIN_URL}}
```

**LinkedIn**
```text
Looking for a low-commitment way to give back?

IshvaraX is a community where people learn to code by building real projects together. The thing we're short on isn't learners — it's experienced developers willing to review a pull request and leave honest comments once or twice a week.

If that's you, create an account and tell us your skills; we'll match you with a project: {{JOIN_URL}}

#IshvaraX #Mentorship #CodeReview
```

---

### Platform cheat sheet

| Platform | Limits & etiquette |
|---|---|
| **Instagram** | Caption ≤ 2,200 chars, first line is the hook (shows before "more"). Links aren't clickable — keep `{{SITE}}` in the bio and say "link in bio". Square or 4:5 image; the app's share card and a screenshot of the project tile work well. |
| **X / Twitter** | 280 chars per post. One link per post; put it last. Threads: number them, one idea per post, link in the final post. |
| **Reddit** | Value first, link last. Read the subreddit's self-promotion rule and use the right flair; many allow one promo post per ~10 contributions. Reply to every comment. |
| **LinkedIn** | ~1,300 chars before "see more"; short paragraphs, 1–3 hashtags at the end. Posts without an external link in the body tend to reach further — put the link in the first comment if reach drops. |
| **WhatsApp / Telegram / Discord** | Three lines max: what, who it's for, link. |
| **Play Store** | Short description 80 chars, full description 4,000 chars — reuse the app's "What it does" section from [../app/README.md](../app/README.md). |
