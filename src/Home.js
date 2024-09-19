import React from 'react'
import Post from './Post'

const Home = ({ posts, fetchError, isLoading }) => {
  return (
    <main className='Home'>
      {isLoading && <p className='statusMsg'>Loading posts ...</p>}
      {fetchError && <p className='statusMsg' style={{color: 'red'}}>{fetchError}</p>}
      {!isLoading && !fetchError && 
        (posts.length ? (
          posts.map((post, index) => <Post post={post} key={index}/>)
        ) : <p className='statusMsg'>No posts to display</p>)
      }
    </main>
  )
}

export default Home