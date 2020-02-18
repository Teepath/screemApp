let db = {
    users:[
        {
            userId: 'ycO9ykjuJnUEbuKVciyRvad5Bvd2',
            email: 'tunde@gmail.com',
            handle: 'tunde',
            createdAt: '2019-09-25T18:55:31.100Z',
            imageUrl: 'image/dskfhhdgh/gdghdjsdjhs',
            website: 'https://user.com',
            location: 'Lagos, Nigeria'
        }
    ],
    streams:[
        {
            userHandle: 'user',
            body: 'this is the stream body',
            createdAt: '2019-09-10T11:46:01:018Z',
            likeCount: 5,
            commentCount:2
        }
    ],

    comments:[
        {
            userHandle: 'user',
            streamId: 'khjsggdjjsdghdgjsgjdg',
            body:'nice one mate!',
            createdAt: '2019=09-15T10:59:52.789Z'
        }
    ],
    notifications:[
        {
            recipient: 'trex',
            sender: 'tunde',
            read: 'true| false',
            streamId: 'sghdjkjkdkdjfkkf',
            type: 'like | comment',
            createdAt: '2019=09=15T10:59:52.7896'
        }
    ]
};




const userDetails = {
    //Redux data
    credentials:{
        userId: 'ycO9ykjuJnUEbuKVciyRvad5Bvd2',
        email: 'tunde@gmail.com',
        handle: 'tunde',
        createdAt: '2019-09-25T18:55:31.100Z',
        imageUrl: 'image/dskfhhdgh/gdghdjsdjhs',
        bio: 'Hello, my name is Tee, software engineer',
        website: 'https://user.com',
        location: 'Lagos, Nigeria'
    },
    likes:[
        {
            userHandle: 'tunde',
            streamId: `1789948849595886589`
        },
        {
            userHandle: 'tunde',
            streamId: `1789948849595886589`
        }
    ]
}



