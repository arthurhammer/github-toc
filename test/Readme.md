# Testing

Informal (and incomplete) description of where the extension should work.

These functional tests are necessary since the extension is subject to breaking whenever the GitHub website changes. **Should add proper testing in the future**.

---

- Check the table of contents appears and behaves correctly on the following cases
- Test all versions (Chrome, Firefox, Safari, userscript) of the extension
- Test while logged in and logged out, if applicable


## Repositories

- [Front page](https://github.com/rspec/rspec-core)
- [Detail page](https://github.com/rspec/rspec-core/blob/master/README.md)

### Files in Other Formats

- [Rst](https://github.com/jkbrzt/httpie)
- [Rdoc](https://github.com/rdoc/rdoc)
- [Org](https://github.com/yjwen/org-reveal)

Full list of supported formats [here](https://github.com/github/markup#markups).

### Editing

- Edit an existing markup file, make changes and preview
- Create and edit a new markup file and preview
- Rename a file from a non-markup to a markup extension and preview (e.g. from `js` to `md`)
- Rename a file from a markup to a non-markup extension and preview

In all cases, try removing and changing existing and inserting new headings.

### Other

- [Rich diffs for markup files in commit pages](https://github.com/arthurhammer/github-toc/commit/fb56f45e086ef8a3e7dc139be49decf7f4dff807?short_path=1e290ac#diff-1e290ac8433d555bce009b162cb869d0)
    - (toc will currently only appear on the first rich diff)
- Check the table of contents appears when navigating while not triggering a new page load (ajax)
    - e.g. navigate from the [main repo page](https://github.com/arthurhammer/github-toc) to the detail page for [`Readme.md`](https://github.com/arthurhammer/github-toc/blob/master/Readme.md)

## Wiki

- [Front page](https://github.com/gollum/gollum/wiki)
- [Sub page](https://github.com/gollum/gollum/wiki/Git-adapters)
- [Wiki with custom sidebar](https://github.com/mbostock/d3/wiki)

Test while logged in and while logged out.

### Editing

- Edit an existing page, make changes and preview
- Create and edit a new page

In all cases, try removing and changing existing and inserting new headings.

## Gist

- [Gist](https://gist.github.com/benweet/6312489)
- [Gist with multiple readmes](https://gist.github.com/arthurhammer/2261163aca4c0e931517)
    - (toc will currently only appear on the first one)

### Editing

Currently there are no markup previews in gists, so nothing should happen while editing.

## Other

- [Random](https://github.com/arthurhammer/github-readme-toc/blob/master/test/test.markdown)
- Test other random stuff in headings, e.g. strong, italics, special characters, custom html, mix of all of these etc.
    - e.g. edge cases like images in headings, non-breaking spaces etc. don't work currently (this is due GitHub not supporting these for the most part, it doesn't generate `id` attributes)

## Where It Shouldn't Work

Markup content appears in a lot of places on GitHub. A table of contents should not appear for comments and descriptions in issues, pull requests, commit pages and similar.
