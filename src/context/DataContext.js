import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import api from '../api/posts';

import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch from "../hooks/useAxiosFetch";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch('/posts');

  useEffect(() => {
    setPosts(data);
  }, [data]);

  useEffect(() => {
    const filteredResults = posts.filter((post) => (
      (post.body).toLowerCase().includes(search.toLowerCase())
      ||
      (post.title).toLowerCase().includes(search.toLowerCase())
    ))
    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newPost = { id, title: postTitle, datetime, body: postBody }
      const response = await api.post('/posts', newPost)
      const newPosts = [...posts, newPost];
      setPosts(newPosts);
    } catch (err) {
      console.log(err);
    } finally {
      setPostTitle('');
      setPostBody('');
      navigate('/')
    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody }

    try {
      const response = await api.put(`/posts/${id}`, updatedPost)
      setPosts(posts.map((post) => post.id === id ? updatedPost : post))
      setEditTitle('')
      setEditBody('');
    } catch (err) {
      console.log(err);
    }
    navigate('/')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      const newPosts = posts.filter((post) => post.id !== id);
      setPosts(newPosts);
      navigate('/')
    } catch (err) {

    }
  }

  return (
    <DataContext.Provider value={{
      width, search, setSearch
    }}
    >
      {children}
    </DataContext.Provider>
  )
}

export default DataContext; 