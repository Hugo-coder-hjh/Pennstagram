/* eslint-disable */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// import {
//   getAllPosts, createPost, addComments, getPostById,
// } from './mockAPI';

// const mockAxios = new MockAdapter(axios);

// // getAllPosts
// describe('the api returned correct data', () => {
//   // const mockAxios1 = new MockAdapter(axios);
//   // seed data for all get requests. You can specify an endpoint to mock
//   mockAxios.onGet().reply(200, {
//     username: 'Bruce Lee', userId: 2,
//   });
//   test('(then/catch)', () => getAllPosts().then((data) => expect(data.username).toBe('Bruce Lee')));

//   test('(async/await)', async () => {
//     const data = await getAllPosts();
//     expect(data.username).toBe('Bruce Lee');
//   });

//   test('the information is correct', () => getAllPosts().then((data) => expect(data.userId).toBe(2)));
// });

// // createPost
// describe('the api created correct data', () => {
//   // seed data for all post requests. You can specify an endpoint to mock
//   // const mockAxios2 = new MockAdapter(axios);
//   const newPost = {
//     photo: 'http://loremflickr.com/640/480/technics',
//     userId: 1,
//     likes: [],
//     comment: [],
//     profilePicture: null,
//     username: 'Bruce Lee',
//   };

//   mockAxios.onPost(/Posts/).reply(200, {
//     photo: 'http://loremflickr.com/640/480/technics',
//     userId: 2,
//     likes: [],
//     comment: [],
//     profilePicture: null,
//     username: 'Bruce Lee1',
//   });

//   test('(then/catch)', () => createPost(newPost).then((data) => expect(data?.username).toBe('Bruce Lee1')));
//   test('the information is correct', () => createPost(newPost).then((data) => expect(data?.userId).toBe(2)));
// });

// // addComments
// describe('the api created correct data', () => {
//   // const mockAxios3 = new MockAdapter(axios);
//   // seed data for all post requests. You can specify an endpoint to mock
//   const newComments = {
//     comments: [],
//   };

//   mockAxios.onPost(/comments/).reply(200, {
//     comments: [1, 2, 3],
//   });

//   test('(then/catch)', () => addComments(newComments).then((data) => expect(data.comments.length).toBe(3)));
// });

// // getPostById
// describe('the api returned correct data', () => {
//   // seed data for all get requests. You can specify an endpoint to mock
//   mockAxios.onGet('posts/1').reply(200, {
//     username: 'Bruce Lee', userId: 2,
//   });
//   test('(then/catch)', () => getPostById(1).then((data) => expect(data.username).toBe('Bruce Lee')));
//   test('the information is correct', () => getPostById(1).then((data) => expect(data.userId).toBe(2)));
// });

const lib = require('./mockAPI.js');

// const mockAxios2 = new MockAdapter(axios);

describe('the api returned all posts', () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('the username of the post is Van Ferry (async/await)', async () => {
    // seed data for all get requests. You can specify an endpoint to mock
    mockAxios.onGet().reply(200, {
      name: 'Van Ferry', userId: 32 ,
    });
    const data = await lib.getAllPosts();
    console.log('data', data.name);
    expect(data.name).toBe('Van Ferry');
  });

  test('the userId is correct', () => {
    // seed data for all get requests. You can specify an endpoint to mock
    mockAxios.onGet().reply(200, {
      name: 'Van Ferry', userId: 32 ,
    });
    lib.getAllPosts().then((data) => expect(data.userId).toBe(32));
  });
});

describe('the api returned all users', () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  // { name: 'Gloria Collins Jr.', main: { password: '_7L7DbfBHLrPSSF' } ,}
  test('the name of the user is Gloria Collins Jr. (async/await)', async () => {
    // seed data for all get requests. You can specify an endpoint to mock
    mockAxios.onGet().reply(
      200,
      {
        name: 'Gloria Collins Jr.', main: { password: '_7L7DbfBHLrPSSF' },
      },
    );
    const data = await lib.getAllUser();
    expect(data.name).toBe('Gloria Collins Jr.');
  });

  test('the password is correct', () => {
    // seed data for all get requests. You can specify an endpoint to mock
    mockAxios.onGet().reply(
      200,
      {
        name: 'Gloria Collins Jr.', main: { password: '_7L7DbfBHLrPSSF' },
      },
    );
    lib.getAllUser().then((data) => expect(data.main.password).toBe('_7L7DbfBHLrPSSF'));
  });
});

