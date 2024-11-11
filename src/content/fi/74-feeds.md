---
name: "RSS Feeds"
shortname: 'RSS Feeds'
noun: 'veil-advance'
---

Starting with 16.1.0 we'll provide RSS feeds for all posts, and for each channel. The feeds will be available at the following URLs:
- https://pelilauta.social/rss/threads.xml
- https://pelilauta.social/rss/channels/{channelId}.xml

The feeds will be updated every 15 minutes, and will include 11 of the most recent posts. 

The content of the posts will be rendered as the threads are rendered in the app, with the following exceptions:
- The content will be truncated to 500 characters or less (excluding HTML tags).
- The content will not include any embedded media (images, videos, etc).
- The content will not include any user-generated content (comments, etc).

## Consent

As RSS feeds are a form of content syndication, we will require the consent of the users to
include their posts in the feeds. This consent will be requested by resetting the EULA for all users
when the feature is released. Users who do not accept the EULA will have their account disabled.

The EULA will include the following clause:
- "I consent to having my posts included in the RSS feeds, and ActivityPub syndication of
Pelilauta.social"

- "Hyväksyn että sovellukseen luomani ketjut ja viestit ovat saatavilla RSS-syötteissä ja 
ActivityPub-syndikoinnissa."

Technically, this is might not be necessary, as the feeds will only include public posts, which are
already visible to anyone. However, we want to make sure that users are aware of the feature and
can opt out from posting to the feeds if they wish. (the sites etc. can be used in hidden mode, even
if the user decides to not use the public functionality of the site).