"use client";

import {useEffect, useRef, useCallback, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {fetchComments, addComment} from "@/store/commentsSlice";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import {Post} from "@/store/postsSlice";

export default function PostPage() {
    const {id} = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const comments = useSelector((state: RootState) => state.comments.comments);
    const loading = useSelector((state: RootState) => state.comments.loading);
    const user = useSelector((state: RootState) => state.auth.user);

    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const [post, setPost] = useState<Post | null>(null);
    const [postLoading, setPostLoading] = useState(true);

    useEffect(() => {
        setPostLoading(true);
        fetch(`https://my-json-server.typicode.com/Zemledelec/board/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setPostLoading(false);
            })
            .catch(() => {
                setPostLoading(false);
            })

        dispatch(fetchComments(Number(id)));

    }, [dispatch, id]);

    const handleCreateComment = useCallback(() => {
        if (!user) {
            alert("Error: User not found!");
            return;
        }

        if (bodyRef.current?.value.trim()) {
            const newComment = {
                body: bodyRef.current.value,
                userId: user.id,
                postId: Number(id),
            };

            dispatch(addComment(newComment));

            bodyRef.current.value = "";
        }
    }, [user, dispatch, id]);

    return (
        <div>
            <Header/>
            <div className="max-w-3xl mx-auto mt-10 p-4 border rounded shadow">
                <Button className="mb-4 bg-blue-500 text-white" onClick={() => router.push("/posts")}>
                    Back to Posts
                </Button>

                {postLoading ? (
                    <p className="text-center mt-4">Loading post...</p>
                ) : post ? (
                    <div className="p-4 border rounded shadow">
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <p>{post.body}</p>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Create a Comment</h2>
                            <textarea
                                ref={bodyRef}
                                placeholder="Comment"
                                className="w-full p-2 border rounded mb-2"
                                rows={3}
                            />
                            <Button className="bg-blue-500 text-white" onClick={handleCreateComment}>
                                Create Comment
                            </Button>
                        </div>

                        <h2 className="text-xl font-semibold mt-4">Comments</h2>

                        {loading ? (
                            <p>Loading comments...</p>
                        ) : comments.length > 0 ? (
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