// getPostById
describe('getPostById', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('get user', async () => {
      // seed data for all get requests. You can specify an endpoint to mock
      mockAxios.onGet().reply(200, {
          name: 'Bruce Lee', userId: 2,
      });
      const data = await lib.getPostById(1);
      console.log ("data", data);
      expect(data.name).toBe('Bruce Lee');
  });
});

// createPost
describe('createPost', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('createPost', async () => {
      // seed data for all get requests. You can specify an endpoint to mock
      const newPost = {
          photo: 'http://loremflickr.com/640/480/technics',
          userId: 1,
          likes: [],
          comment: [],
          profilePicture: null,
          username: 'Bruce Lee',
      };
      mockAxios.onPost(/post/).reply(200, {
          photo: 'http://loremflickr.com/640/480/catss',
          userId: 2,
          likes: [],
          comment: [],
          profilePicture: null,
          username: 'Bruce Lee1',
      });
      const data = await lib.createPost(newPost);
      console.log ("data", data);
      expect(data.userId).toBe(2);
  });
});

// addComments
describe('addComments', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('addComments', async () => {
      // seed data for all get requests. You can specify an endpoint to mock
      const newComments = {
          comments: [],
      };
      mockAxios.onPost().reply(200, {
          comments: [1, 2, 3],
      });
      const data = await lib.addComments(newComments);
      console.log ("data", data);
      expect(data.comments.length).toBe(3);
  });
});

// updatePost
describe('updatePost', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('updatePost', async () => {
      // seed data for all get requests. You can specify an endpoint to mock
      const postUpdates = {
          photo: 'abcdefg' ,
      };
      mockAxios.onPut().reply(200, {
          photo: 'abcd' ,
      });
      lib.updatePost(postUpdates, "1");
  });
});

// updateLike
describe('updateLike', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('updateLike', async () => {
      const Post = {
          photo: 'http://loremflickr.com/640/480/technics',
          userId: 1,
          likes: [],
          comment: [],
          profilePicture: null,
          username: 'Bruce Lee',
      };
      mockAxios.onPut().reply(200, {
          photo: 'http://loremflickr.com/640/480/technics',
          userId: 1,
          likes: [],
          comment: [],
          profilePicture: null,
          username: 'Bruce Lee',
      });
      lib.updateLike(Post, "1");
      expect(Post.likes.length).toBe(1);
  });
});


// updateComment
describe('updateComment', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('updateComment', async () => {
      const comment = {
        id: "1",
        comments: "5545",
      };
      mockAxios.onPut().reply(200, {
        id: "1",
        comments: "223123",
      });
      lib.editCommentInComments(comment, "1");
      // expect(Post.likes.length).toBe(1);
  });
});

// updateuserInfo
describe('updateuserInfo', () => {
  let mockAxios;
  
  beforeAll(() => {
      mockAxios = new MockAdapter(axios);
  })
  
  afterEach(() => {
      mockAxios.reset();
  })
  
  test('updateuserInfo', async () => {
      // seed data for all get requests. You can specify an endpoint to mock
      const userUpdates = {
        password: 'sYkoD0zZ7qh9WwP',
      };
      mockAxios.onPut().reply(200, {
        password: 'wwwwdf',
      });
      lib.updateUserInfo("1",userUpdates);
  });
});






// getCommentById
// describe('getCommentById', () => {
//   let mockAxios;
  
//   beforeAll(() => {
//       mockAxios = new MockAdapter(axios);
//   })
  
//   afterEach(() => {
//       mockAxios.reset();
//   })
  
//   test('getCommentById', async () => {

//     mockAxios.onGet().reply(200, "comment");
//     let post_id = 1
//     const result = lib.getCommentById(post_id);
//     console.log("result", result);
//     console.log("data", result.data)
//     result.then((data) => expect(data.data).toEqual("comment"));
//     result.then((data) => expect(data.status).toBe(200));
     
//   });
// });






















// addComment
// describe('addComment', () => {
//   let mockAxios;
  
//   beforeAll(() => {
//       mockAxios = new MockAdapter(axios);
//   })
  
//   afterEach(() => {
//       mockAxios.reset();
//   })
  
//   test('addComment', async () => {
//       // seed data for all get requests. You can specify an endpoint to mock
//       const addComment = {
//         password: 'sYkoD0zZ7qh9WwP',
//       };
//       mockAxios.onPut().reply(200, {
//         password: 'wwwwdf',
//       });
//       lib.addComment("1", "mike", addComment, "2");
//   });
// });