# Translation audit

Status: incomplete. Do not certify the app as fully translated.

The source scan found 210 distinct literal translation keys and 824 hard-coded text candidates. Candidates include brand names, technical examples and inactive components, so this is not a confirmed defect count.

The table checks saved titles and descriptions together. English is the original content. Presence checks do not certify translation quality; existing Sorani samples also need editorial review. Dynamic keys, error messages and dictionaries inside components require additional review.

| Language | Missing referenced UI keys | Product title + description | Project title + description | Category title | Model title + description |
| --- | ---: | ---: | ---: | ---: | ---: |
| ckb | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| kmr | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| ar | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| tr | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| fa | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| en-GB | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| de | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| fr | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| it | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| el | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| es | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| ro | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| bg | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| sr | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| bs | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| hr | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| sq | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| nl | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| sv | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| pl | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| pt | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| en-US | 0 | 57/57 | 93/93 | 7/7 | 57/57 |
| es-MX | 0 | 4/57 | 4/93 | 0/7 | 4/57 |
| pt-BR | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| zh-CN | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| ru | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| hi | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| ja | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| ko | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| kk | 0 | 3/57 | 3/93 | 0/7 | 3/57 |
| en | 0 | 57/57 | 93/93 | 7/7 | 57/57 |

## Remaining work

- Manually translate the missing product/project content and category/model labels into the other enabled languages.
- Review contact confirmations, request forms, admin screens, validation errors and accessibility labels identified in the JSON report.
- Audit homepage overrides and component-specific dictionaries for copied English text.
- Check every language in the browser, including authenticated screens. A source scan cannot prove every runtime state.

## Changes in this pass

- Resolved missing cart/navigation keys and added seven manually translated catalog/control labels across all enabled language variants.
- Removed unrelated-language fallback rules (Italian for French/Spanish/Portuguese/Romanian and Arabic for Persian).
- Corrected Arabic descriptions for the five homepage showcase cards.
- Added short page/content reveals, drawer/menu/dialog entrances, hover/focus transitions and reduced-motion handling.

The production bundle is newer than the local source. Only targeted frontend changes were deployed; the production backend was not replaced.
