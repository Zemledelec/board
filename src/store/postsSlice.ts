"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
    id: number;
    title: string;
    body: string;
    user: string;
}

const initialState: { posts: Post[]; loading: boolean } = {
    posts: [],
    loading: false,
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setPosts, addPost, setLoading } = postsSlice.actions;
export default postsSlice.reducer;