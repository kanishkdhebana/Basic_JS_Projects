document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const postForm = document.getElementById('post-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const blogListContainer = document.getElementById('blog-list-container');
    const noPostsMessage = document.getElementById('no-posts-message');
    const postContentContainer = document.getElementById('post-content-container');
    const modalTitle = document.getElementById('modal-title');
    const postIdInput = document.getElementById('post-id');
    const postTitleInput = document.getElementById('post-title');
    const postAuthorInput = document.getElementById('post-author');
    const postContentInput = document.getElementById('post-content-input');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    let postToDeleteId = null;
    let activePostId = null;
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    const savePosts = () => {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    };

    const renderBlogList = () => {
        blogListContainer.innerHTML = '';
        if (posts.length === 0) {
            noPostsMessage.classList.remove('hidden');

        } else {
            noPostsMessage.classList.add('hidden');
            const sortedPosts = [...posts].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
            sortedPosts.forEach(post => {
                const listItem = document.createElement('div');

                listItem.className = `blog-list-item ${post.id === activePostId ? 'active' : ''}`;
                listItem.dataset.id = post.id;
                listItem.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.date}</p>
                `;
                blogListContainer.appendChild(listItem);
            });
        }
    };

    const renderActivePost = () => {
        if (activePostId && posts.length > 0) {
            const post = posts.find(p => p.id === activePostId);
            
            if (post) {
                postContentContainer.innerHTML = `
                <div class="fade-in-up">
                    <h2 style="font-size: 2.25rem; font-weight: 700; color: white; margin-bottom: 0.75rem;">${post.title}</h2>
                    <div style="font-size: 0.875rem; color: #a1a1aa; margin-bottom: 1.5rem;">
                        <span>By ${post.author}</span> &bull; <span>${post.date}</span>
                    </div>
                    <p class="blog-content" style="line-height: 1.625; margin-bottom: 2rem;">${post.content}</p>
                    <div class="post-actions">
                        <button data-id="${post.id}" class="edit-btn">Edit</button>
                        <button data-id="${post.id}" class="delete-btn">Delete</button>
                    </div>
                </div>`;

            } else {
                 activePostId = null;
                 renderActivePost();
            }

        } else {
             postContentContainer.innerHTML = `
                <div class="welcome-message fade-in-up">
                    <h2>Welcome to your blog</h2>
                    <p>Select a post from the left to read, or create a new one.</p>
                </div>
             `;
        }
    };

    const refreshUI = () => {
        renderBlogList();
        renderActivePost();
    };
    
    const showModal = (isEdit = false, post = null) => {
        postForm.reset();
        if (isEdit && post) {
            modalTitle.textContent = 'Edit Post';
            postIdInput.value = post.id;
            postTitleInput.value = post.title;
            postAuthorInput.value = post.author
            postContentInput.value = post.content;
            
            if (post.content.trim() === '') {
                postContentInput.value = '';
            }

        } else {
            modalTitle.textContent = 'Create New Post';
            postIdInput.value = '';
        }
        postModal.classList.remove('hidden');
    };

    const hideModal = () => postModal.classList.add('hidden');

    const showDeleteModal = (id) => {
        postToDeleteId = id;
        deleteModal.classList.remove('hidden');
    };

    const hideDeleteModal = () => {
        deleteModal.classList.add('hidden');
        postToDeleteId = null;
    };

    createPostBtn.addEventListener('click', () => showModal());
    cancelBtn.addEventListener('click', hideModal);

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = postIdInput.value;
        const title = postTitleInput.value.trim();
        const author = postAuthorInput.value.trim();
        const content = postContentInput.value.trim();

        if (!title || !author || !content) return;

        if (id) { 
            const postIndex = posts.findIndex(p => p.id === id);
            if (postIndex > -1) {
                posts[postIndex] = { ...posts[postIndex], title, author, content };
            }

        } else { 
            const now = new Date();
            const newPost = {
                id: crypto.randomUUID(),
                title, author, content,
                date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                rawDate: now.toISOString()
            };
            posts.push(newPost);
            activePostId = newPost.id;
        }
        savePosts();
        refreshUI();
        hideModal();
    });
    
    blogListContainer.addEventListener('click', (e) => {
        const listItem = e.target.closest('.blog-list-item');
        if (listItem) {
            activePostId = listItem.dataset.id;
            refreshUI();
        }
    });

    postContentContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const post = posts.find(p => p.id === id);
            if (post) showModal(true, post);

        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            showDeleteModal(id);
        }
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    
    confirmDeleteBtn.addEventListener('click', () => {
        if (!postToDeleteId) return;
        posts = posts.filter(p => p.id !== postToDeleteId);
        savePosts();
        
        if (activePostId === postToDeleteId) {
            const sortedPosts = [...posts].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
            activePostId = sortedPosts.length > 0 ? sortedPosts[0].id : null;
        }

        refreshUI();
        hideDeleteModal();
    });
    
    const initialize = () => {
        if (posts.length > 0 && !activePostId) {
            const sortedPosts = [...posts].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
            activePostId = sortedPosts[0].id;
        }
        refreshUI();
    };

    initialize();
});