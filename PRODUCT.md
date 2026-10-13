# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static) on Netlify, repo andresl/chris-foodie, push to `main` publishes chris-foodie.netlify.app. Chosen by Andrés on 13-oct-2026, same stack as his other sites.

## Users

- People in San Francisco (locals, visitors, Christian's friends) deciding where to eat, usually on a phone, often already out in the city.
- Christian Van Der Henst (Cvander), the owner of cookfoodie.com. This build is a demo by Andrés to show him a new vision of his site.

## Product Purpose

A personal food directory of San Francisco, built only from places Christian has eaten at and recommends. It should feel like a friend who knows you: you either filter by what you want (cuisine, meal, price, neighborhood) or answer a 10-question tap-only game, and the site answers with a plan ("Korean BBQ dinner, charcoal, with drinks" or "Venezuelan breakfast"), sorted by how close each place is to you.

Success: someone opens it on the street, lets the browser locate them, and in under a minute knows where to go and why Christian sends them there.

## Positioning

Every place is a first-person pick from one person with a real track record (CookFoodie reviews, dishes he orders, the line he waited in). San Francisco only, but food from all over the world: Burmese, Salvadoran, Venezuelan-Chinese, Korean, Basque-style tapas, Japanese, Turkish, Jewish deli. Not a ranking site, not Yelp: a friend's list that adapts to you and to where you stand.

## Operating Context

- Source of truth is cookfoodie.com: the San Francisco wishlist (52 places, `scrap/fuente/wishlist-sf.next.json`) and the 15 published SF reviews plus Balompié Café in progress (`reviewsData` in the same file, `scrap/fuente/llms-full.txt`).
- Christian already makes unlisted personal guides for specific people (`/san-francisco/for-*` in his robots.txt). The game is that idea, automated.
- Coordinates come from OpenStreetMap geocoding of each address (`scrap/geo.json`); distance is straight-line from the visitor.
- Instagram: @cookfoodie (79 posts, mostly 2012-2014 travel). Three posts match SF places (Burma Love, Mosto, Kingdom of Dumplings); cookfoodie.com already carries two reels (Mosto, San Ho Won). Matches in `scrap/instagram.json`.

## Capabilities and Constraints

- Bilingual EN/ES interface, filters and game, with a toggle. Christian's reviews, notes and dish names stay in English as he wrote them.
- Geolocation is opt-in by the browser prompt; everything must work when the visitor says no (fallback: sort by Christian's priority, pick a neighborhood).
- Filters: cuisine/origin, meal (breakfast, brunch, lunch, dinner, late-night, coffee, dessert), price, neighborhood, "reviewed by Christian", distance.
- The game: 10 short questions, tap only, no typing, ends in a plan with a lead recommendation and alternates.
- Instagram posts load through the official embed, only when the visitor asks for them.
- No accounts, no reservations booking, no ratings from other people.
- Not decided: whether Christian keeps other cities (Taipei, San Sebastián, etc.) on the same domain; this demo is SF only.

## Brand Commitments

- Name: CookFoodie, exactly as the original site. The original chef logo (illustration) is the only face; no photos of Christian (Andrés, 13-oct-2026).
- The game host is "Cvander", Christian in first person, with the tone of his X posts (scrap/christian/voz.md).
- Visual: food photos lead, one accent (CookFoodie orange), one sober type family. Themed costume concepts were rejected.
- Author voice: Christian in first person ("I", "trust me"), honest, short sentences, playful asides ("People in Spain will judge me").
- Christian's photos ship as they are: no retouching, no AI edits.

## Evidence on Hand

- 16 SF review texts with dishes, FAQs, reservation tips, ratings and photos (photos under cookfoodie.com/img/reviews/).
- Two reel videos with posters hosted on cookfoodie.com (Mosto, San Ho Won).
- 37 of the 52 places have only Christian's short note and no photo: never invent photos, dishes or ratings for them.
- No testimonials, follower counts, press or awards beyond what Christian's own notes say (Michelin mentions are his).

## Product Principles

1. Christian's voice is the product: every recommendation cites what he said, never generic copy.
2. Near me, right now: distance and meal time shape the answer before anything else.
3. Fun first, but never slower than a filter: the game is one tap per question and can be skipped.
4. Honest gaps: a place without a review says so and links to the map.

## Accessibility & Inclusion

Phone-first, works one-handed outdoors. All game choices are buttons reachable by keyboard; motion respects `prefers-reduced-motion`.
