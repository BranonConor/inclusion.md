"use strict";

const c = require("./colors");

/**
 * Design Decisions questionnaire. 13 questions across 6 groups, each
 * skippable. Surfaces the real tradeoffs your product makes - who you've
 * intentionally designed for, who you know is excluded, and why.
 *
 * Grounded in:
 * - ABLEIST: Measuring Ableist Harms in LLMs (arxiv.org/abs/2510.10998)
 * - Centering Disability Perspectives in LLM Research and Design (ACM)
 * - Kat Holmes, Mismatch: How Inclusion Shapes Design (MIT Press)
 *
 * The point isn't perfect answers. It's conscious, documented tradeoffs.
 */

const GROUPS = [
  {
    title: "Group 1: Core Assumptions",
    blurb:
      "What you assume about the people using your product. These shape every other decision.",
    questions: [
      {
        key: "primaryAudience",
        label: "Who do you primarily build for?",
        hint:
          "Describe assumptions like language fluency, device type, network speed, technical expertise. " +
          "Example: 'People with reliable internet, modern browsers, English fluency.'",
      },
      {
        key: "implicitDefaults",
        label:
          "What 'default user' assumptions live inside your product today?",
        hint:
          "The non-disabled, English-fluent, neurotypical user with a fast connection is a statistical artifact, not a person. " +
          "Where does that default show up in yours?",
      },
    ],
  },
  {
    title: "Group 2: Authentication & Access",
    blurb: "Where exclusion often happens first.",
    questions: [
      {
        key: "authMethods",
        label:
          "How do people get into your product? What auth methods do you support?",
        hint: "Examples: email/password, email + SMS, social login, passkey, SSO, magic link.",
      },
      {
        key: "authExcluded",
        label:
          "Is there anyone who can't use your authentication system right now?",
        hint:
          "Don't say 'no one' - there's always someone. Examples: people without reliable email, " +
          "people without a phone, people in regions without SMS, people who share a device.",
      },
      {
        key: "authReason",
        label: "Why did you choose that authentication method?",
        hint: "Be honest: easiest to implement, most widely supported, security requirement, industry standard.",
      },
    ],
  },
  {
    title: "Group 3: Information Collection",
    blurb:
      "What you ask for shapes who can show up. Required vs. optional matters.",
    questions: [
      {
        key: "infoCollected",
        label: "What personal information do you ask people to provide?",
        hint:
          "Examples: name, email, phone, DOB, location, video ID, gender (and what options?), disability status. " +
          "Note required vs. optional.",
      },
      {
        key: "infoRationale",
        label: "For any required personal information, why is it required?",
        hint: "For each field: could we work without this? Example: 'Email required for notifications - could SMS work instead?'",
      },
    ],
  },
  {
    title: "Group 4: Interaction Model",
    blurb: "How people actually use the product.",
    questions: [
      {
        key: "interactionModes",
        label: "How do people interact with your product?",
        hint:
          "Pick all that apply: text, voice, visual/color-based, video, synchronous, asynchronous, " +
          "touch, keyboard, motor coordination, screen reader.",
      },
      {
        key: "unsupportedPatterns",
        label: "Are there interaction patterns you consciously don't support?",
        hint:
          "Examples: video verification (cost), voice (bias concerns), offline mode, keyboard-only nav, " +
          "text-to-speech, RTL languages, slow networks, mobile-only.",
      },
    ],
  },
  {
    title: "Group 5: Communication & Language",
    blurb: "Tone and language are inclusion choices, not aesthetic ones.",
    questions: [
      {
        key: "languages",
        label: "What language(s) do you currently support?",
        hint: "English only, English + [list], multilingual from day 1, plan to add languages in [timeframe].",
      },
      {
        key: "communicationStyle",
        label: "What communication style(s) are you optimizing for?",
        hint:
          "Formal/professional, casual/friendly, technical, plain-language, direct. " +
          "Example: 'Casual + friendly, but avoid metaphors that might be ableist.'",
      },
    ],
  },
  {
    title: "Group 6: Edge Cases & Intersections",
    blurb:
      "Specific scenarios where the product breaks - or where unexpected users show up.",
    questions: [
      {
        key: "knownBreakage",
        label: "What's one scenario where your product might not work?",
        hint: "Be specific, not vague. Example: 'People in rural areas with <1 Mbps internet' or 'Left-handed users on touch devices.'",
      },
      {
        key: "unexpectedUsers",
        label: "Who might use your product in ways you didn't expect?",
        hint:
          "Examples: older relatives, people in different countries, people with low vision zooming, " +
          "screen reader users, people with limited energy, teams in different time zones, non-native speakers.",
      },
    ],
  },
];

