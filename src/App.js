import Header from "./Header";
import Home from './Home';
import Nav from './Nav';
import Footer from './Footer';
import About from './About';
import Missing from './Missing';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from "./EditPost";

// useHistory is deprecated
// https://stackoverflow.com/questions/71884379/reactjs-in-react-rooter-dom-is-usehistory-deprecated
// Switch is also deprecated so we will be hacking it sorta
// and workign with Routes
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import api from './api/posts';

import useWindowSize from "./hooks/useWindowSize";
import useAxiosFetch from "./hooks/useAxiosFetch";
import { DataProvider } from "./context/DataContext";


function App() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

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
    <div className="App">
      <DataProvider>
        <Header title='Test Blog' />
        <Nav/>
        <Routes>
          {/* v6 of route does not require exact and switch attribute */}
          <Route
            path="/"
            element={<Home
                        posts={searchResults}
                        fetchError={fetchError}
                        isLoading={isLoading}
        
                    />} />
          <Route path="/post" element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            setPostBody={setPostBody}
          />} />
          <Route path="/edit/:id" element={<EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            editBody={editBody}
            setEditTitle={setEditTitle}
            setEditBody={setEditBody}
          />} />
          <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<Missing />} />
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
