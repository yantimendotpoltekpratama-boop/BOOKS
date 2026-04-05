// Path: functions/[[path]]/podcast.xml.js

// ==================================================================
// KONFIGURASI UTAMA
// ==================================================================
const POSTS_PER_PAGE = 1000; 
const CACHE_TTL = 21600;     // Cache 6 Jam
const DEFAULT_EMAIL_USER = "contact"; 

// 📢 METADATA MASTER FILE
const MASTER_FILE_SIZE = 200179; 
const MASTER_DURATION = 12;      

// --- SPINTAX CONFIG (AMAZON COMPLIANCE & GERILYA MODE) ---
// Log: Mengarahkan narasi ke Review dan Akses Digital
const FEED_TITLE_SPIN = `{Digital Library Insights|Premium Book Reviews|Daily Literary & Kindle Guide|The Audio & Ebook Library|Reader's Digital Perspective|Digital Book Journal|The Narrative & Kindle Hub|Literary & Ebook Archive}`;
const FEED_DESC_SPIN = `{Discover professional reviews and immersive audio previews or Kindle editions of the world's most popular titles. Our library offers detailed insights into various genres, helping you find your next great listen or read with expert narration.|Your destination for curated book summaries, Kindle editions, and audio versions. Explore our collection of mystery, romance, and non-fiction titles designed for the modern reader seeking quality storytelling.|Explore an extensive archive of literature through our digital-first approach. We feature detailed reviews, author backgrounds, and professional previews for book enthusiasts seeking a premium Kindle or Audio experience.}`;
const FEED_AUTHOR_SPIN = `{Review Team|Literary Curator|Digital Book Critic|Digital Librarian|Archive Manager|Audio & Kindle Reviewer|The Digital Book Guide|Digital Scholar}`;

// Log: Menggunakan kata 'Access' dan 'Preview' sebagai pengganti 'Download'
const SPINTAX_PREFIX = `{Listen to|Read|Review of|Get Insights on|Preview|Explore|Discover} {Audiobook|Kindle Edition|Digital Book|Audible Title|Ebook Summary}`;
const SPINTAX_SUFFIX = `{Detailed Review|Unabridged Insights|Complete Guide|2026 Edition} {Premium Access|Kindle & Audio Preview|High Quality|Curated Content} {Best Seller|Trending Title|Must Read|Editor's Choice}`;
const MULTI_LANG_PREFIX = `{Listen|Read|Hören|Écouter|Escuchar|Ascolta} {Premium|Full|Complete} {Audiobook|Ebook|Livre Audio|Libro Audiolibro}`;

// --- TEMPLATES (MULTI-FORMAT: AUDIBLE & KINDLE) ---
const DESC_PREFIX = `{Explore|Access|Discover|Find} {this|the} {premium|full} {digital edition|audiobook summary|Kindle version} {in|as} {Audio|Digital|Ebook} {format|narrated version|readable copy}`;
const DESC_SUFFIX = `{and start your listening or reading experience today|available for your Kindle or mobile device|designed for the modern reader and listener}. 
This {digital title|audiobook|ebook} is {highly recommended|an editor's pick|a must-read}. 
Enjoy {immersive|seamless} {access|storytelling} and start {listening|reading} {right now|today}. 
Optimized for {mobile|Kindle|tablet|desktop|Audible} devices.`;
const DESC_TAGS = `{audiobook review|kindle edition|premium books|audible preview|book summary|read online|listen online|literary insights|audio book guide|digital library|kindle unlimited|professional narrator|best digital books 2026}`;

const PINTEREST_INTRO = `{To view the visual gallery|For book cover art|To see related illustrations|Check out our visual board|Discover the visual companion} {visit our Pinterest|check this Board|on our Pinterest Board|view the collection|see the pin}`;
const PINTEREST_ANCHOR = `{View Gallery|Visit Pinterest|See Art|Visual Guide|Pin It}`;
const TIER2_INTRO = `{Also featured on|Listen via our partner|Available on alternative|Mirror access on|Check our secondary}`;
const TIER2_ANCHOR = `{Official Hub|Partner Platform|Primary Source|Digital Mirror|External Player}`;



