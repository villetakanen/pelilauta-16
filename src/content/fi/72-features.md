---
name: 'Features'
noun: 'veil-advance'
---

## 16.0.0 Features

New features and improvements:
* No new end user features, this version is a tech stack update

| Status  | Legend                        |
| ------- | ----------------------------- |
| missing | Not implemented               |
| testing | In testing                    |
| done    | Implemented, tested and ready |
| BUG     | Feature has a known bug, does not prevent a release |

### Threads

#### Create Thread

| Feature                      | Status   | Description  |
| ---------------------------- | -------- | ------------ |
| *Front page create action*   | done     | Visible to authenticated, links to create thread route |
| *Forum index create action*  | done     | Visible to authenticated, links to create thread route |
| *Channel page create action* | done     | Visible to authenticated, links to create thread route, presets channel to current |
| *Create thread view*         | done     | Form with title, content, and tags fields |
| *Create thread: title*       | done     | Required, max 30 characters |
| *Field: Content              | done     | WYSIWYG editor |
| *Field: Content, Paste to*   | BUG      | Paste from clipboard to thread content field |
| *Field: Name*                | BUG      | Required, max 30 characters |

#### Edit Thread

| Feature                      | Status   | Description  |
| ---------------------------- | -------- | ------------ |
| *Thread edit action*         | done     | Visible to thread author, links to edit thread route |
| *Paste to thread content*    | BUG      | Paste from clipboard to thread content field |
| *Thread name edit*           | BUG      | Required, max 30 characters |