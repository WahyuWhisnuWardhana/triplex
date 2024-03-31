import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($payload: RegisterInput) {
    register(payload: $payload) {
      _id
      name
      username
      email
      password
      follower {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      following {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      userFollower {
        _id
        name
        username
        email
        password
      }
      userFollowing {
        _id
        name
        username
        email
        password
      }
    }
  }
`;

export const SHOW_POSTS = gql`
  query ShowPosts {
    showPosts {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        _id
        name
        username
        email
        password
        follower {
          _id
          followingId
          followerId
          createdAt
          updatedAt
        }
        following {
          _id
          followingId
          followerId
          createdAt
          updatedAt
        }
        userFollower {
          _id
          name
          username
          email
          password
        }
        userFollowing {
          _id
          name
          username
          email
          password
        }
      }
    }
  }
`;

export const CHECK_LIKE = gql`
  mutation CheckLike($postId: ID) {
    checkLike(postId: $postId) {
      message
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUsername($username: String) {
    searchUsername(username: $username) {
      _id
      name
      username
      email
      password
      follower {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      following {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      userFollower {
        _id
        name
        username
        email
        password
      }
      userFollowing {
        _id
        name
        username
        email
        password
      }
    }
  }
`;

export const USER_DETAIL = gql`
  query UserDetail($userId: ID) {
    userDetail(userId: $userId) {
      _id
      name
      username
      email
      password
      follower {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      following {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      userFollower {
        _id
        name
        username
        email
        password
      }
      userFollowing {
        _id
        name
        username
        email
        password
      }
    }
  }
`;