// --- HELPER FUNCTIONS ---
function cdata(str) {
  if (!str) return "";
  let clean = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  clean = clean.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${clean}]]>`;
}

// Helper untuk membersihkan teks polos agar tidak merusak XML (Pengganti CDATA untuk tag Author)
function xmlSafe(str) {
    if (!str) return "";
    return str.replace(/[<>&"']/g, function (m) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&apos;'
        }[m];
    });
}

function stringToHash(string) {
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function spinTextStable(text, seedStr) {
  return text.replace(/\{([^{}]+)\}/g, (match, content) => {
    const choices = content.split("|");
    const index = stringToHash(seedStr + content) % choices.length;
    return choices[index];
  });
}

function generateUUID(seed) {
    const hash = stringToHash(seed).toString(16).padEnd(32, '0');
    return `${hash.substr(0,8)}-${hash.substr(8,4)}-4${hash.substr(13,3)}-8${hash.substr(17,3)}-${hash.substr(20,12)}`;
}

function getRootDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts.slice(1).join('.');
  }
  return hostname;
}

// Helper Baru: Merapikan Username (yunus -> Yunus)
function toTitleCase(str) {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9 ]/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').trim();
}

export async function onRequest(context) {
  const { env, request, params } = context;
  const db = env.DB;
  const url = new URL(request.url);

  // 1. CACHE STRATEGY
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  if (response) {
    const newRes = new Response(response.body, response);
    newRes.headers.set("X-Cache-Status", "HIT");
    return newRes;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const forwardedHost = request.headers.get("X-Forwarded-Host");
    const CURRENT_HOST = forwardedHost || url.host;
    const SITE_URL = `${url.protocol}//${CURRENT_HOST}`;
    const selfLink = `${SITE_URL}${url.pathname}`;

    // PARSING URL
    const pathSegments = params.path || [];
    const categoryParam = pathSegments[0]; 
    const usernameParam = pathSegments[1]; 
    const pintUserParam = pathSegments[2];
    const pintBoardParam = pathSegments[3];
    const extraBacklinkSegments = pathSegments.slice(4);

    const emailUser = usernameParam || DEFAULT_EMAIL_USER; 
    const emailDomain = getRootDomain(CURRENT_HOST);
    const DYNAMIC_EMAIL = `${emailUser}@${emailDomain}`; 
    const identitySeed = (categoryParam || "") + (usernameParam || "");
    const channelUUID = generateUUID(identitySeed);

    // ========================================================
    // 🔥 LOGIKA JUDUL & AUTHOR BARU
    // ========================================================
    const baseTitle = spinTextStable(FEED_TITLE_SPIN, identitySeed + "title");
    let dynamicFeedTitle = baseTitle;

    if (emailUser && emailUser !== DEFAULT_EMAIL_USER) {
        dynamicFeedTitle = `${toTitleCase(emailUser)} ${baseTitle}`;
    }
    
    const dynamicFeedDesc = spinTextStable(FEED_DESC_SPIN, identitySeed + "desc");
    
    // Perbaikan Logika Author: Username + Spintax (Tanpa CDATA)
    const rawAuthorSpin = spinTextStable(FEED_AUTHOR_SPIN, identitySeed + "auth");
    const authorNameClean = emailUser !== DEFAULT_EMAIL_USER 
        ? `${toTitleCase(emailUser)} ${rawAuthorSpin}` 
        : rawAuthorSpin;

    // 2. QUERY DATABASE
    const limit = POSTS_PER_PAGE; 
    const queryParams = [];
    let query = "SELECT Judul, Author, Kategori, Image, KodeUnik FROM Buku WHERE 1=1";
    
    if (categoryParam) {
      query += " AND Kategori = ?"; 
      queryParams.push(categoryParam);
    }
    
    query += ` ORDER BY rowid DESC LIMIT ? OFFSET 0`;
    queryParams.push(limit);
    
    const stmt = db.prepare(query).bind(...queryParams);
    const { results } = await stmt.all();

    // Time Logic
    const baseDate = new Date();
    const BASE_TIME_MS = baseDate.getTime();
    const WINDOW_MS = 12 * 60 * 60 * 1000; 
    const lastBuildDate = baseDate.toUTCString();
    
    const picsumSeed = identitySeed || "default";
    const channelCoverUrl = `${SITE_URL}/image-proxy?url=${encodeURIComponent(`https://picsum.photos/seed/${picsumSeed}/1400/1400`)}&amp;ext=.jpg`;

    // XML GENERATION
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/" 
    xmlns:podcast="https://podcastindex.org/namespace/1.0" 
    xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${cdata(dynamicFeedTitle)}</title>
<link>${SITE_URL}</link>
<description>${cdata(dynamicFeedDesc)}</description>
<generator>CloudflarePages</generator>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<language>en-US</language>
<author>${xmlSafe(authorNameClean)}</author>
<copyright>${xmlSafe(authorNameClean)}</copyright>

<atom:link href="${selfLink}" rel="self" type="application/rss+xml" />

<itunes:image href="${channelCoverUrl}"/>
<itunes:explicit>no</itunes:explicit>
<itunes:type>episodic</itunes:type>
<itunes:summary>${cdata(dynamicFeedDesc)}</itunes:summary>
<itunes:author>${xmlSafe(authorNameClean)}</itunes:author>
<itunes:owner>
    <itunes:name>${xmlSafe(authorNameClean)}</itunes:name>
    <itunes:email>${xmlSafe(DYNAMIC_EMAIL)}</itunes:email>
</itunes:owner>
<itunes:category text="Arts"><itunes:category text="Books"/></itunes:category>

<image>
    <url>${channelCoverUrl}</url>
    <title>${cdata(dynamicFeedTitle)}</title>
    <link>${SITE_URL}</link>
</image>

