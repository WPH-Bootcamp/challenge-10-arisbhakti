import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tags = ["Programming", "Frontend", "Coding"];

const posts = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: "5 Reasons to Learn Frontend Development in 2025",
  excerpt:
    "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acc...",
  created: "Created 28 May 2025, 19:00",
  updated: "Last updated 28 May 2025, 19:00",
  image:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
}));

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-[#e7e9ee] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-[#e5e7eb]">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                  alt="John Doe"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-semibold">John Doe</p>
                <p className="text-sm text-[#6b7280]">Frontend Developer</p>
              </div>
            </div>
            <a href="#" className="text-sm font-semibold text-[#0b8bd3]">
              Edit Profile
            </a>
          </div>
        </section>

        <section className="mx-auto mt-6 w-full max-w-3xl">
          <div className="flex gap-6 border-b border-[#e7e9ee] text-sm">
            <button className="border-b-2 border-[#0b8bd3] px-4 pb-3 font-semibold text-[#0b8bd3]">
              Your Post
            </button>
            <button className="px-4 pb-3 text-[#6b7280]">Change Password</button>
          </div>
        </section>

        <div className="mx-auto mt-5 flex w-full max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">5 Post</span>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#0b8bd3] px-6 py-2 text-sm font-semibold text-white">
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
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Write Post
          </button>
        </div>

        <section className="mx-auto mt-6 w-full max-w-3xl space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-5 border-b border-[#e7e9ee] pb-6 sm:flex-row"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-[170px] w-full rounded-2xl object-cover sm:h-[150px] sm:w-[260px]"
              />
              <div className="flex-1 space-y-3">
                <h3 className="text-base font-semibold">{post.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={`${post.id}-${tag}`}
                      className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#6b7280]">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                  <span>{post.created}</span>
                  <span className="h-3 w-px bg-[#d1d5db]" />
                  <span>{post.updated}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <a href="#" className="font-semibold text-[#0b8bd3]">
                    Statistic
                  </a>
                  <span className="text-[#d1d5db]">|</span>
                  <a href="#" className="font-semibold text-[#0b8bd3]">
                    Edit
                  </a>
                  <span className="text-[#d1d5db]">|</span>
                  <a href="#" className="font-semibold text-[#ef4444]">
                    Delete
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
