# Dark Souls 3 Cheat Sheet

To view the cheat sheet [click here](https://vesylum.github.io/dark-souls-3-cheat-sheet/).

This checklist was created by adopting the source code from the [Dark Souls 2 Cheat Sheet](https://github.com/smcnabb/dark-souls-2-cheat-sheet/tree/gh-pages) created by [Stephen McNabb](https://github.com/smcnabb).

The walkthrough is thanks to [DeathGodGarra's NPC Side Quests Guide V2](https://www.gamefaqs.com/boards/168566-dark-souls-iii/73599466).

## Running Locally

You can open `index.html` directly in a browser, but many features work best when
served over HTTP. Make sure Python is installed and run one of the following
commands from the repository root. After starting the server, navigate to
`http://localhost:8000` in your browser.

### Python 3
```bash
python -m http.server
```

### Python 2
```bash
python -m SimpleHTTPServer
```

### Offline Availability

The checklist registers a service worker so that once the page has been loaded,
its assets are cached for offline use. The service worker calls `self.skipWaiting()` when installing and `clients.claim()` when activated so updates become active without a refresh. When the service worker updates, caches
from older versions are removed so the newest deployment replaces outdated
files. If updates to the site don't appear after reloading, clear your browser
data to force the service worker to fetch the latest files.

External CDN assets (e.g. Bootstrap stylesheets and the Jets search library) are
cached when available. If these requests fail the service worker still installs,
but those files won't be available offline. Hosting these libraries locally will
ensure they work without a network connection.

### Installing the App

In browsers that support Progressive Web Apps (PWAs) you can install this
checklist like a regular application. Look for the install or "Add to Home Screen" option in your browser's menu and follow the prompts.

## Google Analytics

The page includes Google's gtag snippet so you can track usage with your own
Analytics account. Near the end of `index.html` you will find a placeholder ID
that must be replaced with your Measurement ID:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your own tracking ID before deploying.

## Contribution Guide

If you are interested in contributing to this guide, I welcome Pull Requests.

For some background on how the guide code is written, here is a sample item on the checklist:

```
<li data-id="playthrough_13_20" class="f_gem f_misc">Continue left until you can enter a room with a Large Soul of a Nameless Soldier and a Raw Gem</li>
```

The **data-id** is a unique ID used to store the user's progress. For example, ***playthrough_13_20*** is the 20th task in zone 13. New data-ids must be used in ascending order, but you can place the new entries anywhere within a zone.

The **class="f_gem f_misc"** field is used for the filtering system. This task provides the user with a gem and a consumable, so we use **f_gem** and **f_misc**. The full list of filter classes is:

| Class   | Description |
|---      |--- |
| f_boss  | Boss fights |
| f_miss  | Content that can be permanently missed |
| f_npc   | NPC side quests |
| f_estus | Estus Shards |
| f_bone  | Undead Bone Shards |
| f_tome  | Sorcery Scrolls, Pyromancy Tomes, and Divine Tomes |
| f_coal  | Coals |
| f_ash   | Umbral Ashes |
| f_gest  | Gestures |
| f_sorc  | Sorceries |
| f_pyro  | Pyromancies |
| f_mirac | Miracles |
| f_ring  | Rings |
| f_weap  | Weapons, Spell Tools, and Shields |
| f_arm   | Armor Sets or individual pieces |
| f_tit   | Titanite |
| f_gem   | Gems |
| f_cov   | Covenants |
| f_misc  | *any other items* |

If none of these filter classes match, use **class="f_none"**.

In addition to the filter classes, there is a second type of classes used to control the visibility of entries based on which playthrough the user is on:

| Class  | Description |
|---     |--- |
| h_ng+  | items hidden on NG+ and beyond, e.g., Ashen Estus Flask |
| s_ng+  | items shown on NG+ and beyond, e.g., +1 rings |
| s_ng++ | items shown on NG++ and beyond, e.g., +2 rings |
