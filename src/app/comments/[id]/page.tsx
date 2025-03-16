"use client";

import {useEffect, useRef, useCallback, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {fetchComments, addComment, deleteComment, Comment} from "@/store/commentsSlice";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import {Post} from "@/store/postsSlice";
import {useAppDispatch} from "@/store/store";

export default function PostPage() {
    const {id} = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const comments = useSelector((state: RootState) => state.comments.comments);
    const loading = useSelector((state: RootState) => state.comments.loading);
    const user = useSelector((state: RootState) => state.auth.user);

    // Local coments for faster comment Delete
    const [localComments, setLocalComments] = useState<Comment[]>(comments);

    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const [post, setPost] = useState<Post | null>(null);
    const [postLoading, setPostLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    // update local comments after comments state is updated
    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

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

    const handleCreateComment = useCallback(async () => {
        if (!user) {
            alert("Error: User not found!");
            return;
        }

        if (bodyRef.current?.value.trim()) {

            try {
                const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/comments", {
                    method: "POST",
                    body: JSON.stringify({
                        body: bodyRef.current.value,
                        userId: user.id,
                        postId: Number(id),
                    }),
                    headers: {"Content-Type": "application/json"},
                });

                const savedComment = await response.json();

                //@todo fake id doesnt work
                dispatch(addComment(savedComment));

                bodyRef.current.value = "";

            } catch (error) {
                console.error("Failed to add comment:", error);
            }
        }
    }, [user, dispatch, id]);

    const handleDeleteComment = (commentId: number, commentUserId: number) => {
        if (user?.id !== commentUserId) {
            alert("You can only delete your own comments!");
            return;
        }

        const updatedComments = localComments.filter(comment => comment.id !== commentId);
        setLocalComments(updatedComments);

        dispatch(deleteComment(commentId));
    };

    if (!user) {
        return null;
    }

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
                        ) : localComments.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {localComments.map((comment) => (
                                    <li key={comment.id} className="p-2 border rounded flex flex-col">
                                        <span>{comment.body}</span>
                                        {user?.id === comment.userId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id, comment.userId)}
                                                className="text-red-500 mt-2 self-end cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        )}
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