import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileSpreadsheet, Globe, History, ShieldCheck, Shuffle, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — TeamGen",
  description:
    "What TeamGen is for, how it works, and the students behind it at Project Cell, Fr. Conceicao Rodrigues College of Engineering.",
};

const FEATURES = [
  {
    icon: UserPlus,
    title: "Type it or import it",
    body: "Add names one at a time, paste a whole list, or import a CSV or Excel sheet when the group is too big to type out.",
  },
  {
    icon: Shuffle,
    title: "Fair, unbiased shuffling",
    body: "Every person is dealt into a team with a proper randomized shuffle, then spread as evenly as the numbers allow.",
  },
  {
    icon: UserPlus,
    title: "Late additions welcome",
    body: "Someone shows up after teams are set? They join the smallest team automatically, without reshuffling everyone else.",
  },
  {
    icon: Trophy,
    title: "Optional scoring",
    body: "Turn on scoring to track points per team through a match or tournament, with a live leaderboard.",
  },
  {
    icon: ShieldCheck,
    title: "No account needed",
    body: "Everything works without signing in. Sign in with Google only if you want a session saved for later.",
  },
  {
    icon: FileSpreadsheet,
    title: "Take it with you",
    body: "Copy the teams as text or download a CSV once you're done generating.",
  },
];

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const DEVELOPERS = [
  {
    name: "Leroy Edison",
    role: "Core Developer",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/leroy-edison-84303933b/", icon: LinkedinMark },
      { label: "GitHub", href: "https://github.com/LeroyEdi7", icon: GithubMark },
      { label: "Previous version", href: "https://pcell-team-gen.vercel.app/", icon: History },
    ],
  },
  {
    name: "David Porathur",
    role: "Developer",
    avatarUrl: "https://github.com/41vi4p.png",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/davidporathur/", icon: LinkedinMark },
      { label: "Portfolio", href: "https://davidporathur.vercel.app/", icon: Globe },
      { label: "GitHub", href: "https://github.com/41vi4p", icon: GithubMark },
    ],
  },
];

const LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/project_cell.crce",
    icon: InstagramMark,
  },
  {
    label: "GitHub",
    href: "https://github.com/Project-Cell-CRCE",
    icon: GithubMark,
  },
  {
    label: "Website",
    href: "https://project-cell-crce.vercel.app/",
    icon: ExternalLink,
  },
];

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-14 max-w-3xl">
      <p className="text-sm font-medium text-accent mb-2">About TeamGen</p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-balance mb-4">
        Splitting a group into teams shouldn&apos;t take longer than the game itself.
      </h1>
      <p className="text-muted leading-relaxed mb-10">
        TeamGen exists for the moment right before a match, a group project, or
        a camp activity starts, when someone has to turn a pile of names into
        even teams, fast. Type names, paste a list, or drop in a spreadsheet;
        TeamGen shuffles fairly, lets latecomers join without disturbing
        anyone else, and keeps score if you need it. No account, no setup, no
        friction — sign in only if you want a session to save for next time.
      </p>

      <h2 className="font-display font-semibold text-xl mb-4">What it does</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex w-9 h-9 rounded-lg bg-accent-soft text-accent items-center justify-center mb-3">
              <Icon size={17} />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 mb-8">
        <p className="text-sm font-medium text-accent mb-2">Built by</p>
        <h2 className="font-display font-bold text-2xl mb-1">Project Cell CRCE</h2>
        <p className="text-sm text-muted mb-4">
          Fr. Conceicao Rodrigues College of Engineering
        </p>
        <p className="text-muted leading-relaxed mb-5">
          Project Cell is the innovation and development hub at Fr. Conceicao
          Rodrigues College of Engineering, Mumbai. We are a team of
          passionate students dedicated to building impactful technology
          solutions that solve real-world problems. TeamGen is one of our
          projects, built to make everyday coordination easier.
        </p>
        <div className="flex flex-wrap gap-2">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer noopener">
              <Button variant="secondary" size="sm">
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </a>
          ))}
        </div>
      </div>

      <h2 className="font-display font-semibold text-xl mb-4">Developers</h2>
      <div className="grid gap-4 mb-12">
        {DEVELOPERS.map((dev) => (
          <div
            key={dev.name}
            className="rounded-2xl border border-border bg-surface p-5 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-52">
              {"avatarUrl" in dev && dev.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dev.avatarUrl}
                  alt=""
                  className="shrink-0 w-11 h-11 rounded-full border border-border object-cover"
                />
              ) : (
                <span className="flex shrink-0 w-11 h-11 rounded-full bg-accent-soft text-accent items-center justify-center font-display font-bold">
                  {dev.name.charAt(0)}
                </span>
              )}
              <div>
                <h3 className="font-semibold">{dev.name}</h3>
                <p className="text-sm text-muted">{dev.role}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {dev.links.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer noopener">
                  <Button variant="secondary" size="sm">
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back to TeamGen
      </Link>
    </div>
  );
}
