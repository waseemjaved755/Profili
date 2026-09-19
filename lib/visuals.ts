export type ResumeProfile = {
  src: string;
  name: string;
  firstName: string;
  initials: string;
  role: string;
  handle: string;
  fileName: string;
  skills: string[];
  question: string;
  answer: string;
};

export const resumes: ResumeProfile[] = [
  {
    src: "/Resumes-Hero/steve-jobs-resume-drafts-steve-jobs-resume.webp",
    name: "Steve Jobs",
    firstName: "Steve",
    initials: "SJ",
    role: "Founder · Apple",
    handle: "steve",
    fileName: "steve-jobs.pdf",
    skills: ["Calligraphy", "Apple", "Atari", "Product", "Type"],
    question: "Reed lasted six months. Why stay for calligraphy?",
    answer:
      "I dropped out, but I slept on floors and kept going to class. Calligraphy had no practical use. Ten years later it was the Mac’s typefaces: spacing, serif and sans, the whole feeling of the page.",
  },
  {
    src: "/Resumes-Hero/54963381fe52190dd1cf00f18416c7f196d8122505e73863.png",
    name: "Elon Musk",
    firstName: "Elon",
    initials: "EM",
    role: "Founder · SpaceX",
    handle: "elon",
    fileName: "elon-musk.pdf",
    skills: ["SpaceX", "Tesla", "Orbit", "Energy", "Robotics"],
    question: "When did SpaceX actually reach orbit?",
    answer:
      "Falcon 1 failed three times. The fourth flight in 2008 made orbit, the first privately funded liquid-fuel rocket to do it. We had the cash for one more attempt. After that, NASA’s COTS contract kept us alive.",
  },
  {
    src: "/Resumes-Hero/image.png",
    name: "Violet Rodriguez",
    firstName: "Violet",
    initials: "VR",
    role: "Sr. Software Engineer",
    handle: "violet",
    fileName: "violet-rodriguez.pdf",
    skills: ["React", "TypeScript", "AWS", "Postgres", "ChatEngine"],
    question: "Tell me about the chatbot work and the Postgres migration.",
    answer:
      "At NextGen I shipped AI chatbot flows for a SaaS product. At Tech Innovations I lead full-stack on React and AWS, including a zero-downtime Postgres cutover with dual-write. ChatEngine is the open-source thread through it.",
  },
];

export const visuals = {
  resumes,
  candidate:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  recruiter:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
  studio:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
  desk:
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
  mixing:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
  meeting:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
  laptop:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  handshake:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  city:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
  headphones:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
};

export const gallery = [
  { src: visuals.candidate, label: "Staff engineer voice" },
  { src: visuals.recruiter, label: "Live recruiter session" },
  { src: visuals.studio, label: "Voice studio" },
  { src: visuals.desk, label: "Resume ingest" },
  { src: visuals.mixing, label: "Tone board" },
  { src: visuals.meeting, label: "Hiring loop" },
  { src: visuals.laptop, label: "Architecture notes" },
  { src: visuals.headphones, label: "24/7 voice" },
];
