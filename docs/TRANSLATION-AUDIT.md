# Translation audit

Status: incomplete. Do not certify the app as fully translated.

The source scan found 216 distinct literal translation keys and 815 hard-coded text candidates. Candidates include brand names, technical examples and inactive components, so this is not a confirmed defect count.

The table checks saved titles and descriptions together. English is the original content. Presence checks do not certify linguistic quality. Dynamic keys, error messages and dictionaries inside components require additional review.

| Language | Missing referenced UI keys | Products | Projects | Categories | Subcategories | Models | Homepage cards | Section heading |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ckb | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| kmr | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| ar | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| tr | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| fa | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| en-GB | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| de | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| fr | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| it | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| el | 0 | 4/57 | 4/93 | 0/7 | 0/7 | 4/57 | 0/5 | 0/1 |
| es | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| ro | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| bg | 0 | 4/57 | 4/93 | 0/7 | 0/7 | 4/57 | 0/5 | 0/1 |
| sr | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| bs | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| hr | 0 | 4/57 | 4/93 | 0/7 | 0/7 | 4/57 | 0/5 | 0/1 |
| sq | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| nl | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| sv | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| pl | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| pt | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| en-US | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| es-MX | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| pt-BR | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |
| zh-CN | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| ru | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| hi | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| ja | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| ko | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| kk | 0 | 3/57 | 3/93 | 0/7 | 0/7 | 3/57 | 0/5 | 0/1 |
| en | 0 | 57/57 | 93/93 | 7/7 | 7/7 | 57/57 | 5/5 | 1/1 |

## Remaining work

- Manually translate the missing product/project content and category/model labels into the other enabled languages.
- Review contact confirmations, request forms, admin screens, validation errors and accessibility labels identified in the JSON report.
- Audit homepage overrides and component-specific dictionaries for copied English text.
- Check every language in the browser, including authenticated screens. A source scan cannot prove every runtime state.

## Changes in this pass

- Resolved missing cart/navigation keys and added seven manually translated catalog/control labels across all enabled language variants.
- Removed unrelated-language fallback rules (Italian for French/Spanish/Portuguese/Romanian and Arabic for Persian).
- Corrected Arabic descriptions for the five homepage showcase cards.
- Authored additive manual catalog packs; see the coverage table for the latest published language counts.
- Localized search results, request-cart product names, category labels and language-picker controls without changing submitted request data.
- Added short page/content reveals, drawer/menu/dialog entrances, hover/focus transitions and reduced-motion handling.

Frontend assets and additive CMS translations were deployed. The production backend was not replaced. Full authenticated-flow and all-language browser verification remains outstanding.
