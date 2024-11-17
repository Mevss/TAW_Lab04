const posts = [
    {
        id: 1,
        title: 'Post 1',
        text: 'Bacon ipsum dolor amet landjaeger shank ribeye ground round, ham hock hamburger prosciutto tail pork belly tri-tip pork loin ham corned beef beef ribs picanha. Strip steak pastrami bacon bresaola brisket.',
        image: 'https://www.stockvault.net/data/2019/08/31/269064/thumb16.jpg'
    },
    {
        id: 2,
        title: 'Post 2',
        text: ' Swine pork chop shankle, landjaeger leberkas tongue beef ribs pork belly fatback. ',
        image: 'https://cdn.pixabay.com/photo/2017/05/09/21/49/gecko-2299365_960_720.jpg'
    },
    {
        id: 3,
        title: 'Post 3',
        text: 'Kevin buffalo leberkas shank bresaola, meatloaf kielbasa frankfurter. Beef t-bone shank ham hock rump filet mignon picanha brisket ball tip short ribs capicola short loin buffalo chicken porchetta.',
        image: 'https://www.zuivelhoeve.nl/wp-content/uploads/2016/04/download-images-of-gentle-dogs-6866-1-1024x640.jpg'
    },
    {
        id: 4,
        title: 'Post 4',
        text: 'Prosciutto sausage alcatra hamburger leberkas turkey picanha salami strip steak porchetta kielbasa tail.',
        image: 'https://www.earthintransition.org/wp-content/uploads/2011/04/polar-bears-putin-1.jpg'
    },
    {
        id: 5,
        title: 'Post 5',
        text: 'Cupim beef ribs tenderloin, ribeye meatball shankle tongue fatback. Andouille shoulder salami hamburger, frankfurter sausage kielbasa t-bone turkey shankle chicken sirloin rump. ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLojrAHNeZsU_ykTz_GyOIhoa5eGQuTIxSAQ&usqp=CAU'
    },
    {
        id: 6,
        title: 'Post 6',
        text: 'Tail salami pancetta spare ribs chicken ball tip shankle landjaeger strip steak kevin short ribs beef meatball. Pancetta porchetta pork belly short ribs short loin. Jowl short loin turducken picanha ball tip kielbasa pig pork chop beef turkey venison.',
        image: 'https://picjumbo.com/wp-content/uploads/the-golden-gate-bridge-sunset-1080x720.jpg'
    },
    {
        id: 7,
        title: 'Post 7',
        text: 'Kielbasa landjaeger alcatra, pork hamburger tenderloin beef filet mignon t-bone ground round prosciutto picanha. ',
        image: 'http://getwallpapers.com/wallpaper/full/d/9/8/382442.jpg'
    },
    {
        id: 8,
        title: 'Post 8',
        text: 'Ham cupim pastrami salami alcatra tenderloin pork chop flank leberkas kevin bresaola doner tongue. Rump tenderloin sirloin, picanha pig burgdoggen ribeye boudin swine tri-tip strip steak pastrami.',
        image: 'https://www.stockvault.net/data/2007/03/01/102413/thumb16.jpg'
    },
    {
        id: 9,
        title: 'Post 9',
        text: 'Turducken short ribs boudin, strip steak tri-tip ball tip turkey shankle prosciutto tenderloin pork chop.',
        image: 'https://stokpic.com/wp-content/uploads/2017/07/Friends-Playing-In-The-Sea-and-Spashing-Water-2-400x284.jpg'
    },
    {
        id: 10,
        title: 'Post 10',       text: 'Buffalo chicken boudin leberkas. Shoulder spare ribs tongue chicken drumstick tenderloin venison pancetta pork salami hamburger rump cupim alcatra meatloaf. Turkey chuck beef ribs porchetta, cupim beef pancetta kevin tri-tip tongue swine leberkas strip steak pastrami. ',
        image: 'https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg'
    },
 ];
 
 
 const dataEndpoint = (router) => {
    router.get('/api/posts', async (request, response, next) => {
        const { page = 1, limit = 5, title = '' } = request.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return response.status(400).send({
                error: 'Invalid page or limit parameters. Both must be positive numbers.'
            });
        }

        let filteredPosts = posts;
        if (title) {
            filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(title.toLowerCase())
            );
        }

        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        
        const pagination = {
            total: filteredPosts.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(filteredPosts.length / limitNum)
        };

        if (startIndex > 0) {
            pagination.previousPage = pageNum - 1;
        }
        if (endIndex < filteredPosts.length) {
            pagination.nextPage = pageNum + 1;
        }

        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        response.status(200).send({
            posts: paginatedPosts,
            pagination: pagination
        });
    });

    router.get('/api/post/:id', async (request, response, next) => {
        console.log(request.params.id);
        response.status(200).send({});
    });

    router.post('/api/posts', async (request, response, next) => {
        const { id, title, text, image } = request.body;

        if (!id || !title || !text || !image) {
            return response.status(400).send({
                error: 'Missing required fields: id, title, text, or image'
            });
        }

        const existingPost = posts.find(post => post.id === id);
        if (existingPost) {
            return response.status(400).send({
                error: 'Post with the given id already exists'
            });
        }

        const newPost = { id, title, text, image };
        posts.push(newPost);

        response.status(201).send({ post: newPost });
    });
    
    router.put('/api/posts/:id', async (request, response, next) => {
        const postId = parseInt(request.params.id);
        const { title, text, image } = request.body;

        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return response.status(404).send({
                error: 'Post not found'
            });
        }

        if (!title && !text && !image) {
            return response.status(400).send({
                error: 'At least one field (title, text, or image) must be provided for update'
            });
        }

        const currentPost = posts[postIndex];
        const updatedPost = {
            id: currentPost.id,
            title: title || currentPost.title,
            text: text || currentPost.text,
            image: image || currentPost.image
        };

        posts[postIndex] = updatedPost;

        response.status(200).send({
            message: 'Post updated successfully',
            post: updatedPost
        });
    });

    router.delete('/api/posts/:id', async (request, response, next) => {
        const postId = parseInt(request.params.id);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return response.status(404).send({
                error: 'Post not found'
            });
        }

        posts.splice(postIndex, 1);
        response.status(200).send({
            message: 'Post deleted successfully'
        });
    });
};

export default dataEndpoint;