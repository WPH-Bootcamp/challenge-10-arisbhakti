import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tags = ["Programming", "Frontend", "Coding"];

const reasons = [
  {
    title: "High Industry Demand",
    body:
      "Tech companies, startups, and even traditional businesses are constantly looking for frontend developers to help them deliver high-quality digital experiences.",
  },
  {
    title: "Powerful and Beginner-Friendly Tools",
    body:
      "Modern frameworks like React, Vue, and Svelte make it easier than ever to build interactive UIs. Their growing ecosystems and active communities mean you'll find support at every step.",
  },
  {
    title: "Creative Freedom",
    body:
      "Frontend development allows you to bring your design ideas to life. From animations to responsive layouts, your creativity directly impacts how users engage with a product.",
  },
  {
    title: "Rapid Career Growth",
    body:
      "With roles like UI Developer, React Developer, and Frontend Engineer, you'll find plenty of opportunities with competitive salaries and growth potential.",
  },
  {
    title: "Essential for Fullstack Development",
    body:
      "Understanding frontend is crucial if you want to become a fullstack developer. It complements your backend knowledge and enables you to build complete applications.",
  },
];

const comments = [
  {
    id: 1,
    name: "Clarissa",
    date: "27 Maret 2025",
    message: "This is super insightful — thanks for sharing!",
  },
  {
    id: 2,
    name: "Marco",
    date: "27 Maret 2025",
    message: "Exactly what I needed to read today. Frontend is evolving so fast!",
  },
  {
    id: 3,
    name: "Michael Sailor",
    date: "27 Maret 2025",
    message: "Great breakdown! You made complex ideas sound simple.",
  },
];

export default function DetailPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            5 Reasons to Learn Frontend Development in 2025
          </h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 overflow-hidden rounded-full bg-[#e5e7eb]">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                  alt="John Doe"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-[#111827]">
                John Doe
              </span>
            </div>
            <span>•</span>
            <span>27 May 2025</span>
          </div>
          <div className="flex items-center gap-4 border-y border-[#eef0f4] py-3 text-xs text-[#6b7280]">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.99 2.24l-1 7A2 2 0 0 1 18.85 21H7" />
                <path d="M7 10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
              </svg>
              <span>20</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              <span>20</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
            alt="Working desk"
            className="h-[220px] w-full rounded-2xl object-cover sm:h-[360px]"
          />
        </div>

        <article className="mt-6 space-y-5 text-sm leading-7 text-[#374151]">
          <p>
            Frontend development is more than just building beautiful user
            interfaces — it's about crafting user experiences that are fast,
            accessible, and intuitive. As we move into 2025, the demand for
            skilled frontend developers continues to rise.
          </p>
          <p>
            Here are 5 reasons why you should start learning frontend development
            today:
          </p>
          <ol className="space-y-4">
            {reasons.map((item, index) => (
              <li key={item.title}>
                <p className="font-semibold text-[#111827]">
                  {index + 1}. {item.title}
                </p>
                <p className="mt-1">{item.body}</p>
              </li>
            ))}
          </ol>
          <div>
            <p className="font-semibold text-[#111827]">Conclusion:</p>
            <p className="mt-2">
              If you're interested in building things that users interact with
              daily, frontend development is the path to take. Whether you're a
              designer learning to code or a backend developer exploring the
              frontend, 2025 is the perfect year to start.
            </p>
          </div>
        </article>

        <section className="mt-10 border-t border-[#eef0f4] pt-8">
          <h2 className="text-lg font-semibold">Comments(5)</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                alt="John Doe"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold">John Doe</span>
          </div>
          <p className="mt-3 text-sm text-[#6b7280]">Give your Comments</p>
          <div className="mt-3 space-y-4">
            <textarea
              placeholder="Enter your comment"
              className="h-28 w-full resize-none rounded-2xl border border-[#e1e5eb] px-4 py-3 text-sm outline-none focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
            />
            <div className="flex justify-end">
              <button className="h-11 w-32 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white">
                Send
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-6 border-t border-[#eef0f4] pt-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <img
                    src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=80&q=80"
                    alt={comment.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {comment.name}
                  </div>
                  <p className="text-xs text-[#6b7280]">{comment.date}</p>
                  <p className="mt-2 text-sm text-[#4b5563]">
                    {comment.message}
                  </p>
                </div>
              </div>
            ))}
            <a href="#" className="text-sm font-semibold text-[#0b8bd3]">
              See All Comments
            </a>
          </div>
        </section>

        <section className="mt-10 border-t border-[#eef0f4] pt-8">
          <h2 className="text-lg font-semibold">Another Post</h2>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] p-4 sm:flex-row">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              alt="Another post"
              className="h-[140px] w-full rounded-xl object-cover sm:h-[120px] sm:w-[200px]"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-base font-semibold">
                5 Reasons to Learn Frontend Development in 2025
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={`another-${tag}`}
                    className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#6b7280]">
                Frontend development is more than just building beautiful user
                interfaces — it's about crafting user experiences that are
                fast, accessible...
              </p>
              <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      alt="John Doe"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#111827]">
                    John Doe
                  </span>
                </div>
                <span>•</span>
                <span>27 May 2025</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.99 2.24l-1 7A2 2 0 0 1 18.85 21H7" />
                    <path d="M7 10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span>20</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                  <span>20</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
