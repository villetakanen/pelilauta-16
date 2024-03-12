import { createSignal, type Component, onMount, For } from "solid-js";
import { app } from "../../../../firebase/client";
import { collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { z } from "zod";
import { extractFlowTime } from "../../../../firebase/helpers";


const PostSchema = z.object({
    key: z.string(),
    flowTime: z.number(),
    title: z.string(),
})
type Post = z.infer<typeof PostSchema>

/**
 * This is a Pelilauta live stream component. It subscribes to the 'steam' and displays
 * the latest 5 posts in the stream.
 * 
 * Further posts will be auto-loaded as the user scrolls down. 
 * 
 * @returns The live stream component.
 */
export const LiveStream: Component = () => {
  const [posts, setPosts] = createSignal([] as Array<Post>);

  onMount(async () => {
    const db = getFirestore(app);
    const postsQuery = query(collection(db, 'stream'), orderBy('flowTime', 'desc'), limit(5));
  
    console.log('Subscribing to live stream...')

    // Subscribe to the query, and add the posts to the state
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts:Array<Post> = [...posts()];
      snapshot.forEach((doc) => {
        console.log('Post:', doc.data());
        // if the post is already in the state, splice it
        const index = newPosts.findIndex((post) => post.key === doc.id);
        if (index !== -1) newPosts.splice(index, 1);
        newPosts.push(PostSchema.parse({ ...doc.data(), key: doc.id, flowTime: extractFlowTime(doc.data()) }));
      });

      setPosts(newPosts);
      console.log('Subscibed.')
    });
  });


  return (
    <div>
        <div class="flex flex-column">
            <For each={posts()} fallback={<p>Loading...</p>}>{ post => 
              <cn-card title={post.title} />
            }</For>
        </div>
    </div>
  );
}