const TOTAL_QUESTIONS = GROUPS.reduce((n, g) => n + g.questions.length, 0);

async function runQuestionnaire(p) {
  process.stdout.write(
    "\n" +
      c.bold("Design Decisions") +
      " " +
      c.dim(`(${TOTAL_QUESTIONS} questions, all skippable)`) +
      "\n" +
      c.dim(
        "These surface the real tradeoffs your product makes. Skip any with an empty answer.\n",
      ) +
      "\n",
  );

  const answers = {};
  let asked = 0;

  for (let g = 0; g < GROUPS.length; g++) {
    const group = GROUPS[g];
    process.stdout.write(
      c.cyan(group.title) + "\n" + c.dim(`  ${group.blurb}`) + "\n\n",
    );

    for (const q of group.questions) {
      asked++;
      process.stdout.write(
        c.dim(`Question ${asked} of ${TOTAL_QUESTIONS}`) + "\n",
      );
      if (q.hint) {
        process.stdout.write(c.dim(`  ${q.hint}`) + "\n");
      }
      const val = await p.text(q.label, { default: "", required: false });
      if (val) {
        answers[q.key] = val;
      } else {
        process.stdout.write(
          c.dim("  (skipped - you can fill this in later)\n"),
        );
      }
      process.stdout.write("\n");
    }

    if (g < GROUPS.length - 1) {
      process.stdout.write(c.dim("  ---\n\n"));
    }
  }

  return answers;
}

function hasAnyAnswers(designDecisions) {
  return designDecisions && Object.keys(designDecisions).length > 0;
}

function renderDesignDecisionsMarkdown(answers) {
  if (!hasAnyAnswers(answers)) return "";

  const lines = [];
  lines.push("### 1.B Design Decisions");
  lines.push("");
  lines.push(
    "Conscious tradeoffs documented as part of this project's inclusion posture. " +
      "These are not aspirations - they're current realities, surfaced so reviewers " +
      "(human and AI) can flag when generated output assumes otherwise.",
  );
  lines.push("");

  const sectionMap = [
    {
      heading: "**Core assumptions**",
      keys: [
        ["primaryAudience", "Primary audience"],
        ["implicitDefaults", "Implicit defaults"],
      ],
    },
    {
      heading: "**Authentication & access**",
      keys: [
        ["authMethods", "Methods supported"],
        ["authExcluded", "Known exclusion"],
        ["authReason", "Reason for choice"],
      ],
    },
    {
      heading: "**Information collection**",
      keys: [
        ["infoCollected", "Information collected"],
        ["infoRationale", "Why it's required"],
      ],
    },
    {
      heading: "**Interaction model**",
      keys: [
        ["interactionModes", "Interaction modes"],
        ["unsupportedPatterns", "Patterns not supported"],
      ],
    },
    {
      heading: "**Communication & language**",
      keys: [
        ["languages", "Languages supported"],
        ["communicationStyle", "Communication style"],
      ],
    },
    {
      heading: "**Edge cases & intersections**",
      keys: [
        ["knownBreakage", "Known breakage scenarios"],
        ["unexpectedUsers", "Unexpected users"],
      ],
    },
  ];

  for (const section of sectionMap) {
    const entries = section.keys.filter(([k]) => answers[k]);
    if (entries.length === 0) continue;
    lines.push(section.heading);
    for (const [key, label] of entries) {
      lines.push(`- _${label}:_ ${answers[key]}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

module.exports = {
  runQuestionnaire,
  renderDesignDecisionsMarkdown,
  hasAnyAnswers,
  GROUPS,
  TOTAL_QUESTIONS,
};
