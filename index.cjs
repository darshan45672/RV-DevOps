const { execSync } = require("child_process");

const filename = "index.cjs";

// Date range
const startDate = new Date("2026-02-19T11:00:00");
const endDate = new Date("2026-03-13T11:00:00");

// Realistic commit messages
const messages = [
  "Refactor service layer logic",
  "Fix validation edge case",
  "Improve API response structure",
  "Optimize database query",
  "Enhance UI responsiveness",
  "Cleanup unused variables",
  "Fix minor styling issue",
  "Update environment configuration",
  "Improve error handling",
  "Add missing null checks",
  "Refactor reusable components",
  "Fix state update bug",
  "Improve performance of data mapping",
  "Update documentation",
  "Minor UX improvements",
  "Adjust layout spacing",
  "Improve loading state handling",
  "Fix pagination issue",
  "Optimize image rendering",
  "Enhance form validation logic",
];

const getRandomMessage = () =>
  messages[Math.floor(Math.random() * messages.length)];

let currentDate = new Date(startDate);

while (currentDate <= endDate) {
  const isoDate = currentDate.toISOString().split(".")[0];

  // Modify file so Git detects change
  execSync(`echo "Update on ${isoDate}" >> ${filename}`);

  // Stage file
  execSync(`git add ${filename}`, { stdio: "inherit" });

  // Random message
  const message = getRandomMessage();
  const commitCommand = `git commit -m "${message}"`;

  // Set custom commit date
  const env = {
    ...process.env,
    GIT_AUTHOR_DATE: isoDate,
    GIT_COMMITTER_DATE: isoDate,
  };

  execSync(commitCommand, { stdio: "inherit", env });

  console.log(`✅ ${isoDate} → ${message}`);

  // Move to next day
  currentDate.setDate(currentDate.getDate() + 1);
}

// Push everything
execSync(`git push`, { stdio: "inherit" });

console.log("🚀 All commits from Dec 23, 2025 to Feb 11, 2026 pushed!");Update on 2026-02-19T05:30:00
Update on 2026-02-20T05:30:00
Update on 2026-02-21T05:30:00
Update on 2026-02-22T05:30:00
Update on 2026-02-23T05:30:00
Update on 2026-02-24T05:30:00
Update on 2026-02-25T05:30:00
Update on 2026-02-26T05:30:00
Update on 2026-02-27T05:30:00
Update on 2026-02-28T05:30:00
Update on 2026-03-01T05:30:00
Update on 2026-03-02T05:30:00
Update on 2026-03-03T05:30:00
Update on 2026-03-04T05:30:00
Update on 2026-03-05T05:30:00
Update on 2026-03-06T05:30:00
Update on 2026-03-07T05:30:00
Update on 2026-03-08T05:30:00
Update on 2026-03-09T05:30:00
Update on 2026-03-10T05:30:00
Update on 2026-03-11T05:30:00
Update on 2026-03-12T05:30:00
