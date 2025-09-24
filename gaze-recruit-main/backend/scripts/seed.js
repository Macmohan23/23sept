import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = {
    software_developer: [
      'Explain the JavaScript event loop.',
      'What is a closure in JavaScript and when would you use it?',
      'Describe how promises and async/await work.',
      'Difference between var, let, and const?',
      'Explain prototypal inheritance in JavaScript.',
      'How does debouncing differ from throttling?',
      'What are pure functions and why are they useful?',
      'Explain immutability and how to enforce it.',
      'What is the purpose of a package-lock.json?',
      'How would you optimize a React app performance-wise?',
      'You join a project with 60% test coverage and frequent regressions. What is your 30-60-90 day plan to improve reliability?',
      'An endpoint used by the mobile app occasionally times out under load. How do you diagnose and fix it end-to-end?',
      'Design a rate-limited public API for file uploads. How do you secure it and prevent abuse?',
      'You need to implement feature flags for a live app. Describe architecture, rollout strategy, and safeguards.',
      'A memory leak appears in production Node.js service. How do you identify the root cause and patch it?'
    ],
    data_analyst: [
      'How would you handle missing values in a dataset?',
      'Explain the difference between inner and left joins.',
      'What steps do you take to validate a data model?',
      'Explain normalization and when to denormalize.',
      'What is the difference between correlation and causation?',
      'How do you detect outliers?',
      'Describe a time you built a dashboard. What KPIs did you select?',
      'What is A/B testing and how do you analyze results?',
      'How do you choose the right visualization for data?',
      'Given a dataset with customer events (views, add_to_cart, purchase), outline a funnel analysis and key drop-off insights.',
      'Your forecast model is underperforming after a new product launch. How do you update the model and validate improvements?',
      'A stakeholder claims a campaign improved conversions. Describe the experiment you would design to verify this.',
      'You are asked for a “single source of truth” metric definition. How do you standardize and document it across teams?'
    ],
    designer: [
      'How do you approach user research for a new feature?',
      'What is your process for creating a design system?',
      'How do you measure design success?',
      'What are the principles of good UX writing?',
      'How do you ensure accessibility (a11y) in designs?',
      'Explain the difference between low-fi and hi-fi prototypes.',
      'How do you collaborate with engineers effectively?',
      'What is your approach to responsive design?',
      'A checkout flow shows high abandonment at the address step. What research and design changes would you propose?',
      'Design a mobile-first dashboard for on-the-go executives. What are your content and layout priorities?',
      'A new accessibility audit shows contrast and keyboard nav issues. How do you prioritize and fix them?',
      'Handing off to engineering often causes mismatches. What would you change in the Figma and specs process?'
    ],
    product_manager: [
      'How do you prioritize features in a roadmap?',
      'Describe a time you handled conflicting stakeholder requirements.',
      'How do you measure product-market fit?',
      'What is your approach to writing user stories and acceptance criteria?',
      'How do you define and track OKRs?',
      'Describe a product launch you led.',
      'How do you conduct user interviews?',
      'Your activation rate is flat while signups are rising. What hypotheses do you form and how do you test them?',
      'Two strategic initiatives both need the same team. How do you decide and communicate prioritization?',
      'Build a PRD for a "Saved Reports" feature for analytics users. What is in scope and out of scope?',
      'Your NPS dropped by 10 points this quarter. How do you investigate and respond?'
    ],
    marketing_specialist: [
      'How do you design an A/B test for a landing page?',
      'What metrics matter most for a paid campaign?',
      'Describe your approach to SEO for a new website.',
      'Explain attribution models and their trade-offs.',
      'How do you segment audiences for campaigns?',
      'What tools do you use for keyword research?',
      'How do you calculate CAC and LTV?',
      'Website traffic doubled but conversions stayed flat. What analyses and tests do you run?',
      'Outline a full-funnel multi-channel campaign for a B2B SaaS product launch.',
      'Email open rates fell after a redesign. What diagnostics and experiments do you try first?',
      'You suspect brand keyword cannibalization with paid search. How do you quantify and address it?'
    ],
    sales_representative: [
      'How do you handle objections during a sales call?',
      'Describe your pipeline management process.',
      'What is your strategy for engaging a cold lead?',
      'Explain the SPIN selling methodology.',
      'How do you qualify leads efficiently?',
      'Describe a time you exceeded your quota and how.',
      'A champion went silent late in the cycle. What steps do you take to re-engage and de-risk the deal?',
      'A competitor undercuts price by 25%. How do you defend value and negotiate?',
      'You inherit a stale territory with many closed-lost accounts. What is your first-quarter approach?',
      'A complex deal requires legal and security approvals. How do you orchestrate stakeholders and maintain momentum?'
    ],
  };

  for (const [job_role, questions] of Object.entries(roles)) {
    for (let i = 0; i < questions.length; i++) {
      const question_text = questions[i];
      // Idempotent insert: skip if existing question with same text & role
      const existing = await prisma.question.findFirst({ where: { job_role, question_text } });
      if (!existing) {
        await prisma.question.create({ data: { job_role, question_text, question_order: i + 1 } });
      }
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
