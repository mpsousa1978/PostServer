import React, { useState } from "react";
import Constants from "./Utilities/Constants";
import PostCreateForm from "./Components/PostCreateForm";
import PostUpdateForm from "./Components/PostUpdateForm";

function App() {
  const [post, setPost] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentBeingUpdated, setPostCurrentBeingUpdated] = useState(null);

  function GetPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;

    fetch(url, {
      method: "GET",
    })
      .then(response => response.json())
      .then(postFromServer => {
        setPost(postFromServer);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }
  function deletePost(postId) {
    const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
    fetch(url, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(reposteFromServer => {
        console.log(reposteFromServer);
        onPostDeleted(postId);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {showingCreateNewPostForm === false && postCurrentBeingUpdated === null && (
            <div>
              <h1>Ap.new core React</h1>
              <div className="mt-5">
                <button onClick={GetPosts} className="btn btn-dark btn-lg w-100">
                  Get Post from server
                </button>
                <button
                  onClick={() => setShowingCreateNewPostForm(true)}
                  className="btn btn-secondary btn-lg w-100 mt-4"
                >
                  Create new Post from server
                </button>
              </div>
            </div>
          )}

          {post.length > 0 &&
            showingCreateNewPostForm === false &&
            postCurrentBeingUpdated === null &&
            renderPostTable()}

          {postCurrentBeingUpdated !== null && (
            <PostUpdateForm post={postCurrentBeingUpdated} onPostUpdated={onPostUpdated} />
          )}
          {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}
        </div>
      </div>
    </div>
  );

  function renderPostTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">PostId(PK)</th>
              <th scope="col">PostId(Title)</th>
              <th scope="col">PostId(Content)</th>
              <th scope="col">PostId(CRUD Operation)</th>
            </tr>
          </thead>
          <tbody>
            {post.map(post => (
              <tr key={post.postId}>
                <th scope="row">{post.postId}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button onClick={() => setPostCurrentBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">
                    update
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Ary you sure want to delete the posto titled "${post.title}"?`))
                        deletePost(post.postId);
                    }}
                    className="btn btn-secondary btn-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setPost([])} className="btn btn-dark btn-lg w-100">
          Empity Post
        </button>
      </div>
    );
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false);
    if (createdPost === null) {
      return;
    }
    alert(`Posto successfully created. After click OK, your post title ${createdPost.title} will show up in the below`);
    GetPosts();
  }

  function onPostUpdated(updatePost) {
    setPostCurrentBeingUpdated(null);
    if (updatePost === null) {
      return;
    }

    let postCopy = [...post];
    const index = postCopy.findIndex((postCopyPost, currentIndex) => {
      if (postCopyPost.postId === updatePost.postId) {
        return true;
      }
    });

    if (index !== -1) {
      postCopy[index] = updatePost;
    }

    setPost(postCopy);
    alert(`Post successfuly updated. `);
  }

  function onPostDeleted(deletedPosrId) {
    let postCopy = [...post];
    const index = postCopy.findIndex((postCopyPost, currentIndex) => {
      if (postCopyPost.postId === deletedPosrId) {
        return true;
      }
    });

    if (index !== -1) {
      postCopy.splice(index, 1);
    }

    setPost(postCopy);
    alert(`Post deleted`);
  }
}

export default App;
