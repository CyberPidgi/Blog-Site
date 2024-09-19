import React from 'react'

const NewPost = ({
  handleSubmit, postTitle, setPostTitle, postBody, setPostBody
}) => {
  return (
    <main className='NewPost'>
      <h1>NewPost</h1>
      <form action="" className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title</label>
        <input type="text" 
          id='postTitle'
          required
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />

        <label htmlFor="postBody">Content</label>
        <textarea
          id='postBody'
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>Make New Post</button>
      </form>
    </main>
  )
}

export default NewPost