"use client";

import {useCallback, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPosts, addPost, setLoading, Post} from "@/store/postsSlice";
import {RootState} from "@/store/store";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function PostsPage() {
    const dispatch = useDispatch();

    const posts = useSelector((state: RootState) => state.posts.posts);
    const loading = useSelector((state: RootState) => state.posts.loading);
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    const titleRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const fetchPosts = useCallback(async () => {
        dispatch(setLoading(true));
        const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/posts");
        const data = await response.json();
        dispatch(setPosts(data));
        dispatch(setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCreatePost = useCallback(async () => {

        if (!user) {
            alert("Error: User not found!");
            return;
        }

        if (titleRef.current?.value.trim() && bodyRef.current?.value.trim()) {
            const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/posts", {
                method: "POST",
                body: JSON.stringify({
                    title: titleRef.current.value,
                    body: bodyRef.current.value,
                    userId: user.id
                }),
                headers: {"Content-Type": "application/json"},
            });

            const newPost = await response.json();
            dispatch(addPost(newPost));

            titleRef.current.value = "";
            bodyRef.current.value = "";
        }
    }, [user, dispatch]);

    const handlePostClick = (postId: number) => {
        router.push(`/comments/${postId}`); // 👈 Роутинг на comments/[id]
    };

    return (
        <div>
            <Header/>
            <div className="max-w-3xl mx-auto mt-10 p-4 border rounded shadow">
                <h1 className="text-3xl font-bold mb-4 text-center">Posts</h1>

                {user && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Create a Post</h2>
                        <input
                            ref={titleRef}
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <textarea
                            ref={bodyRef}
                            placeholder="Post body"
                            className="w-full p-2 border rounded mb-2"
                            rows={3}
                        />
                        <Button
                            className="bg-blue-500 text-white"
                            onClick={handleCreatePost}
                        >
                            Create Post
                        </Button>
                    </div>
                )}

                {loading ? (
                    <p className="text-center">Loading posts...</p>
                ) : (
                    <ul className="space-y-4">
                        {posts.map((post: Post) => (
                            <li
                                key={post.id}
                                className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
                                onClick={() => handlePostClick(post.id)}
                            >
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <p>{post.body}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}