<podcast:locked owner="${xmlSafe(DYNAMIC_EMAIL)}">no</podcast:locked>
<podcast:guid>${channelUUID}</podcast:guid>
`;

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const post = results[i];
        
        const audioUrl = `${SITE_URL}/amz/${post.KodeUnik}.mp3`;
        const postUrl = `${SITE_URL}/post/${post.KodeUnik}`;
        const postmoney = `https://smilespirit.uk/post/${post.KodeUnik}`;
        
        const seed = (post.KodeUnik || post.Judul) + identitySeed;
        const judulAsli = post.Judul || "Untitled";

        const timeOffset = Math.floor((i / results.length) * WINDOW_MS);
        const postTime = new Date(BASE_TIME_MS - timeOffset);
        const pubDate = postTime.toUTCString();

        const isMultiLang = (stringToHash(seed + "langType") % 100) < 50; 
        let awalan = isMultiLang ? spinTextStable(MULTI_LANG_PREFIX, seed + "prefix") : spinTextStable(SPINTAX_PREFIX, seed + "prefix");
        let akhiran = isMultiLang ? spinTextStable("{2025|2026|Full}", seed + "suffix") : spinTextStable(SPINTAX_SUFFIX, seed + "suffix");
        const finalTitle = `${awalan} ${judulAsli} ${akhiran}`;
        
        // Backlink Logic (Tetap dipertahankan sesuai permintaan)
        let pinterestPart = "";
        let tier2Part = "";
        const luckFactor = stringToHash(seed + "backlinkLuck") % 100;
        if (luckFactor < 70) {
            if (pintUserParam && pintBoardParam) {
                const rawPinterestUrl = `https://www.pinterest.com/${pintUserParam}/${pintBoardParam}/`;
                pinterestPart = `<p>📌 ${spinTextStable(PINTEREST_INTRO, seed + "pintro")}: <a href="${rawPinterestUrl}">${spinTextStable(PINTEREST_ANCHOR, seed + "panchor")} : ${rawPinterestUrl}</a></p>`;
            }
            if (extraBacklinkSegments.length > 0) {
                let rawTier2Url = extraBacklinkSegments.join("/");
                if (!rawTier2Url.startsWith("http")) rawTier2Url = "https://" + rawTier2Url;
                tier2Part = `<p>🔗 ${spinTextStable(TIER2_INTRO, seed + "tintro")} <strong><a href="${rawTier2Url}">${spinTextStable(TIER2_ANCHOR, seed + "tanchor")} : ${rawTier2Url}</a></strong></p>`;
            }
        }

        const authorSafe = post.Author || "Unknown Author";
        const descStart = spinTextStable(DESC_PREFIX, seed + "descStart");
        const descEnd = spinTextStable(DESC_SUFFIX, seed + "descEnd");
        const rawDescText = `${descStart} ${judulAsli} by ${authorSafe} ${descEnd}. Tags: ${spinTextStable(DESC_TAGS, seed + "descTags")}`;
        const ctaPrefix = spinTextStable("{START FREE TRIAL|CLAIM AUDIBLE OFFER|KINDLE ACCESS|GET EXCLUSIVE PREVIEW|CHECK SPECIAL OFFER|JOIN MEMBERSHIP|UNLOCK FULL ACCESS}", seed + "cta");
        const liveLinkText = `📥 ${ctaPrefix}: ${judulAsli}`;

        const htmlContent = `
          <p>👉 <strong><a href="${postmoney}">${liveLinkText} : ${postmoney} </a></strong></p>
          <hr/>
          <p>${rawDescText}</p>
          <hr/>
          ${pinterestPart}
          ${tier2Part}
        `;
        
        let episodeImage = post.Image ? `${SITE_URL}/image-proxy?url=${encodeURIComponent(post.Image)}&amp;ext=.jpg` : channelCoverUrl;

        xml += `<item>
<title>${cdata(finalTitle)}</title>
<link>${postUrl}</link>
<guid isPermaLink="false">${post.KodeUnik}</guid>
<pubDate>${pubDate}</pubDate>
<enclosure url="${audioUrl}" type="audio/mpeg" length="${MASTER_FILE_SIZE}"/>
<description>${cdata(htmlContent)}</description>
<content:encoded>${cdata(htmlContent)}</content:encoded>
<itunes:author>${xmlSafe(authorNameClean)}</itunes:author>
<itunes:duration>${MASTER_DURATION}</itunes:duration>
<itunes:explicit>no</itunes:explicit>
<itunes:image href="${episodeImage}"/>
<itunes:category text="Arts">
  <itunes:category text="Books"/>
</itunes:category>
<itunes:episodeType>full</itunes:episodeType>
</item>`;
      }
    }

    xml += `</channel></rss>`;
    
    const finalString = xml.trim(); 
    const encoder = new TextEncoder();
    const data = encoder.encode(finalString);
    
    response = new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": `public, max-age=3600, s-maxage=${CACHE_TTL}`,
        "Content-Length": data.byteLength.toString(),
        "Access-Control-Allow-Origin": "*",
        "X-Cache-Status": "MISS" 
      },
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;

  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
