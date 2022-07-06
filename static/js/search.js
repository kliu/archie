var searchElem = document.getElementById("search-input");
var posts;
var postsByTitle;
var index;
function loadSearch() { 
    // call the index.json file from server by http get request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    posts = data.items; // load json data
                    postsByTitle = posts.reduce((acc, curr) => {
                        acc[curr.title] = curr;
                        return acc;
                    }, {})
                    index = lunr(function () {
                        this.use(lunr.multiLanguage('en', 'zh'));
                        this.ref('title')
                        this.field('title')
                        this.field('content')
                        posts.forEach(function (doc) {
                            this.add(doc)
                        }, this)
                    })
                }
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.open('GET', "../search.json");
    xhr.send();
}
loadSearch();
function showSearchResults() {
    var query = searchElem.value || ''; // get the value from input
    var searchString = query.replace(/\s+/g, ''); // clear white spaces
    var target = document.getElementById('search-result'); // target the ul list to render the results
    if (searchString && searchString != '') {
        var matches = index.search(searchString);
        var matchPosts = [];
        matches.forEach((m) => {
            matchPosts.push(postsByTitle[m.ref]);
        });
        if (matchPosts.length > 0) {
            // match found with input text and lunr index
            target.innerHTML = matchPosts.map(function (p) {
                if (p != undefined) {
                    return `<li class="post">
                                <a href="${p.url}"> ${p.title}</a> <span class="meta">${p.date}</span>
                            </li>`;
                }
            }).join('');
        } else {
            // if no results found, then render a general message
            target.innerHTML = `<br><h2 style="text-align:center">No search results found</h2>`;
        };
    } else {
        target.innerHTML = ''
    }
};