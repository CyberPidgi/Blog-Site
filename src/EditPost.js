import React from 'react'
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const EditPost = ({
  posts, handleEdit, editBody, setEditBody, editTitle, setEditTitle
}) => {
  const { id } = useParams();
  const post = posts.find(post => (post.id).toString() === id);

  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody])
  return (
    <main className='NewPost'>
      <h1>Edit Post</h1>
      <form action="" className="newPostForm" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="editTitle">Title</label>
        <input type="text" 
          id='postTitle'
          required
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />

        <label htmlFor="editBody">Content</label>
        <textarea
          id='postBody'
          required
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
        />
        <button type="submit" onClick={() => handleEdit(id)}>Edit Post</button>
      </form>
    </main>
  )
}

export default EditPost