"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import {Post} from "@/store/postsSlice";
import {Comment} from "@/store/commentsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";

export default function PostPage() {
    const dispatch = useDispatch();
    const {id} = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        debugger;
        const fetchData = async () => {
            setLoading(true);

            const resPost = await fetch(`https://my-json-server.typicode.com/Zemledelec/board/posts/${id}`);
            const postData = await resPost.json();
            setPost(postData);

            const resComments = await fetch(`https://my-json-server.typicode.com/Zemledelec/board/comments?postId=${id}`);
            const commentsData = await resComments.json();
            setComments(commentsData);

            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleCreateComment = useCallback(async () => {

        if (!user) {
            alert("Error: User not found!");
            return;
        }

        if (bodyRef.current?.value.trim()) {
            const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/comments", {
                method: "POST",
                body: JSON.stringify({
                    body: bodyRef.current.value,
                    userId: user.id,
                    postId: id,
                }),
                headers: {"Content-Type": "application/json"},
            });

            const newPost = await response.json();
            dispatch(addComment(newPost));
            bodyRef.current.value = "";
        }
    }, [user, dispatch]);


    if (loading) return <p className="text-center mt-4">Loading post...</p>;

    return (
        <div>
            <Header/>
            <div className="max-w-3xl mx-auto mt-10 p-4 border rounded shadow">
                <Button className="mb-4 bg-blue-500 text-white" onClick={() => router.push("/posts")}>
                    Back to Posts
                </Button>

                {post ? (
                    <div className="p-4 border rounded shadow">
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <p>{post.body}</p>

                        {user && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Create a Comment</h2>
                                <textarea
                                    ref={bodyRef}
                                    placeholder="Comment"
                                    className="w-full p-2 border rounded mb-2"
                                    rows={3}
                                />
                                <Button
                                    className="bg-blue-500 text-white"
                                    onClick={handleCreateComment}
                                >
                                    Create Comment
                                </Button>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mt-4">Comments</h2>
                        {comments.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="p-2 border rounded">
                                        {comment.body}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-center">Post not found.</p>
                )}
            </div>
        </div>
    );
}
