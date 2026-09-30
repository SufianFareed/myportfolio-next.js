// Pure scoring logic, ported from the original standalone tool so it can
// be unit-tested and reused without touching any DOM or React state.

function countKeyword(text, kw) {
  if (!kw) return 0;
  const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return (text.match(re) || []).length;
}

function status(level, title, detail) {
  return { level, title, detail };
}

export function computeGigScore({ keyword, title, desc }) {
  const kw = (keyword || "").trim();
  const t = (title || "").trim();
  const d = (desc || "").trim();

  const checks = [];
  let score = 0;
  const MAX = 100;

  if (!kw) {
    checks.push(status("bad", "Add a focus keyword", "Every other check depends on this — the phrase buyers would actually search for."));
  }

  // Title checks (~40 pts)
  if (!t) {
    checks.push(status("bad", "Write a gig title", "Titles are the single biggest ranking factor on Fiverr search."));
  } else {
    const tlen = t.length;
    if (tlen >= 40 && tlen <= 70) {
      score += 12;
      checks.push(status("good", "Title length is solid", `${tlen} characters — in Fiverr's sweet spot of 40–70.`));
    } else if (tlen < 40) {
      score += 5;
      checks.push(status("warn", "Title is a little short", `${tlen} characters. Aim for 40–70 to fit more searchable detail.`));
    } else {
      score += 4;
      checks.push(status("warn", "Title is too long", `${tlen} characters — it may get cut off in search results. Trim to ≤70.`));
    }

    if (kw) {
      const inTitle = t.toLowerCase().includes(kw.toLowerCase());
      if (inTitle) {
        score += 16;
        const pos = t.toLowerCase().indexOf(kw.toLowerCase());
        if (pos <= 15) {
          score += 8;
          checks.push(status("good", "Keyword appears early in the title", "Close to the start, where it carries the most weight."));
        } else {
          score += 3;
          checks.push(status("warn", "Keyword is in the title, but late", "Move it closer to the front — Fiverr search and buyers both scan the start of a title first."));
        }
      } else {
        checks.push(status("bad", "Focus keyword is missing from the title", `Work "${kw}" into the title — it's the strongest signal you can give.`));
      }
    }

    const wc = t.split(/\s+/).filter(Boolean).length;
    if (wc >= 6 && wc <= 12) {
      score += 4;
      checks.push(status("good", "Title word count is natural", `${wc} words.`));
    }
  }

  // Description checks (~60 pts)
  if (!d) {
    checks.push(status("bad", "Write a gig description", "This is where you explain the offer and stack in supporting keywords."));
  } else {
    const dlen = d.length;
    if (dlen >= 300 && dlen <= 1200) {
      score += 14;
      checks.push(status("good", "Description length is healthy", `${dlen} characters — enough to cover the offer without padding.`));
    } else if (dlen < 300) {
      score += 5;
      checks.push(status("warn", "Description is thin", `${dlen} characters. Buyers and search both reward more detail — aim for 300+.`));
    } else {
      score += 8;
      checks.push(status("warn", "Description is long", `${dlen} characters. Not a hard problem, but tighten it if it's mostly filler.`));
    }

    if (kw) {
      const count = countKeyword(d, kw);
      const words = d.split(/\s+/).filter(Boolean).length || 1;
      const density = ((count * kw.split(/\s+/).length) / words) * 100;

      if (count === 0) {
        checks.push(status("bad", "Focus keyword never appears in the description", `Mention "${kw}" naturally at least 2–3 times.`));
      } else if (density >= 0.5 && density <= 2.5) {
        score += 16;
        checks.push(status("good", "Keyword density looks natural", `"${kw}" appears ${count}× (${density.toFixed(1)}% of the text).`));
      } else if (density < 0.5) {
        score += 6;
        checks.push(status("warn", "Keyword is underused", `Only ${density.toFixed(1)}% density (${count}×). A couple more natural mentions would help.`));
      } else {
        score += 4;
        checks.push(status("warn", "Keyword is overused", `${density.toFixed(1)}% density (${count}×) risks reading as keyword-stuffed — both to buyers and to Fiverr.`));
      }

      const first150 = d.slice(0, 150).toLowerCase();
      if (first150.includes(kw.toLowerCase())) {
        score += 8;
        checks.push(status("good", "Keyword appears early in the description", "It shows up in the opening lines, where buyers decide whether to keep reading."));
      } else {
        checks.push(status("warn", "Keyword appears late (or not) in the opening lines", "Work it into the first sentence or two."));
      }
    }

    const sentences = d.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    const avgLen = sentences.reduce((a, s) => a + s.split(/\s+/).length, 0) / (sentences.length || 1);
    if (avgLen <= 22) {
      score += 6;
      checks.push(status("good", "Sentences are easy to scan", `Average of ~${avgLen.toFixed(0)} words per sentence.`));
    } else {
      score += 2;
      checks.push(status("warn", "Sentences run long", `Average of ~${avgLen.toFixed(0)} words. Break some up — most buyers skim.`));
    }

    const hasLineBreaks = /\n/.test(d);
    if (hasLineBreaks) {
      score += 4;
      checks.push(status("good", "Description uses paragraph breaks", "Easier to skim than a single block of text."));
    } else {
      checks.push(status("warn", "Description is one big block", "Split it into short paragraphs or a bullet-style list of what's included."));
    }
  }

  score = Math.max(0, Math.min(MAX, Math.round(score)));
  const hasInput = Boolean(t || d);

  let band = "bad";
  let bandLabel = "Needs work";
  if (score >= 75) { band = "good"; bandLabel = "Strong — ready to publish"; }
  else if (score >= 50) { band = "warn"; bandLabel = "Getting there"; }

  return { score: hasInput ? score : null, band, bandLabel, checks, hasInput };
}
