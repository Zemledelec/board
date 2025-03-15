"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Comment = {
    id: number;
    postId: number;
    userId: number;
    body: string;
};

interface CommentsState {
    comments: Comment[];
    loading: boolean;
}

const initialState: CommentsState = {
    comments: [],
    loading: false,
};

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (postId: number) => {
        const response = await fetch(
            `https://my-json-server.typicode.com/Zemledelec/board/comments?postId=${postId}`
        );
        return response.json();
    }
);

export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({ postId, userId, body }: { postId: number; userId: number; body: string }) => {
        const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/comments", {
            method: "POST",
            body: JSON.stringify({ postId, userId, body }),
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    }
);

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (commentId: number) => {
        await fetch(`https://my-json-server.typicode.com/Zemledelec/board/comments/${commentId}`, {
            method: "DELETE",
        });
        return commentId;
    }
);

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.loading = false;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            });
    },
});

export default commentsSlice.reducer;
