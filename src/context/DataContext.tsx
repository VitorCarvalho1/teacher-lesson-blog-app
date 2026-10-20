import React, { createContext, useContext, useState } from 'react';
import { Post, CreatePostPayload, UpdatePostPayload } from '@/types/post';
import { User, CreateUserPayload, UpdateUserPayload } from '@/types/auth';
import { Comment, CreateCommentPayload, UpdateCommentPayload } from '@/types/comment';
import { INITIAL_POSTS, INITIAL_USERS, INITIAL_COMMENTS } from '@/mock/mockData';
import { useAuth } from '@/context/AuthContext';

type DataContextType = {
  posts: Post[];
  users: User[];
  comments: Comment[];
  getPost: (id: number) => Post | undefined;
  getUser: (id: number) => User | undefined;
  getCommentsForPost: (postId: number) => Comment[];
  createPost: (payload: CreatePostPayload) => Promise<Post>;
  updatePost: (id: number, payload: UpdatePostPayload) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<User>;
  updateUserById: (id: number, payload: UpdateUserPayload) => Promise<User>;
  deleteUserById: (id: number) => Promise<void>;
  createComment: (postId: number, payload: CreateCommentPayload) => Promise<Comment>;
  updateComment: (postId: number, commentId: number, payload: UpdateCommentPayload) => Promise<Comment>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);

  const getPost = (id: number) => posts.find((p) => p.id === id);
  const getUser = (id: number) => users.find((u) => u.id === id);
  const getCommentsForPost = (postId: number) =>
    comments.filter((c) => c.post_id === postId);

  const createPost = async (payload: CreatePostPayload): Promise<Post> => {
    const newPost: Post = {
      id: Date.now(),
      title: payload.title,
      description: payload.description,
      status: 'PUBLISHED',
      user_id: currentUser?.id ?? 1,
      author: {
        id: currentUser?.id ?? 1,
        name: currentUser?.name ?? 'Prof. Henrique Viana',
        email: currentUser?.email ?? 'henrique.viana@escola.edu.br',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = async (id: number, payload: UpdatePostPayload): Promise<Post> => {
    let updated: Post | undefined;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updated = {
            ...p,
            title: payload.title ?? p.title,
            description: payload.description ?? p.description,
            updated_at: new Date().toISOString(),
          };
          return updated;
        }
        return p;
      })
    );
    if (!updated) {
      throw new Error('Post not found');
    }
    return updated;
  };

  const deletePost = async (id: number): Promise<void> => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const createUser = async (payload: CreateUserPayload): Promise<User> => {
    const newUser: User = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: payload.role ?? 'USER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUserById = async (id: number, payload: UpdateUserPayload): Promise<User> => {
    let updated: User | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          updated = {
            ...u,
            name: payload.name ?? u.name,
            email: payload.email ?? u.email,
            role: payload.role ?? u.role,
            updated_at: new Date().toISOString(),
          };
          return updated;
        }
        return u;
      })
    );
    if (!updated) {
      throw new Error('User not found');
    }
    return updated;
  };

  const deleteUserById = async (id: number): Promise<void> => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const createComment = async (postId: number, payload: CreateCommentPayload): Promise<Comment> => {
    const newComment: Comment = {
      id: Date.now(),
      content: payload.content,
      post_id: postId,
      user_id: currentUser?.id ?? 1,
      author: {
        id: currentUser?.id ?? 1,
        name: currentUser?.name ?? 'Prof. Henrique Viana',
        role: currentUser?.role ?? 'ADMIN',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    return newComment;
  };

  const updateComment = async (
    postId: number,
    commentId: number,
    payload: UpdateCommentPayload
  ): Promise<Comment> => {
    let updated: Comment | undefined;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.post_id === postId) {
          updated = {
            ...c,
            content: payload.content,
            updated_at: new Date().toISOString(),
          };
          return updated;
        }
        return c;
      })
    );
    if (!updated) {
      throw new Error('Comment not found');
    }
    return updated;
  };

  const deleteComment = async (postId: number, commentId: number): Promise<void> => {
    setComments((prev) => prev.filter((c) => !(c.id === commentId && c.post_id === postId)));
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        users,
        comments,
        getPost,
        getUser,
        getCommentsForPost,
        createPost,
        updatePost,
        deletePost,
        createUser,
        updateUserById,
        deleteUserById,
        createComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
