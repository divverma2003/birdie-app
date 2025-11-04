export const POSTS = [
  {
    _id: "1",
    text: "What is your favorite programming language? 💻",
    img: "/posts/post-1.jpg",
    user: {
      username: "emeridoe",
      profilePicture: "/avatars/profile-1.jpg",
      fullName: "Emeri Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profilePicture: "/avatars/profile-2.jpg",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "2",
    text: "How you guys doing? 😊",
    user: {
      username: "bobdoe",
      profilePicture: "/avatars/profile-3.jpg",
      fullName: "Bob Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profilePicture: "/avatars/profile-2.jpg",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "3",
    text: "Butterfly fish are amazing creatures! 🦋🐠",
    img: "/posts/post-2.jpg",
    user: {
      username: "emeridoe",
      profilePicture: "/avatars/profile-1.jpg",
      fullName: "Emeri Doe",
    },
    comments: [],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
    ],
  },
  {
    _id: "4",
    text: "I'm learning GO this week. Any tips? 🤔",
    img: "/posts/post-3.jpg",
    user: {
      username: "emeridoe",
      profilePicture: "/avatars/profile-1.jpg",
      fullName: "Emeri Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profilePicture: "/avatars/profile-2.jpg",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
      "6658s897",
      "6658s898",
      "6658s899",
    ],
  },
];

export const USERS_FOR_RIGHT_PANEL = [
  {
    _id: "1",
    fullName: "Emeri Doe",
    username: "EmeriDoe",
    profilePicture: "/avatars/profile-1.jpg",
  },
  {
    _id: "2",
    fullName: "Jane Doe",
    username: "janedoe",
    profilePicture: "/avatars/profile-2.jpg",
  },
  {
    _id: "3",
    fullName: "Bob Doe",
    username: "bobdoe",
    profilePicture: "/avatars/profile-3.jpg",
  },
  {
    _id: "4",
    fullName: "Daisy Doe",
    username: "daisydoe",
    profilePicture: "/avatars/profile-4.png",
  },
];
